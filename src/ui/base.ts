'use strict';

import * as vscode from 'vscode';
import UIHelper from '../helpers/ui';
import * as fs from 'fs';
import env from '../config/env';

/**
 * This is the base definition for UI files used in this project.
 */
export default abstract class MCModUIBase {
    private _currentPage: vscode.WebviewPanel | null;
    private _context: vscode.ExtensionContext;
    private _editorId: string;
    private _editorTitle: string;
    private _iconPath: vscode.Uri | null;
    private _mediaRoots: vscode.Uri[];
    private _priorityScripts: vscode.Uri[];
    private _scripts: vscode.Uri[];
    private _styles: vscode.Uri[];
    private _template: string | null;
    private _templateText: string | null;

    constructor(context: vscode.ExtensionContext) {
        this._currentPage = null;
        this._context = context;
        this._mediaRoots = [UIHelper.mediaRootUri(context)];
        this._priorityScripts = [];
        this._scripts = [];
        this._styles = [];
        this._editorId = 'mcmod.unknowntype';
        this._editorTitle = '<Unknown>';
        this._iconPath = null;
        this._template = null;
        this._templateText = null;

        this.setIconPath(UIHelper.mediaUri(this.context(), 'icons', 'minecraft-home-icon.png'));

        this.addRootMediaSource(UIHelper.mediaRootUri(context));
        this.addRootMediaSource(UIHelper.moduleRootUri(context, 'mdbootstrap'));
        this.addRootMediaSource(UIHelper.moduleRootUri(context, '@fortawesome'));
        this.addRootMediaSource(UIHelper.moduleRootUri(context, 'vue'));
        this.addPriorityScript(UIHelper.moduleAssetUri(context, 'mdbootstrap', 'js', 'jquery-3.3.1.min.js'));
        this.addScript(UIHelper.moduleAssetUri(context, 'mdbootstrap', 'js', 'popper.min.js'));
        this.addScript(UIHelper.moduleAssetUri(context, 'mdbootstrap', 'js', 'bootstrap.min.js'));
        this.addScript(UIHelper.moduleAssetUri(context, 'mdbootstrap', 'js', 'mdb.min.js'));
        this.addScript(UIHelper.moduleAssetUri(context, 'vue', 'dist', 'vue.min.js'));
        this.addScript(UIHelper.mediaUri(context, 'scripts', 'ui', 'loader.js'));

        // styles
        this.addStyle(UIHelper.moduleAssetUri(context, '@fortawesome', 'fontawesome-free', 'css', 'all.min.css'));
        this.addStyle(UIHelper.moduleAssetUri(context, 'mdbootstrap', 'css', 'bootstrap.min.css'));
        this.addStyle(UIHelper.moduleAssetUri(context, 'mdbootstrap', 'css', 'mdb.min.css'));
        this.addStyle(UIHelper.mediaUri(context, 'styles', 'loader.css'));
    }

    /**
     * Get the current page for this application.
     */
    public currentPage(): vscode.WebviewPanel | null {
        get: {
            return this._currentPage;
        }
    }

    /**
     * This is used internally by vscode to identify the type of editor.
     * @param editorId Identifier for this editor.
     */
    public setId(editorId: string) {
        this._editorId = editorId;
    }

    /**
     * Set the template for this UI.
     * @param template Name of template to load
     */
    public setTemplate(template: string) {
        this._template = template;
    }

    /**
     * The title used in tab for this editor.
     * @param title Title for this editor.
     */
    public setTitle(title: string) {
        this._editorTitle = title;
    }

    /**
     * Set the icon for this editor.
     * @param path Path to icon or null if none.
     */
    public setIconPath(path: vscode.Uri | null) {
        this._iconPath = path;
    }

    /**
     * Get the extension context for this page.
     */
    public context(): vscode.ExtensionContext {
        return this._context;
    }

    protected addRootMediaSource(uri: vscode.Uri) {
        this._mediaRoots.push(uri);
    }

