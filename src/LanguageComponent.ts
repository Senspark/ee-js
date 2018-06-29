import { LanguageManager } from "./LanguageManager";

const { ccclass, disallowMultiple, executeInEditMode, inspector, menu, property } = cc._decorator;

@ccclass
@disallowMultiple
// @executeInEditMode
@inspector('packages://ee/inspector/LanguageInspector.js')
@menu('ee/LanguageComponent')
export class LanguageComponent extends cc.Component {
    /** Gets or sets the multilingual key. */
    @property(cc.String)
    public key: string = '{null}';

    @property([cc.String])
    private _paramValues: string[] = ['', '', '', '', '', ''];

    /** Gets the multilingual format corresponding to the current key. */
    @property({
        type: cc.String,
        readonly: true
    })
    public get format() {
        let manager = LanguageManager.getInstance();
        return manager.getFormat(manager.getCurrentLanguage() || '', this.key) || '';
    };

    /** Gets the multilingual parameter keys. */
    @property({
        type: [cc.String],
        readonly: true
    })
    public get paramKeys(): string[] {
        return this.parseParamKeys(this.format);
    };

    /** Gets or sets the multilingual parameter values. */
    @property({ type: [cc.String] })
    public get paramValues() {
        while (this._paramValues.length < this.paramKeys.length) {
            this._paramValues.push('');
        }
        return this._paramValues;
    };

    public set paramValues(value) {
        this._paramValues = value;
    };

    /** Gets the translated string. */
    @property({
        type: cc.String,
        readonly: true
    })
    public get string() {
        if (this.paramKeys.length == 0) {
            return '';
        }
        return this.paramValues.join(',');
    };

    @property({ type: cc.String })
    private get config() {
        return LanguageManager.getInstance().getConfigDir();
    };

    private set config(value) {
        let manager = LanguageManager.getInstance();
        if (value !== undefined && value.length > 0 /* May be empty */) {
            manager.setConfigDir(value);
        } else {
            manager.resetConfigDir();
        }
    };

    @property({ type: [cc.String] })
    private get languages() {
        return LanguageManager.getInstance().getLanguages();
    };

    @property({ type: cc.String })
    private get language() {
        return LanguageManager.getInstance().getCurrentLanguage();
    };

    private set language(value) {
        LanguageManager.getInstance().setCurrentLanguage(value);
    };

    public constructor() {
        super();
    };

    public onLoad(): void {
        let x = 1;
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