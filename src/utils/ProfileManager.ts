export class ProfileManager {
    private static sharedInstance?: ProfileManager;

    /** Current profile, used in editor only. */
    private profile?: Profile;

    private listener?: Editor.IpcListener;

    public static getInstance(): ProfileManager {
        return this.sharedInstance || (this.sharedInstance = new this());
    };

    private constructor() {
        if (CC_EDITOR) {
            this.listener = new Editor.IpcListener();
            this.listener.on('ee:profile_manager:set_data',
                (event: any, key: string, data: any) => {
                    this.saveData(key, data);
                });
            this.listener.on('ee:profile_manager:get_data',
                (event: any, key: string, reply: any) => {
                    let data = this.loadData(key);
                    Editor.Ipc.sendToAll(reply, data);
                });
        }
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
            Editor.Ipc.sendToAll('ee:profile_manager_loaded');
        }
    });
}