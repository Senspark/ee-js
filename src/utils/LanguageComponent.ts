import { LanguageManager } from "./LanguageManager";

const { ccclass, disallowMultiple, executeInEditMode, inspector, menu, property } = cc._decorator;

@ccclass
@disallowMultiple
@executeInEditMode
@inspector('packages://ee/inspector/LanguageInspector.js')
@menu('ee/LanguageComponent')
export class LanguageComponent extends cc.Component {
    /** Gets or sets the multilingual key. */
    @property(cc.String)
    public _key: string = '{null}';

    @property({ type: cc.String })
    public get key(): string {
        return this._key;
    };

    public set key(value) {
        this._key = value;
        this.updateText();
    };

    /** Gets the multilingual format corresponding to the current key. */
    @property({
        type: cc.String,
        readonly: true
    })
    public get format() {
        return this.manager.getFormat(this.key) || '';
    };

    @property([cc.String])
    private _paramValues: string[] = [];

    /** Gets the multilingual parameter keys. */
    @property({ readonly: true })
    public get paramKeys(): string[] {
        return this.parseParamKeys(this.format);
    };

    /** Gets or sets the multilingual parameter values. */
    @property
    public get paramValues() {
        while (this._paramValues.length < this.paramKeys.length) {
            this._paramValues.push('');
        }
        return this._paramValues;
    };

    public set paramValues(value) {
        this._paramValues = value;
        this.updateText();
    };

    /** Gets the translated string. */
    @property({
        type: cc.String,
        readonly: true
    })
    public get string() {
        let options: any = {};
        for (let i = 0; i < this.paramKeys.length; ++i) {
            options[this.paramKeys[i]] = this.paramValues[i];
        }
        return this.manager.parseFormat(this.key, options);
    };

    @property({ type: cc.String })
    private get config() {
        return this.manager.getConfigDir();
    };

    private set config(value) {
        if (value !== undefined && value.length > 0 /* May be empty */) {
            this.manager.setConfigDir(value);
        } else {
            this.manager.resetConfigDir();
        }
    };

    @property
    private get languages() {
        return this.manager.getLanguages();
    };

    @property({ type: cc.String })
    private get language() {
        return this.manager.getCurrentLanguage();
    };

    private set language(value) {
        this.manager.setCurrentLanguage(value);
    };

    static counter: number = 0;

    /** Unique ID for each language component. */
    private componentId: string;

    /** Associated label component. */
    private label: cc.Label | null = null;

    private manager: LanguageManager;

    public constructor() {
        super();
        this.componentId = (LanguageComponent.counter++).toString();
        this.manager = LanguageManager.getInstance();
    };

    public onEnable(): void {
        this.manager.addObserver(this.componentId, () => {
            this.updateText();
        });
        this.updateText();
    };

    public onDisable(): void {
        this.manager.removeObserver(this.componentId);
    };

    public update(): void {
        if (CC_EDITOR) {
            // Repeatedly update string when in editor mode.
            this.updateText();
        }
    };

    private updateText() {
        if (this.label === null) {
            this.label = this.getComponent(cc.Label);
            if (this.label === null) {
                // Component not found.
                return;
            }
        }
        this.label.string = this.string || '';
    };

    private parseParamKeys(format: string): string[] {
        const regex = /%{(.*?)}/g;
        let match = regex.exec(format);
        let params: string[] = [];
        while (match !== null) {
            params.push(match[1]);
            match = regex.exec(format);
        }
        return params;
    };
};