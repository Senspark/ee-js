import { MessageBridgeImpl } from "./MessageBridgeImpl";

const kIsMainThread = "Utils_isMainThread";
const kRunOnUiThread = "Utils_runOnUiThread";
const kRunOnUiThreadCallback = "Utils_runOnUiThreadCallback";
const kGetSHA1CertificateFingerprint = "Utils_getSHA1CertificateFingerprint";
const kGetVersionName = "Utils_getVersionName";
const kGetVersionCode = "Utils_getVersionCode";
const kIsApplicationInstalled = "Utils_isApplicationInstalled";
const kOpenApplication = "Utils_openApplication";
const kSendMail = "Utils_sendMail";
const kIsTablet = "Utils_isTablet";
const kTestConnection = "Utils_testConnection";
const kGetDeviceId = "Utils_getDeviceId";

type Runnable<T> = () => T;

function toBool(value?: string) {
    return value === "true";
};

export function isMainThread() {
    let bridge = MessageBridgeImpl.getInstance();
    let response = bridge.call(kIsMainThread);
    return toBool(response);
}

export function runOnUiThread(runnable: Runnable<void>): boolean {
    if (isMainThread()) {
        runnable();
        return true;
    }
    // TODO.
    return false;
};

export function runOnUiThreadAndWait(runnable: Runnable<void>): void {
    // TODO.
};

export function getSHA1CertificateFingerprint(): string {
    let bridge = MessageBridgeImpl.getInstance();
    return bridge.call(kGetSHA1CertificateFingerprint) || '';
};

export function getVersionName(): string {
    let bridge = MessageBridgeImpl.getInstance();
    return bridge.call(kGetVersionName) || '';
};

export function getVersionCode(): string {
    let bridge = MessageBridgeImpl.getInstance();
    return bridge.call(kGetVersionCode) || '';
};

export function isApplicationInstalled(applicationId: string): boolean {
    let bridge = MessageBridgeImpl.getInstance();
    let response = bridge.call(kIsApplicationInstalled, applicationId);
    return toBool(response);
};

export function openApplication(applicationId: string): boolean {
    let bridge = MessageBridgeImpl.getInstance();
    let response = bridge.call(kOpenApplication, applicationId);
    return toBool(response);
};

export function sendMail(recipient: string, subject: string, body: string): boolean {
    let json: any = {};
    json.recipient = recipient;
    json.subject = subject;
    json.body = body;
    let bridge = MessageBridgeImpl.getInstance();
    let response = bridge.call(kSendMail, JSON.stringify(json));
    return toBool(response);
};

export function isTable(): boolean {
    let bridge = MessageBridgeImpl.getInstance();
    let response = bridge.call(kIsTablet);
    return toBool(response);
};

export function testConnection(): boolean {
    let bridge = MessageBridgeImpl.getInstance();
    let response = bridge.call(kTestConnection);
    return toBool(response);
};

export function getDeviceId(): string {
    let bridge = MessageBridgeImpl.getInstance();
    return bridge.call(kGetDeviceId) || '';
};