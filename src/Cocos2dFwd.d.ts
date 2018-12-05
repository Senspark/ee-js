// tslint:disable-next-line:no-namespace
// tslint:disable:no-namespace
// tslint:disable:unified-signatures
// tslint:disable:member-access
// tslint:interface-over-type-literal
// tslint:member-ordering
declare namespace ee {
    namespace core {
        type MessageHandler = (message: string) => string;
        type Runnable = () => void;

        function str_tolower(s: string): string;
        function toString(value: number): string;
        function toString(value: boolean): string;
        function toBool(value: string): boolean;
        function format(formatString: string, ...agrs: any[]): string;
        function log(level: LogLevel, tag: string, message: string): void;
        function isMainThread(): boolean;
        function runOnUiThread(runnable: Runnable): boolean;
        function getSHA1CertificateFingerprint(): string;
        function getVersionName(): string;
        function getVersionCode(): string;
        function isApplicationInstalled(applicationId: string): boolean;
        function openApplication(applicationId: string): boolean;
        function sendMail(recipient: string, subject: string, body: string): boolean;
        function isTablet(): boolean;
        function testConnection(): boolean;
        function getDeviceId(callback: (id: string) => void): void;
        function dumpBacktrace(count: number): string;
        function runOnUiThreadDelayed(callback: () => void, delay: number): void;

        class PluginManager {
        }

        class IMessageBridge {
            call(tag: string): string;
            call(tag: string, message: string): string;
            callCpp(tag: string, message: string): string;
            registerHandler(handler: MessageHandler, tag: string): boolean;
            deregisterHandler(tag: string): boolean;
        }

        class MessageBridge extends IMessageBridge {
            static getInstance(): this;
        }

        class LogLevel {
            static readonly Verbose: LogLevel;
            static readonly Debug: LogLevel;
            static readonly Info: LogLevel;
            static readonly Warn: LogLevel;
            static readonly Error: LogLevel;
            static readonly Assert: LogLevel;

            priority: number;
            desc: string;

            constructor(priority: number, desc: string);
        }

        class Logger {
            static getSystemLogger(): Logger;
            static setSystemLogger(logger: Logger): void;

            constructor();
            constructor(tag: string);
            constructor(tag: string, callback: (level: LogLevel, tag: string, message: string) => void);

            setEnabled(enabled: boolean): void;

            log(level: LogLevel, formatString: string, ...args: any[]): void;
            verbose(formatString: string, ...args: any[]): void;
            debug(formatString: string, ...args: any[]): void;
            info(formatString: string, ...args: any[]): void;
            warn(formatString: string, ...args: any[]): void;
            error(formatString: string, ...args: any[]): void;
            wtf(formatString: string, ...args: any[]): void;
        }

        namespace Metrics {
            enum ResolutionPolicy {
                FixedWidth,
                FixedHeight,
            }
        }

        class Metrics {
            static initialize(
                frameSize: [number, number],
                winSize: [number, number], policy: Metrics.ResolutionPolicy): void;
            static initialize(ratio: number): void;
            static getWinSize(): [number, number];
            static getFrameSize(): [number, number];
            static getDensity(): number;
            static fromPoint(value: number): this;
            static fromPixel(value: number): this;
            static fromDip(value: number): this;
            toPoint(): number;
            toPixel(): number;
            toDip(): number;
        }

        class VideoPlayer {
            constructor();
            loadFile(path: string): void;
            setPosition(x: number, y: number): void;
            setSize(width: number, height: number): void;
            play(): void;
            pause(): void;
            resume(): void;
            stop(): void;
            isVisible(): boolean;
            setVisible(visible: boolean): void;
            isKeepAspectRatioEnabled(): boolean;
            setKeepAspectRatioEnabled(): void;
            isFullScreenEnabled(): boolean;
            setFullScreenEnabled(enabled: boolean): void;
        }

        class VideoPlayerManager {
            static getInstance(): this;
            createVideoPlayer(): VideoPlayer;
            destroyVideoPlayer(player: VideoPlayer): boolean;
        }
    }

    namespace google {
        // tslint:disable-next-line:interface-over-type-literal
        type TrackingDict = { [key: string]: string };
        class Analytics {
            constructor();
            setDispatchInterval(seconds: number): void;
            setDryRun(enabled: boolean): void;
            setOptOut(enabled: boolean): void;
            setTrackUncaughtException(enabled: boolean): void;
            dispatch(): void;
            createTracker(trackingId: string): AnalyticsTracker;
            doTests(): number;
        }

        class Builder {
            constructor();
            addImpression(product: Product, impressionList: string): this;
            addProduct(product: Product): this;
            setProductAction(action: ProductAction): this;
            set(paramName: string, paramValue: string): this;
            setCustomDimension(index: number, dimension: string): this;
            setCustomMetric(index: number, metric: number): this;
            build(): TrackingDict;
        }

