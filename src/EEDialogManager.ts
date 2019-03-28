import { Dialog } from "./EEDialog";
import { service, Service } from "./EEServiceLocator";

/** Manages all dialog behaviors. */
@service("Dialog")
export abstract class DialogManager implements Service {
    public abstract destroy(): void;

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

    /**
     * Attempts to pop to a specified number of dialogs remaining.
     * @param level Number of dialogs remain in stacks
     */
    public abstract popToLevel(level: number): void;
}