import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

class ConfigData {
    public projectsDir: string;

    constructor(data: {
        projectsDir: string
    }) {
        this.projectsDir = data.projectsDir;
    }
}

export class MCModConfig {
    private static __instance : ConfigData | null;
    private static SettingsFilePath() : string {
        get: {
            return path.join(os.homedir(), '.mcmod', '.settings');
        }
    }

    public static Instance() : ConfigData {
        get: {
            this.__generateInstance();
            if(!this.__instance) {
                this.__instance = JSON.parse(fs.readFileSync(this.SettingsFilePath(), 'utf8')) as ConfigData;
            }
            return this.__instance as ConfigData;
        }
    }

    private static __defaultInstance() : ConfigData {
        return new ConfigData({
            projectsDir: path.join(os.homedir(), '.mcmod', 'projects')
        });
    }

    private static __generateInstance() {
        if(!fs.existsSync(this.SettingsFilePath())) {
            if(!fs.existsSync(path.join(os.homedir(), '.mcmod'))) {
                fs.mkdirSync(path.join(os.homedir(), '.mcmod'));
            }
            this.__instance = this.__defaultInstance();
            this.save();
        }
    }

    public static save() {
        fs.writeFileSync(MCModConfig.SettingsFilePath(), JSON.stringify(MCModConfig.__instance));
    }
}