        class EventBuilder extends Builder {
            constructor();
            constructor(category: string, action: string);
            setCategory(category: string): this;
            setAction(action: string): this;
            setLabel(label: string): this;
            setValue(value: number): this;
        }

        class ExceptionBuilder extends Builder {
            constructor();
            setDescription(description: string): this;
            setFatal(fatal: boolean): this;
        }

        class ScreenViewBuilder extends Builder {
            constructor();
        }

        class SocialBuilder extends Builder {
            constructor();
            setNetWork(netWork: string): this;
            setAction(action: string): this;
            setTarget(target: string): this;
        }

        class TimingBuilder extends Builder {
            constructor();
            constructor(category: string, variable: string, value: number);
            setVariable(variable: string): this;
            setValue(value: number): this;
            setCategory(category: string): this;
            setLabel(label: string): this;
        }

        class Product {
            setCategory(value: string): this;
            setId(value: string): this;
            setName(value: string): this;
            setPrice(price: string): this;
            build(productIndex: number): TrackingDict;
            build(listIndex: number, productIndex: number): TrackingDict;
        }

        class ProductAction {
            static ActionAdd(): string;
            static ActionCheckout(): string;
            static ActionClick(): string;
            static ActionDetail(): string;
            static ActionPurchase(): string;
            constructor();

            setProductActionList(value: string): this;
            setProductListSource(value: string): this;
            setTransactionId(value: string): this;
            setTransactionRevenue(value: number): this;
            build(): TrackingDict;
        }

        class AnalyticsTracker {
            constructor();
            setParameter(key: string, value: string): void;
            setAllowIDFACollection(enabled: boolean): void;
            setScreenName(screenName: string): void;
            send(dict: TrackingDict): void;
        }
    }

    namespace recorder {
        class Recorder {
            constructor();
            startScreenRecording(): void;
            stopScreenRecording(): void;
            cancelScreenRecording(): void;
            getScreenRecordingUrl(): string;
            checkRecordingPermission(): boolean;
        }
    }

    namespace ads {
        type AdViewCallback = (result: boolean) => void;
        type OnClickedCallback = () => void;
        class IAdview {
            constructor();
            isLoaded(): boolean;
            load(): void;
            getAnchor(): [number, number];
            setAnchor(x: number, y: number): void;
            getPosition(): [number, number];
            setPosition(x: number, y: number): void;
            getSize(): [number, number];
            setSize(width: number, height: number): void;
            setVisible(visible: boolean): void;
            setLoadCallback(callback: AdViewCallback): void;
            setOnClickedCallback(callback: OnClickedCallback): void;
        }

        class IInterstitialAd {
            constructor();
            isLoaded(): boolean;
            load(): void;
            show(): boolean;
            setResultCallback(callback: () => void): void;
            setOnClickedCallback(callback: () => void): void;
            doOnClicked(): void;
        }

        class IRewardedVideo {
            isLoaded(): boolean;
            load(): void;
            show(): boolean;
            setResultCallback(callback: (result: boolean) => void): void;
            setOnClickedCallback(callback: () => void): void;
            doOnClicked(): void;
        }

        class MultiAdView extends IAdview {
            constructor();
            addItem(item: IAdview): this;
        }

        class MultiInterstitialAd extends IInterstitialAd {
            constructor();
            addItem(item: IInterstitialAd): this;
        }

        class MultiRewardedVideo extends IRewardedVideo {
            constructor();
            constructor(logger: core.Logger);
            addItem(item: IRewardedVideo): this;
        }

        class NullAdView extends IAdview {
            constructor();
        }

        class NullInterstitialAd extends IInterstitialAd {
        }

        class NullRewardedVideo extends IRewardedVideo {
            constructor(logger: core.Logger);
        }
    }

    namespace ironsource {
        class IronSource {
            constructor();
            constructor(logger: core.Logger);

            initialize(gameId: string): void;
            createRewardedVideo(placementId: string): ads.IRewardedVideo;
            createInterstitialAd(placementId: string): ads.IInterstitialAd;
            setCloseTimeout(timeout: number): void;
        }
    }

    namespace admob {
        class AdMob {
            constructor();
            constructor(logger: core.Logger);
            initialize(applicationId: string): void;
            getEmulatorTestDeviceHash(): string;
            addTestDevice(hash: string): void;
            createBannerAd(adId: string, adSize: BannerAdSize): IAdView;
            createNativeAd(adId: string, layoutName: string, identifiers: NativeAdLayout): IAdView;
            createInterstitialAd(adID: string): ads.IInterstitialAd;
            createRewardedVideo(adID: string): ads.IRewardedVideo;
        }

