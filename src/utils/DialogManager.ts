import { Dialog } from "./Dialog";

/** Manages all dialog behaviors. */
export interface DialogManager {
    /**
     * Attempts to push the specified dialog.
     * The specified dialog may be pushed immediately or
     * can be scheduled to be pushed later if there is a locking dialog.
     * @param dialog The dialog to be pushed.
     */
    pushDialog(dialog: Dialog): void;

    /**
     * Attempts to pop the specified dialog.
     * The specified dialog may be popped immediately or
     * can be scheduled to be popped later if there is a locking dialog.
     * @param dialog The dialog to be popped.
     */
    popDialog(dialog: Dialog): void;
};