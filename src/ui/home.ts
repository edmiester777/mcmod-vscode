'use strict';

import * as vscode from 'vscode';
import MCModUIBase from './base';

/**
 * The UI implementation for MCMod home.
 */
export default class MCModHome extends MCModUIBase {
    constructor(context : vscode.ExtensionContext) {
        super(context);
        this.setId('mcmod.home');
        this.setTitle("MCMod Home");
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
        `;
    }
}