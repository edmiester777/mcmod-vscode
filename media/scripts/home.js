/**
 * Script embedded in the webview for the home UI.
 */
function newProjectClicked() {
    vscode.postMessage({
        command: 'newProject'
    });
}