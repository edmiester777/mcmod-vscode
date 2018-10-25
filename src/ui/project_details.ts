'use strict';

import MCModUIBase from './base';
import * as vscode from 'vscode';
import UIHelper from '../helpers/ui';

export default class MCModProjectDetailsPage extends MCModUIBase {

    constructor(context: vscode.ExtensionContext, projectDir : string | null = null) {
        super(context);
        this.setId("mcmod.newProject");
        this.setTemplate("project_details");
        this.setTitle("New Project");
        this.addScript(UIHelper.mediaUri(this.context(), 'scripts', 'project_details.js'));
    }

    protected bodyContent(): object {
        return {
            project: {
                
            }
        };
    }

    protected onMessageReceived(message: any): void {}
}