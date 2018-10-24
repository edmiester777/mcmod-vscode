'use strict';

import * as vscode from 'vscode';
import MCModUIBase from './base';
import MCModProjectDetails from './project_details';
import UIHelper from '../helpers/ui';

/**
 * The UI implementation for MCMod home.
 */
export default class MCModHome extends MCModUIBase {
    private _newProjectPage : MCModProjectDetails | null;

    constructor(context : vscode.ExtensionContext) {
        super(context);
        this._newProjectPage = null;
        this.setId('mcmod.home');
        this.setTitle("MCMod Home");
        this.addScript(UIHelper.mediaUri(this.context(), 'scripts', 'home.js'));
    }

    protected bodyContent(): string {
        return `
        <pre style="display: block;white-space: pre-nowrap;"><code style="color: inherit">
███╗   ███╗ ██████╗███╗   ███╗ ██████╗ ██████╗ 
████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗
██╔████╔██║██║     ██╔████╔██║██║   ██║██║  ██║
██║╚██╔╝██║██║     ██║╚██╔╝██║██║   ██║██║  ██║
██║ ╚═╝ ██║╚██████╗██║ ╚═╝ ██║╚██████╔╝██████╔╝
╚═╝     ╚═╝ ╚═════╝╚═╝     ╚═╝ ╚═════╝ ╚═════╝
        </code></pre>
        <h3>The better way to make minecraft mods.</h3>
        <a href="#" onClick="newProjectClicked()">Start a new project</a>
        `;
    }

    protected onMessageReceived(message: any): void {
        switch(message.command) {
            case 'newProject':
                if(!this._newProjectPage) {
                    console.log('test');
                    this._newProjectPage = new MCModProjectDetails(this.context());
                    this._newProjectPage.newPanel();
                }
                break;
        }
    }
}