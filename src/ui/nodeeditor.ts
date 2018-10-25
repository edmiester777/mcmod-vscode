'use strict';

import * as vscode from 'vscode';
import UIHelper from '../helpers/ui';
import MCModUIBase from './base';

/**
 * This is the UI definition for the nodal editor.
 */
export default class MCModNodeEditor extends MCModUIBase {
    constructor(context : vscode.ExtensionContext) {
        super(context);
        this.setId("mcmod.nodeeditor");
        this.setTitle("Node Editor");
        this.addRootMediaSource(UIHelper.moduleRootUri(this.context(), 'vue'));
        this.addRootMediaSource(UIHelper.moduleRootUri(this.context(), 'rete'));
        this.addRootMediaSource(UIHelper.moduleRootUri(this.context(), 'rete-vue-render-plugin'));
        this.addRootMediaSource(UIHelper.moduleRootUri(this.context(), 'rete-connection-plugin'));
        this.addRootMediaSource(UIHelper.moduleRootUri(this.context(), 'rete-area-plugin'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'vue', 'dist', 'vue.min.js'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'rete', 'build', 'rete.min.js'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'rete-vue-render-plugin', 'build', 'vue-render-plugin.min.js'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'rete-connection-plugin', 'build', 'connection-plugin.min.js'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'rete-area-plugin', 'build', 'area-plugin.min.js'));
        this.addScript(UIHelper.mediaUri(this.context(), 'scripts', 'editor.js'));
    }

    protected bodyContent() : object {
        return {};
        //return `<div id="rete" style="min-height: 100%"></div>`;
    }

    protected onMessageReceived(message: any): void {}
}