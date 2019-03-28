import assert = require('assert');
import * as Polyglot from 'node-polyglot';
import { ObserverManager } from './EEObserverManager';
import { ProfileManager } from './EEProfileManager';

type Observer = () => void;

export class LanguageManager extends ObserverManager<Observer> {
    private static sharedInstance?: LanguageManager;

    /** Gets the singleton. */
    public static getInstance(): LanguageManager {
        return this.sharedInstance || (this.sharedInstance = new this());
    }

    /**
     * Current config directory.
     * Actually UUID in editor mode and relative path in release mode.
     */
    private configDir?: string;

    /** Current active language. */
    private currentLanguage?: string;
    private configs: { [index: string]: { [key: string]: string | undefined } | undefined };

    /** Wrappee i18n manager. */
    private polyglot: Polyglot;

    private constructor() {
        super();
        // Hide construction.
        this.configs = {};
        this.polyglot = new Polyglot();

        const profile = ProfileManager.getInstance();
        this.currentLanguage = profile.loadData('current_language');
        this.configDir = profile.loadData('config_dir');
        this.updateConfigs();
    }

    /**
     * Gets all available languages.
     * @return Array of language names.
     */
    public getLanguages(): string[] {
        return Object.keys(this.configs);
    }

    /**
     * Gets the config dir.
     * Used in editor only.
     */
    public getConfigDir(): string | undefined {
        return this.configDir;
    }

    /**
     * Sets the config directory.
     * @param path The directory path.
     */
    public setConfigDir(path: string): void {
        this.configDir = path;
        if (CC_EDITOR) {
            const profile = ProfileManager.getInstance();
            profile.saveData('config_dir', this.configDir);
        }
        this.updateConfigs();
        this.updateLanguage();
    }

    /** Clears the language directory. */
    public resetConfigDir(): void {
        this.configDir = undefined;
        if (CC_EDITOR) {
            const profile = ProfileManager.getInstance();
            profile.saveData('config_dir', this.configDir);
        }
        this.updateConfigs();
    }

    private updateConfigs(): void {
        this.configs = {};
        if (this.configDir === undefined) {
            this.updateLanguage();
            return;
        }
        if (CC_EDITOR) {
            Editor.assetdb.queryUrlByUuid(this.configDir, (err, url) => {
                const pattern = url + '/*.json';
                const type = (cc.ENGINE_VERSION >= '2' ? 'json' : 'text');
                Editor.assetdb.queryAssets(pattern, type, (err2, result) => {
                    result.forEach((item: any) => {
                        import(item.path).then(config => {
                            const language = this.parseLanguage(item.path);
                            this.configs[language] = config;
                            this.updateLanguage();
                        });
                    });
                });
            });
        } else {
            cc.loader.loadResDir(this.configDir, (err: any, results: any[], urls: string[]) => {
                for (let i = 0; i < urls.length; ++i) {
                    const path = urls[i] + '.json'; // Suffixed with .json for regex matching.
                    const content = results[i];
                    const language = this.parseLanguage(path);
                    if (cc.ENGINE_VERSION >= '2') {
                        this.configs[language] = content.json;
                    } else {
                        this.configs[language] = content;
                    }
                    this.updateLanguage();
                }
            });
        }
    }

    private updateLanguage(): void {
        this.polyglot.clear();
        if (this.currentLanguage !== undefined) {
            const config = this.configs[this.currentLanguage];
            if (config !== undefined) {
                this.polyglot.extend(config);
            }
        }
        this.dispatch(observer => observer());
    }

    /** Gets the active language. */
    public getCurrentLanguage(): string | undefined {
        return this.currentLanguage;
    }

    /** Sets the active language. */
    public setCurrentLanguage(language: string | undefined): void {
        this.currentLanguage = language;
        if (CC_EDITOR) {
            const profile = ProfileManager.getInstance();
            profile.saveData('current_language', language);
        }
        this.updateLanguage();
    }

    /** Gets the language format in the current language. */
    public getFormat(key: string): string | undefined {
        if (this.currentLanguage === undefined) {
            return undefined;
        }
        const config = this.configs[this.currentLanguage];
        if (config === undefined) {
            return undefined;
        }
        return config[key];
    }

    public parseFormat(key: string, options?: Polyglot.InterpolationOptions): string | undefined {
        if (this.polyglot.has(key)) {
            return this.polyglot.t(key, options);
        }
        return undefined;
    }

    /** Detects language for the config path. */
    private parseLanguage(path: string): string {
        const regex = /\/(\w+)\.\w+$/g;
        const match = regex.exec(path);
        if (match === null) {
            return '';
        }
        return match[1];
    }
}