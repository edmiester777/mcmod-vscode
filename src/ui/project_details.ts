'use strict';

import MCModUIBase from './base';
import * as vscode from 'vscode';

export default class MCModProjectDetailsPage extends MCModUIBase {
    private _projectDir : string | null;

    constructor(context: vscode.ExtensionContext, projectDir : string | null = null) {
        super(context);
        this._projectDir = projectDir;
    }

    protected bodyContent(): {[name: string]: any} {
        return {};
    }

    protected onMessageReceived(message: any): void {}
}