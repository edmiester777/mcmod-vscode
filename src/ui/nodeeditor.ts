/**
 * This is the UI definition for the nodal editor.
 */
'use strict';

import * as vscode from 'vscode';
import UIHelper from '../helpers/ui';
import UIBase from './base'

export default class MCModNodeEditor extends UIBase {
    constructor(context : vscode.ExtensionContext) {
        super(context);
        this.setId("mcmod.nodeeditor");
        this.setTitle("Node Editor");
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'vue', 'dist', 'vue.min.js'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'rete', 'build', 'rete.min.js'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'rete-vue-render-plugin', 'build', 'vue-render-plugin.min.js'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'rete-connection-plugin', 'build', 'connection-plugin.min.js'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'rete-area-plugin', 'build', 'area-plugin.min.js'));
        this.addScript(UIHelper.mediaUri(this.context(), 'scripts', 'editor.js'));
    }

    protected bodyContent() : string {
        return `
        <div id="rete" style="flex: 1 1 auto;"></div>
        `;
    }
}