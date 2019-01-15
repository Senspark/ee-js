import assert = require('assert');

import { Dialog, DialogEventType } from "./Dialog";
import { DialogManager } from './DialogManager';

enum CommandType {
    /** Pushes a dialog. */
    Push,

    /** Pops a dialog. */
    Pop,
}

class Command {
    private type: CommandType;
    private dialog: Dialog;

    public constructor(type: CommandType, dialog: Dialog) {
        this.type = type;
        this.dialog = dialog;
    }

    public getType(): CommandType {
        return this.type;
    }

    public getDialog(): Dialog {
        return this.dialog;
    }
}

export class DefaultDialogManager extends DialogManager {
    private root: cc.Node;
    private lockingDialog: Dialog | null;
    private dialogStack: Dialog[];
    private commandQueue: Command[];

    public constructor(root: cc.Node) {
        super();
        this.root = root;
        this.lockingDialog = null;
        this.dialogStack = [];
        this.commandQueue = [];
    }

    public pushDialog(dialog: Dialog): void {
        assert(dialog !== null);
        assert(dialog.getContainer() !== null);
        this.pushCommand(new Command(CommandType.Push, dialog));
        this.processCommandQueue();
    }

    public popDialog(dialog: Dialog): void {
        assert(dialog !== null);
        assert(dialog.getContainer() !== null);
        this.pushCommand(new Command(CommandType.Pop, dialog));
        this.processCommandQueue();
    }

    public popToLevel(level: number): void {
        assert(level >= 0);
        const stackSize = this.dialogStack.length;
        const count = stackSize - level;
        for (let i = 0; i < count; i++) {
            this.popDialog(this.dialogStack[stackSize - i - 1]);
        }
    }

    /** Checks whether there is a locking dialog. */
    private isLocked(): boolean {
        return this.lockingDialog !== null;
    }

    /** Locks all dialog behaviors with the specified dialog. */
    private lock(dialog: Dialog): void {
        assert(this.lockingDialog === null);
        this.lockingDialog = dialog;
    }

    /** Unlocks all dialog behaviors. */
    private unlock(dialog: Dialog): void {
        assert(this.lockingDialog === dialog);
        this.lockingDialog = null;
    }

    /** Gets the current (top) dialog. */
    private getCurrentDialog(): Dialog | null {
        const length = this.dialogStack.length;
        if (length === 0) {
            return null;
        }
        const dialog = this.dialogStack[length - 1];
        assert(dialog !== null);
        return dialog;
    }

    /** Gets the current (top) root node. */
    private getCurrentRoot(): cc.Node {
        const dialog = this.getCurrentDialog();
        if (dialog === null) {
            return this.root;
        }
        return dialog.getContainer();
    }

    /** Attempts to process the current command queue. */
    private processCommandQueue(): boolean {
        if (this.isLocked()) {
            return false;
        }
        const length = this.commandQueue.length;
        for (let i = 0; i < length; ++i) {
            const command = this.commandQueue[i];
            if (this.processCommand(command)) {
                this.commandQueue.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    private processCommand(command: Command): boolean {
        if (command.getType() === CommandType.Push) {
            return this.processPushCommand(command.getDialog());
        }
        if (command.getType() === CommandType.Pop) {
            return this.processPopCommand(command.getDialog());
        }
        assert(false);
        return false;
    }

    private processPushCommand(dialog: Dialog): boolean {
        this.pushDialogImmediately(dialog);
        return true;
    }

    private processPopCommand(dialog: Dialog): boolean {
        const topDialog = this.getCurrentDialog();
        if (topDialog !== dialog) {
            return false;
        }
        this.popDialogImmediately(dialog);
        return true;
    }

    private pushCommand(command: Command): boolean {
        const length = this.commandQueue.length;
        if (length > 0) {
            const lastCommand = this.commandQueue[length - 1];
            if (lastCommand.getType() === command.getType() &&
                lastCommand.getDialog() === command.getDialog()) {
                // Duplicated command.
                return false;
            }
        }
        this.commandQueue.push(command);
        return true;
    }

    /**
     * Immediately pushes the specified dialog:
     * - Lock dialog.
     * - Will-hide events.
     * - Add dialog's container.
     * - Push dialog.
     * - Did-hide events.
     * - Set active = true.
     * - Unlock dialog.
     * - Process next commands.
     */
    private pushDialogImmediately(dialog: Dialog): void {
        assert(!dialog.isActive());

        // Lock first.
        this.lock(dialog);

        // Must be called before push + addChild.
        dialog.processEvent(DialogEventType.WillShow);

        // Add child + push.
        const root = this.getCurrentRoot();
        root.addChild(dialog.getContainer());
        this.dialogStack.push(dialog);

        dialog.playShowingTransition(() => {
            // Process event + set active.
            dialog.processEvent(DialogEventType.DidShow);
            dialog.setActive(true);

            // Unlock and process next commands.
            this.unlock(dialog);
            this.processCommandQueue();
        });
    }

    /**
     * Immediately pops the specified dialog:
     * - Lock dialog.
     * - Set active = false.
     * - Will-hide events.
     * - Pop dialog.
     * - Remove dialog's container.
     * - Did-hide events.
     * - Unlock dialog.
     * - Process next commands.
     */
    private popDialogImmediately(dialog: Dialog): void {
        assert(dialog.isActive());

        // Lock first.
        this.lock(dialog);

        // Set active + process event.
        dialog.setActive(false);
        dialog.processEvent(DialogEventType.WillHide);

        dialog.playHidingTransition(() => {
            // Pop + remove child.
            this.dialogStack.pop();
            const container = dialog.getContainer();
            container.removeFromParent(false);

            // Must be called after pop + remove child.
            dialog.processEvent(DialogEventType.DidHide);

            // Unlock and process next commands.
            this.unlock(dialog);
            this.processCommandQueue();
        });
    }
}