    private addPriorityScript(uri: vscode.Uri) {
        this._priorityScripts.push(uri);
    }

    protected addScript(uri: vscode.Uri) {
        this._scripts.push(uri);
    }

    protected addStyle(uri: vscode.Uri) {
        this._styles.push(uri);
    }

    /**
     * Create a panel to be added to the window.
     */
    public async newPanel(): Promise<vscode.WebviewPanel> {
        if (!this._template) {
            throw new Error("Template property has not been set.");
        }

        let panel = vscode.window.createWebviewPanel(
            this._editorId,
            this._editorTitle,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true, // doesn't clear memory when tab is unfocused.
                localResourceRoots: this._mediaRoots // local content allowed to be loaded.
            }
        );
        if (this._iconPath instanceof vscode.Uri) {
            panel.iconPath = this._iconPath as vscode.Uri;
        }
        panel.webview.html = this.webviewContent();
        this._currentPage = panel;
        this._currentPage.onDidDispose((e) => {
            this._currentPage = null;
        });
        this._currentPage.webview.onDidReceiveMessage((m) => { this.onMessageReceived(m); });
        return this._currentPage;
    }

    private webviewContent(): string {
        const workbench = vscode.workspace.getConfiguration('workbench') || {};
        const isDark = (workbench.colorTheme || '').toLowerCase().includes('dark');
        return `
        <!DOCTYPE HTML>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${this._editorTitle}</title>
            ${this._priorityScripts.map(s => `<script src="${s.with({ scheme: 'vscode-resource' })}"></script>`).join('')}
            <script type="text/javascript">
                var vscode = acquireVsCodeApi();
                var __mounted = false;
                var __afterVueRender = [];

                // serialize form to normalized json
                function serializeForm(form) {
                    var res = {};
                    var arr = form.serializeArray();
                    arr.map(o => { res[o.name] = o.value; });
                    return res;
                }

                // form validation
                function validateForm(form) {
                    var success = form.checkValidity();
                    form.classList.add('was-validated');
                    return success;
                }

                // on mounted
                $.fn.extend({
                    mounted: function(func) {
                        if(__mounted) {
                            func();
                        }
                        else {
                            __afterVueRender.push(func);
                        }
                    }
                });
            </script>
            ${this._styles.map(s => `<link rel="stylesheet" href="${s.with({ scheme: 'vscode-resource' })}" />`).join('')}
        </head>
        <body class="${isDark ? 'mdb-skin' : ''}">
            <div id="appContainer" class="container-fluid" style="min-height: 100vh; min-width=100vw">${this.loadTemplate()}</div>
            
            ${this._scripts.map(s => `<script src="${s.with({ scheme: 'vscode-resource' })}"></script>`).join('')}
            
            <script type="text/javascript">
                $(document).ready(function() {
                    var app = new Vue({
                        el: '#appContainer',
                        data: ${JSON.stringify(this._bodyContent())},
                        mounted() {
                            __mounted = true;
                            for(var i = 0; i < __afterVueRender.length; ++i) {
                                __afterVueRender[i]();
                            }
                        }
                    });
                });
            </script>
        </body>
        </html>
        `;
    }

    private loadTemplate(): string {
        if (!this._template) {
            throw new Error("Template property has not been set.");
        }
        if (this._templateText) {
            return this._templateText;
        }

        let uri = UIHelper.mediaUri(this.context(), "templates", (this._template as string) + '.html');
        this._templateText = fs.readFileSync(uri.fsPath, 'utf8');
        return this._templateText;
    }

    private _bodyContent(): any {
        var opts = this.bodyContent() as any;
        opts.env = env;
        opts.media = function (...path: string[]): vscode.Uri {
            return UIHelper.mediaUri(this.context, ...path);
        };
        return opts;
    }

    protected postMessage(message: any) {
        const current = this.currentPage();
        if(!!current) {
            current.webview.postMessage(message);
        }
    }

    protected abstract bodyContent(): object;
    protected abstract onMessageReceived(message: any): void;
}