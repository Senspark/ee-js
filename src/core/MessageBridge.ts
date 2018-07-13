export type MessageHandler = (message?: string) => string | undefined;

export interface MessageBridge {
    call(tag: string, message?: string): string | undefined;
    callCpp(tag: string, message?: string): string | undefined;
    registerHandler(handler: MessageHandler, tag: string): boolean;
    deregisterHandler(tag: string): boolean;
};