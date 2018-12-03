'use strict';

import MCModUIBase from './base';
import * as vscode from 'vscode';
import UIHelper from '../helpers/ui';
import * as path from 'path';
import {MCModConfig} from '../config/settings';
import Env from '../config/env';
import * as extract from 'extract-zip';
import * as fs from 'fs-extra';
import { GradleHelper } from '../helpers/forge';

let download = require('download-file');

export default class MCModProjectDetailsPage extends MCModUIBase {

    constructor(context: vscode.ExtensionContext, projectDir : string | null = null) {
        super(context);
        this.setId("mcmod.newProject");
        this.setTemplate("project_details");
        this.setTitle("New Project");
        this.addRootMediaSource(UIHelper.moduleRootUri(this.context(), 'smartwizard'));
        this.addScript(UIHelper.moduleAssetUri(this.context(), 'smartwizard', 'dist', 'js', 'jquery.smartwizard.min.js'));
        this.addStyle(UIHelper.moduleAssetUri(this.context(), 'smartwizard', 'dist', 'css', 'smart_wizard.min.css'));
        this.addStyle(UIHelper.moduleAssetUri(this.context(), 'smartwizard', 'dist', 'css', 'smart_wizard_theme_dots.min.css'));
        this.addScript(UIHelper.mediaUri(this.context(), 'scripts', 'project_details.js'));
    }

    protected bodyContent(): object {
        return {
            project: {
                
            }
        };
    }

    protected onMessageReceived(message: any): void {
        switch(message.command) {
            case "beginInstall":
                this.beginInstall(message.projectDetails);
                break;
            default:
                console.log("Received unrecognized command: " + message.command);
                break;
        }
    }

    /**
     * Begin the workspace install process.
     * @param projectDetails Details of the project passed from webview.
     */
    private beginInstall(projectDetails : any) {
        const out = vscode.window.createOutputChannel("Minecraft Project Setup");
        const projDir = path.join(MCModConfig.Instance().projectsDir, projectDetails.name);
        out.show(true);
        out.appendLine(`Creating project "${projectDetails.name}"...`);
        out.appendLine(`Saving to "${projDir}`);
        
        const selectedMcVersion = Env.forge.supportedVersions[projectDetails.mcVersion];
        out.appendLine("Version info:");
        out.appendLine(`\tMinecraft Version: ${selectedMcVersion.minecraftVersion}`);
        out.appendLine(`\tMinecraft Forge Version: ${selectedMcVersion.forgeVersion}`);
        out.appendLine(`\tDownload Url: ${selectedMcVersion.url}`);

        // if project exists, this project will error out.
        if(fs.existsSync(projDir)) {
            vscode.window.showErrorMessage("A project with this name already exists.");
            return;
        }

        // creating directories
        const tmpDir = path.join(projDir, 'tmp');
        const forgeDir = path.join(projDir, 'forge');
        const forgeZip = path.join(tmpDir, 'forge.zip');
        fs.ensureDirSync(tmpDir);
        fs.ensureDirSync(forgeDir);



        out.append(`Downloading Minecraft Forge ${selectedMcVersion.forgeVersion}...`);
        download(selectedMcVersion.url, {
            directory: tmpDir,
            filename: 'forge.zip'
        }, (err : any) => {
            if(!!err) {
                out.appendLine("Error!");
                vscode.window.showErrorMessage("Could not download forge.");
                return;
            }

            out.appendLine(" Done!");

            out.append("Extracting forge...");
            extract(forgeZip, {
                dir: forgeDir
            }, (err) => {
                if(!!err) {
                    out.appendLine(err.message);
                    vscode.window.showErrorMessage("Could not extract forge.");
                    return;
                }
                out.appendLine(" Done!");
                
                // starting the decompile process.
                out.appendLine("Setting up decompiled workspace.");
                GradleHelper.setupWorkspace(projDir, out)
                .then(() => {
                    vscode.window.showInformationMessage("Your project has been set up!");
                })
                .catch((err) => {
                    vscode.window.showErrorMessage("Could not decompile workspace.");
                });
            });
        });
    }
}