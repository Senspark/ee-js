import { Dialog } from "./Dialog";
import { service } from "./ServiceLocator";

/** Manages all dialog behaviors. */
@service("Dialog")
export abstract class DialogManager {
    /**
     * Attempts to push the specified dialog.
     * The specified dialog may be pushed immediately or
     * can be scheduled to be pushed later if there is a locking dialog.
     * @param dialog The dialog to be pushed.
     */
    public abstract pushDialog(dialog: Dialog): void;

    /**
     * Attempts to pop the specified dialog.
     * The specified dialog may be popped immediately or
     * can be scheduled to be popped later if there is a locking dialog.
     * @param dialog The dialog to be popped.
     */
    public abstract popDialog(dialog: Dialog): void;
}