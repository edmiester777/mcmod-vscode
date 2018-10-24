'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

/**
 * This class has a lot of helper functions for serving content to a webview.
 */
export default class UIHelper {
    /**
     * Get the uri pointing to the media root.
     * @param context Context allocated to this extension.
     */
    public static mediaRootUri(context: vscode.ExtensionContext) : vscode.Uri {
        return vscode.Uri.file(path.join(context.extensionPath, 'media'));
    }

    /**
     * Get a uri pointing to a media asset.
     * @param context Context allocated to this extension.
     * @param filePath Each path component specified in order.
     */
    public static mediaUri(context: vscode.ExtensionContext, ...filePath : string[]) : vscode.Uri {
        return vscode.Uri.file(path.join(context.extensionPath, 'media', ...filePath))
        .with({scheme: 'vscode-resource'});
    }

    /**
     * Get the uri of a node module.
     * @param context Context allocated to this extension.
     * @param module Name of node module.
     */
    public static moduleRootUri(context: vscode.ExtensionContext, module: string) : vscode.Uri {
        return vscode.Uri.file(path.join(context.extensionPath, 'node_modules', module));
    }

    /**
     * 
     * @param context Context allocated to this extension.
     * @param module Name of node module.
     * @param assetPath Path to asset inside of the node module.
     */
    public static moduleAssetUri(context: vscode.ExtensionContext, module: string, ...assetPath: string[]) : vscode.Uri {
        return vscode.Uri.file(path.join(context.extensionPath, 'node_modules', module, ...assetPath))
        .with({scheme: 'vscode-resource'});
    }
}