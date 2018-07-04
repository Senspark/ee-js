import { MessageBridge, MessageHandler } from "./MessageBridge";

export class MessageBridgeImpl implements MessageBridge {
    private static sharedInstance?: MessageBridge;

    public static getInstance(): MessageBridge {
        return this.sharedInstance || (this.sharedInstance = new this());
    };

    public call(tag: string, message?: string): string | undefined {
        throw new Error("Method not implemented.");
    };

    public callCpp(tag: string, message?: string): string | undefined {
        throw new Error("Method not implemented.");
    };

    public registerHandler(handler: MessageHandler, tag: string): boolean {
        throw new Error("Method not implemented.");
    };

    public deregisterHandler(tag: string): boolean {
        throw new Error("Method not implemented.");
    };
};