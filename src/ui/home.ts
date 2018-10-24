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
        <main role="main">
            <section class="jumbotron text-center">
                <div class="container">
                    <pre class="jumbotron-heading" style="display: block;white-space: pre;"><code style="color: inherit">
███╗   ███╗ ██████╗███╗   ███╗ ██████╗ ██████╗ 
████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗
██╔████╔██║██║     ██╔████╔██║██║   ██║██║  ██║
██║╚██╔╝██║██║     ██║╚██╔╝██║██║   ██║██║  ██║
██║ ╚═╝ ██║╚██████╗██║ ╚═╝ ██║╚██████╔╝██████╔╝
╚═╝     ╚═╝ ╚═════╝╚═╝     ╚═╝ ╚═════╝ ╚═════╝
                    </code></pre>
                    <p class="lead text-muted">A better way to make Minecraft mods.</p>
                </div>
            </section>

            <!-- This is the card sections -->
            <div class="container">
                <div class="card-deck">
                    <div class="card border-info mb-3" style="max-width: 20rem;">
                        <div class="card-header">Tutorials</div>
                        <div class="card-body">
                            <h4 class="card-title">Are you new?</h4>
                            <p class="card-text">
                                No problem! Check out our list of in-depth tutorials
                                that will give you the jump-start you need to get your first mod
                                built!
                            </p>
                            <a href="#" class="btn btn-primary btn-lg btn-block">Check them out!</a>
                        </div>
                    </div>
                    <div class="card border-info mb-3" style="max-width: 20rem;">
                        <div class="card-header">Projects</div>
                        <div class="card-body">
                            <h4 class="card-title">Your Projects</h4>
                            <p class="card-text">
                                Looks like you haven't started any projects. Click the <i>"Start a new project"</i>
                                button to begin!
                            </p>
                            <a href="#" class="btn btn-primary btn-lg btn-block" onClick="newProjectClicked()">Start a new project</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
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