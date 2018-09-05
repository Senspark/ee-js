import assert = require('assert');

import { DialogManager } from './DialogManager';

const { ccclass, disallowMultiple, menu, property } = cc._decorator;

type DialogEvent = (dialog: Dialog) => void;
type Transition = cc.FiniteTimeAction;

export enum DialogEventType {
    WillShow,
    DidShow,
    WillHide,
    DidHide,
};

@ccclass
@disallowMultiple
@menu('ee/Dialog')
export class Dialog extends cc.Component {
    private active: boolean;

    /** Used to run transtitions. */
    private actor: cc.Node;

    private showingTransitions: Transition[];
    private hidingTransitions: Transition[];

    private eventDictionary: { [key: number]: DialogEvent[] };
    private manager?: DialogManager;

    public constructor() {
        super();
        this.active = false;
        this.actor = new cc.Node();
        this.showingTransitions = [];
        this.hidingTransitions = [];
        this.eventDictionary = {};
    };

    public onLoad(): void {
        this.node.addChild(this.actor);
    };

    public getContainer(): cc.Node {
        return this.node.parent;
    };

    /** Shows this dialog using the specified dialog manager. */
    public show(manager: DialogManager): void {
        const container = new cc.Node();
        container.setContentSize(cc.winSize);
        container.addChild(this.node);
        container.addComponent(cc.BlockInputEvents);

        this.manager = manager;
        manager.pushDialog(this);
    };

    /** Hides this dialog using the current dialog manager. */
    public hide(): void {
        const manager = this.manager;
        assert(manager !== undefined);
        if (manager !== undefined) {
            manager.popDialog(this);
        }
    };

    /** Attempts to show the specified dialog using the current dialog manager. */
    public showDialog(dialog: Dialog): void {
        const manager = this.manager;
        if (manager === undefined) {
            assert(false, 'The current dialog is not active.');
            return;
        }
        dialog.show(manager);
    };

    /** Checks whether this dialog is active. */
    public isActive(): boolean {
        return this.active;
    };

    /** Sets this dialog to be active. */
    public setActive(active: boolean): void {
        this.active = active;
    };

    /** Adds a will-show event. */
    public onWillShow(event: DialogEvent): this {
        return this.addEvent(DialogEventType.WillShow, event);
    };

    /** Adds a did-show event. */
    public onDidShow(event: DialogEvent): this {
        return this.addEvent(DialogEventType.DidShow, event);
    };

    /** Adds a will-hide event. */
    public onWillHide(event: DialogEvent): this {
        return this.addEvent(DialogEventType.WillHide, event);
    };

    /** Adds a did-hide event. */
    public onDidHide(event: DialogEvent): this {
        return this.addEvent(DialogEventType.DidHide, event);
    };

    /** Adds a showing transition. */
    public addShowingTransition(transition: Transition): this {
        this.showingTransitions.push(transition);
        return this;
    };

    /** Adds a hiding transition. */
    public addHidingTransition(transition: Transition): this {
        this.hidingTransitions.push(transition);
        return this;
    };

    public playShowingTransition(callback: () => void): void {
        this.playTransition(this.showingTransitions, callback);
    };

    public playHidingTransition(callback: () => void): void {
        this.playTransition(this.hidingTransitions, callback);
    };

    private playTransition(actions: Transition[], callback: () => void): void {
        assert(this.actor.getNumberOfRunningActions() === 0);
        this.actor.stopAllActions();
        this.actor.runAction(actions.length === 0
            ? cc.callFunc(callback)
            : cc.sequence([
                ...actions.map(action => cc.targetedAction(this.node, action)),
                cc.callFunc(callback)
            ]));
    };

    public addEvent(type: DialogEventType, event: DialogEvent): this {
        const events = this.getEvents(type);
        events.push(event);
        return this;
    };

    /** Processes all events for the specified event type. */
    public processEvent(type: DialogEventType): void {
        const events = this.getEvents(type);
        events.forEach(event => event(this));
    };

    private getEvents(type: DialogEventType): DialogEvent[] {
        return this.eventDictionary[type] = this.eventDictionary[type] || [];
    };
};
