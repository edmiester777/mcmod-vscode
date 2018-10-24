'use strict';

import MCModUIBase from './base';
import * as vscode from 'vscode';

export default class MCModProjectDetailsPage extends MCModUIBase {
    constructor(context: vscode.ExtensionContext) {
        super(context);
    }

    protected bodyContent(): string {
        return `
        <h1>Start a new project</h1><hr />
        <input type="text" placeholder="Project Name" />
        `;
    }

    protected onMessageReceived(message: any): void {}
}