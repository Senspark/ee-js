export class ProfileManager {
    private static sharedInstance?: ProfileManager;

    /** Current profile, used in editor only. */
    private profile?: Profile;

    public static getInstance(): ProfileManager {
        return this.sharedInstance || (this.sharedInstance = new this());
    };

    public setProfile(profile: Profile) {
        this.profile = profile;
    };

    public getProfile(): Profile | undefined {
        return this.profile;
    };

    public loadData(key: string): any {
        if (this.profile === undefined) {
            return undefined;
        }
        return this.profile.data[key];
    };

    public saveData<T>(key: string, data: T): void {
        if (this.profile === undefined) {
            return;
        }
        this.profile.data[key] = data;
        this.profile.save();
    };
};

if (CC_EDITOR) {
    /** Loads saved profile for the editor. */
    Editor.Profile.load('profile://project/ee.json', (err, profile) => {
        if (profile !== null) {
            let manager = ProfileManager.getInstance();
            manager.setProfile(profile);
        }
    });
}