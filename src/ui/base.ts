'use strict';

import * as vscode from 'vscode';
import UIHelper from '../helpers/ui'

/**
 * This is the base definition for UI files used in this project.
 */
export default abstract class MCModUIBase {
    private _context : vscode.ExtensionContext;
    private _editorId : string;
    private _editorTitle : string;
    private _mediaRoots : vscode.Uri[];
    private _scripts : vscode.Uri[];

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
        this._mediaRoots = [UIHelper.mediaRootUri(context)];
        this._scripts = [];
        this._editorId = 'mcmod.unknowntype';
        this._editorTitle = '<Unknown>';
    }

    /**
     * This is used internally by vscode to identify the type of editor.
     * @param editorId Identifier for this editor.
     */
    public setId(editorId: string) {
        this._editorId = editorId;
    }

    /**
     * The title used in tab for this editor.
     * @param title Title for this editor.
     */
    public setTitle(title: string) {
        this._editorTitle = title;
    }

    /**
     * Get the extension context for this page.
     */
    public context() : vscode.ExtensionContext {
        return this._context;
    }

    protected addRootMediaSource(uri: vscode.Uri) {
        this._mediaRoots.push(uri);
    }

    protected addScript(uri: vscode.Uri) {
        this._scripts.push(uri);
    }

    /**
     * Create a panel to be added to the window.
     */
    public async newPanel() : Promise<vscode.WebviewPanel> {
        let panel = vscode.window.createWebviewPanel(
            this._editorId,
            this._editorTitle,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: this._mediaRoots // local content allowed to be loaded.
            }
        );
        panel.webview.html = this.webviewContent();
        return panel;
    }

    private webviewContent() {
        return `
        <!DOCTYPE HTML>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${this._editorTitle}</title>
        </head>
        <body>
            <div class="container" style="min-height: 100vh; min-width=100vw">${this.bodyContent()}</div>
            
            ${this._scripts.map(s => `<script src="${s.with({scheme: 'vscode-resource'})}"></script>`).join('')}
        </body>
        </html>
        `;
    }

    protected abstract bodyContent() : string;
}