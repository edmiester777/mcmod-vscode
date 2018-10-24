import * as vscode from 'vscode';

/**
 * This is the base definition for UI files used in this project.
 */
export default abstract class UIBase {
    private _context : vscode.ExtensionContext;
    private _editorId : string;
    private _editorTitle : string;
    private _scripts : vscode.Uri[];

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
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
                localResourceRoots: this._scripts // local content allowed to be loaded.
            }
        );
        panel.webview.html = this.webviewContent();
        return panel;
    }

    private webviewContent() {
        return `
        <!DOCTYPE HTML>
        <html>
        <head>
            <title>${this._editorTitle}</title>
        </head>
        <body>
            <!-- CONTENT -->
            ${this.bodyContent()}
            
            <!-- SCRIPTS -->
            ${this._scripts.map(s => `<script src="${s.with({scheme: 'vscode-resource'})}"></script>`)}
        </body>
        </html>
        `;
    }

    protected abstract bodyContent() : string;
}