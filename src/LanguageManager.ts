export class LanguageManager {
    private static sharedInstance?: LanguageManager;

    /** Used in editor only. */
    private profile?: Profile;

    private currentLanguage?: string;
    private configDir?: string;
    private configs: { [index: string]: { [key: string]: string } };

    /** Gets the singleton. */
    static getInstance(): LanguageManager {
        return this.sharedInstance || (this.sharedInstance = new this());
    };

    private constructor() {
        // Hide construction.
        this.configs = {};
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

    /** Gets the config dir. */
    public getConfigDir(): string | undefined {
        return this.configDir;
    };

    /**
     * Sets the config directory, used in editor.
     * @param path The directory path.
     */
    public setConfigDir(path: string): void {
        if (CC_EDITOR) {
            this.configDir = path;
            this.profile!.data.config_dir = path;
            this.profile!.save();
            this.updateConfigs();
        }
    };

    /** Clears the language directory, used in editor. */
    public resetConfigDir(): void {
        if (CC_EDITOR) {
            this.configDir = undefined;
            this.profile!.data.config_dir = this.configDir;
            this.profile!.save();
            this.updateConfigs();
        }
    };

    private updateConfigs(): void {
        this.configs = {};
        if (this.configDir === undefined) {
            return;
        }
        Editor.assetdb.queryUrlByUuid(this.configDir, (err, url) => {
            let pattern = url + '/*.json';
            Editor.assetdb.queryAssets(pattern, 'text', (err, result) => {
                result.forEach((item: any) => {
                    import(item.path).then(config => {
                        let language = this.parseLanguage(item.path);
                        this.configs[language] = config;
                    });
                });
            });
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
    };

    /** Gets the language format */
    public getFormat(language: string, key: string): string | undefined {
        if (!(language in this.configs)) {
            return undefined;
        }
        let config = this.configs[language];
        if (!(key in config)) {
            return undefined;
        }
        return config[key];
    };

    private parseLanguage(path: string): string {
        const regex = /\/(\w+)\.\w+$/g;
        let match = regex.exec(path);
        if (match === null) {
            return '';
        }
        return match[1];
    }
};

if (CC_EDITOR) {
    /** Loads saved profile for the editor. */
    Editor.Profile.load('profile://project/ee.json', (err, profile: Profile) => {
        let manager = LanguageManager.getInstance();
        manager.setProfile(profile);
    });
}