        enum BannerAdSize {
            Normal,
            Large,
            Smart,
        }

        class NativeAdLayout {
            constructor();
            setBody(id: string): this;
            setCallToAction(id: string): this;
            setHeadline(id: string): this;
            setIcon(id: string): this;
            setImage(id: string): this;
            setMedia(id: string): this;
            setPrice(id: string): this;
            setStarRating(id: string): this;
            setStore(id: string): this;
        }
    }

    namespace applovin {
        class AppLovin {
            constructor();
            constructor(logger: core.Logger);
            initialize(key: string): void;
            setTestAdsEnabled(enabled: boolean): void;
            setVerboseLogging(enabled: boolean): void;
            setMuted(enabled: boolean): void;
            createRewardedVideo(): ads.IRewardedVideo;
        }
    }

    namespace appsflyer {
        class IBridge {
            initialize(devKey: string, appId: string): void;
            startTracking(): void;
            getDeviceId(): string;
            setDebugEnabled(enabled: boolean): void;
            setStopTracking(enabled: boolean): void;
            trackEvent(name: string, values: { [key: string]: string }): void;
        }
    }

    namespace firebase {
        type FetchCallback = (succeeded: boolean) => void;
        type HashCallback = (succeeded: boolean, hash: string) => void;
        type DataCallback = (succeeded: boolean, data: string) => void;
        type MessageCallback = (message: Message) => void;
        type TokenCallback = (token: string) => void;

        class App {
            static initialize(): void;
            static getWindowText(): any;
        }

        class Analytics {
            constructor();
            initialize(): boolean;
            analyticsCollectionEnabled(enabled: boolean): void;
            setMinimumSessionDuration(milliseconds: number): void;
            setSessionTimeoutDuration(milliseconds: number): void;
            setUserId(userId: string): void;
            setUserProperty(name: string, property: string): void;
            logEvent(name: string, dict: { [key: string]: string } = {}): void;
        }

        class RemoteConfig {
            constructor();
            initialize(): boolean;
            fetchJS(callback: FetchCallback): void;
            fetch(devModeEnabled: boolean, callback: FetchCallback): void;
            setDefaultBool(key: string, value: boolean): void;
            setDefaultLong(key: string, value: number): void;
            setDefaultDouble(key: string, value: number): void;
            setDefaultString(key: string, value: string): void;
            flushDefaults(): void;
            getBool(key: string): boolean;
            getLong(key: string): number;
            getDouble(key: string): number;
            getString(key: string): string;
        }

        class Storage {
            constructor();
            initialize(): boolean;
            getMaxDownloadRetryTime(): number;
            getMaxUploadRetryTime(): number;
            getMaxOperationRetryTime(): number;
            setMaxDownloadRetryTime(seconds: number): void;
            setMaxOperationRetryTime(seconds: number): void;
            setMaxUploadRetryTime(seconds: number): void;
            getHash(filePath: string, callback: HashCallback): void;
            getData(filePath: string, callback: DataCallback): void;
        }

        class Notification {
            title: string;
            body: string;
            constructor();
        }

        class Message {
            from: string;
            to: string;
            rawData: string;
            messageType: string;
            error: string;
            errorDescription: string;
            data: { [key: string]: string };
            messageId: string;
            notification: Notification;
            notificationOpened: boolean;
            constructor();
        }

        class Messaging {
            constructor();
            initialize(): boolean;
            initialize(callback: TokenCallback): boolean;
            setMessageCallback(callback: MessageCallback): void;
            setTokenCallback(callback: TokenCallback): void;
            subscribe(topic: string): void;
            unsubscribe(topic: string): void;
        }
    }

    namespace notification {
        class Notification {
            constructor();
            schedule(builder: NotificationBuilder): void;
            unSchedule(tag: number): void;
            clearAll(): void;
        }

        class NotificationBuilder {
            constructor();
            setTicker(ticker: string): this;
            setTitle(title: string): this;
            setBody(body: string): this;
            setDelay(delay: number): this;
            setInterval(interval: number): this;
            setTag(tag: number): this;
        }
    }

    namespace unityads {
        class UnityAds {
            constructor();
            constructor(logger: core.Logger);
            initialize(gameId: string, testModeEnabled: boolean): void;
            setDebugModeEnabled(enabled: boolean): void;
            createRewardedVideo(placementId: string): ads.IRewardedVideo;
            createInterstitialAd(placementId: string): ads.IInterstitialAd;
        }
    }

    namespace vungle {
        class Vungle {
            constructor();
            constructor(loggle: core.Logger);
            initialize(gameId: string): void;
            initialize(gameId: string, placementId: string): void;
            createRewardedVideo(placementId: string): ads.IRewardedVideo;
        }
    }
}