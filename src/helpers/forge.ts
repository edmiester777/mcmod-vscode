import * as child from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs-extra';

/**
 * The @see GradleHelper class is set up to help with common functions executed on
 * the gradle environment.
 */
export class GradleHelper {
    public static startMinecraft(projDir: string, stream: vscode.OutputChannel | null) : Promise<void> {
        return this.executeGradleCommand(projDir, stream, 'start');
    }

    public static setupWorkspace(projDir: string, stream: vscode.OutputChannel | null) : Promise<void> {
        return this.executeGradleCommand(projDir, stream, 'setupDecompWorkspace');
    }

    public static executeGradleCommand(projDir: string, stream: vscode.OutputChannel | null, command: string) : Promise<void> {
        const isWindows: boolean = process.platform === 'win32';
        const filename = 'gradlew' + (isWindows ? '.bat' : '');
        const execpath = path.join(projDir, 'forge', filename);

        // provide execution permissions on non-windows
        if(!isWindows) {
            fs.chmodSync(execpath, '755');
        }

        return new Promise<void>((accept, reject) => {
            const proc = child.spawn(execpath, [command], {
                detached: true,
                cwd: path.join(projDir, 'forge'),
                shell: true
            });
            proc.stdout.on('data', (buf) => {
                if(!!stream) {
                    stream.append(buf.toString());
                }
            });
            proc.stdin.on('data', (buf) => {
                if(!!stream) {
                    stream.append(buf.toString());
                }
            });
            proc.on('close', (code) => {
                if(code === 0) {
                    accept();
                }
                else {
                    reject();
                }
            });
        });
    }
}