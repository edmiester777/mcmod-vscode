'use strict';

import * as vscode from 'vscode';
import MCModHome from './ui/home';

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "mcmodcrafter" is now active!');

    let showHome = vscode.commands.registerCommand('mcmod.showHome', () => {
        let home = new MCModHome(context);
        home.newPanel();
    });

    context.subscriptions.push(showHome);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

vscode.commands.executeCommand("mcmod.showHome");
