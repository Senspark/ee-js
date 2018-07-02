import * as Polyglot from 'node-polyglot';

type Observer = () => void;

export class LanguageManager {
    private static sharedInstance?: LanguageManager;

    /** Current profile, used in editor only. */
    private profile?: Profile;

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

    /** Observes language changing events. */
    private observers: { [index: string]: Observer | undefined };

    /** Gets the singleton. */
    static getInstance(): LanguageManager {
        return this.sharedInstance || (this.sharedInstance = new this());
    };

    private constructor() {
        // Hide construction.
        this.configs = {};
        this.observers = {};
        this.polyglot = new Polyglot();
    };

    /**
     * Sets the settings profile.
     * Used in editor only.
     * @param profile The settings profile to set.
     */
    public setProfile(profile: Profile) {
        if (CC_EDITOR) {
            this.profile = profile;
            this.currentLanguage = profile.data.current_language;
            this.configDir = profile.data.config_dir;
            this.updateConfigs();
        }
    };

    /**
     * Gets all available languages.
     * @return Array of language names.
     */
    public getLanguages(): string[] {
        return Object.keys(this.configs);
    };

    /**
     * Gets the config dir.
     * Used in editor only.
     */
    public getConfigDir(): string | undefined {
        return this.configDir;
    };

    /**
     * Sets the config directory.
     * @param path The directory path.
     */
    public setConfigDir(path: string): void {
        this.configDir = path;
        if (CC_EDITOR) {
            this.profile!.data.config_dir = path;
            this.profile!.save();
        }
        this.updateConfigs();
        this.updateLanguage();
    };

    /** Clears the language directory. */
    public resetConfigDir(): void {
        this.configDir = undefined;
        if (CC_EDITOR) {
            this.profile!.data.config_dir = this.configDir;
            this.profile!.save();
        }
        this.updateConfigs();
    };

    private updateConfigs(): void {
        this.configs = {};
        if (this.configDir === undefined) {
            this.updateLanguage();
            return;
        }
        if (CC_EDITOR) {
            Editor.assetdb.queryUrlByUuid(this.configDir, (err, url) => {
                let pattern = url + '/*.json';
                Editor.assetdb.queryAssets(pattern, 'text', (err, result) => {
                    result.forEach((item: any) => {
                        import(item.path).then(config => {
                            let language = this.parseLanguage(item.path);
                            this.configs[language] = config;
                            this.updateLanguage();
                        });
                    });
                });
            });
        } else {
            cc.loader.loadResDir(this.configDir, (err: any, results: any[], urls: string[]) => {
                for (let i = 0; i < urls.length; ++i) {
                    let path = urls[i] + '.json'; // Suffixed with .json for regex matching.
                    let content = results[i];
                    let language = this.parseLanguage(path);
                    this.configs[language] = content;
                    this.updateLanguage();
                }
            });
        }
    };

    private updateLanguage(): void {
        this.polyglot.clear();
        if (this.currentLanguage !== undefined) {
            let config = this.configs[this.currentLanguage];
            if (config !== undefined) {
                this.polyglot.extend(config);
            }
        }
        Object.keys(this.observers).forEach(key => {
            let observer = this.observers[key];
            observer!();
        });
    };

    /** Gets the active language. */
    public getCurrentLanguage(): string | undefined {
        return this.currentLanguage;
    };

    /** Sets the active language. */
    public setCurrentLanguage(language: string | undefined): void {
        this.currentLanguage = language;
        if (CC_EDITOR) {
            this.profile!.data.current_language = language;
            this.profile!.save();
        }
        this.updateLanguage();
    };

    /** Gets the language format in the current language. */
    public getFormat(key: string): string | undefined {
        if (this.currentLanguage === undefined) {
            return undefined;
        }
        let config = this.configs[this.currentLanguage];
        if (config === undefined) {
            return undefined;
        }
        return config[key];
    };

    public parseFormat(key: string, options?: Polyglot.InterpolationOptions): string | undefined {
        if (this.polyglot.has(key)) {
            return this.polyglot.t(key, options!);
        }
        return undefined;
    };

    /** Detects language for the config path. */
    private parseLanguage(path: string): string {
        const regex = /\/(\w+)\.\w+$/g;
        let match = regex.exec(path);
        if (match === null) {
            return '';
        }
        return match[1];
    };

    /** Adds an observer whose the specified key. */
    public addObserver(key: string, observer: Observer): boolean {
        if (this.observers[key] !== undefined) {
            return false;
        }
        this.observers[key] = observer;
        return true;
    };

    /** Removes an observer whose the specified key. */
    public removeObserver(key: string): boolean {
        if (this.observers[key] === undefined) {
            return false;
        }
        delete this.observers[key];
        return true;
    };
};

if (CC_EDITOR) {
    /** Loads saved profile for the editor. */
    Editor.Profile.load('profile://project/ee.json', (err, profile: Profile) => {
        let manager = LanguageManager.getInstance();
        manager.setProfile(profile);
    });
}