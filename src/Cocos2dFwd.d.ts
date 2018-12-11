// tslint:disable:no-namespace
// tslint:disable:unified-signatures
// tslint:disable:member-access
// tslint:disable:variable-name
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
            static getInstance(): MessageBridge;
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
            static fromPoint(value: number): Metrics;
            static fromPixel(value: number): Metrics;
            static fromDip(value: number): Metrics;
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
            static getInstance(): VideoPlayerManager;
            createVideoPlayer(): VideoPlayer;
            destroyVideoPlayer(player: VideoPlayer): boolean;
        }
    }

    namespace google {
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
            build(): { [key: string]: string };
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
            setNetwork(network: string): this;
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
            constructor();
            setCategory(value: string): this;
            setId(value: string): this;
            setName(value: string): this;
            setPrice(price: string): this;
            build(productIndex: number): TrackingDict;
            build(listIndex: number, productIndex: number): TrackingDict;
        }

        class ProductAction {
            static readonly ActionAdd: string;
            static readonly ActionCheckout: string;
            static readonly ActionClick: string;
            static readonly ActionDetail: string;
            static readonly ActionPurchase: string;
            constructor(action: string);

            setProductActionList(value: string): this;
            setProductListSource(value: string): this;
            setTransactionId(value: string): this;
            setTransactionRevenue(value: number): this;
            build(): TrackingDict;
        }

        class AnalyticsTracker {
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
        class IAdView {
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

        class MultiAdView extends IAdView {
            constructor();
            addItem(item: IAdView): this;
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

        class NullAdView extends IAdView {
            constructor();
        }

        class NullInterstitialAd extends IInterstitialAd {
            constructor()
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
            createBannerAd(adId: string, adSize: BannerAdSize): ads.IAdView;
            createNativeAd(adId: string, layoutName: string, identifiers: NativeAdLayout): ads.IAdView;
            createInterstitialAd(adId: string): ads.IInterstitialAd;
            createRewardedVideo(adId: string): ads.IRewardedVideo;
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

        class Bridge extends IBridge {
            constructor();
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
            unschedule(tag: number): void;
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
            constructor(logger: core.Logger);
            initialize(gameId: string): void;
            initialize(gameId: string, placementId: string): void;
            createRewardedVideo(placementId: string): ads.IRewardedVideo;
        }
    }
}

declare namespace soomla {
    type CurrencyBalanceChangedCallback = (itemId: string, balance: number, amountAdded: number) => void;
    type GoodBalanceChangedCallback = (itemId: string, balance: number, amountAdded: number) => void;
    type GoodUpgradeCallback = (good: string, upgradeId: string) => void;
    type ItemPurchasedCallback = (purchasableId: string, payload: string) => void;
    type MarketPurchaseStartedCallback = (purchasableId: string) => void;
    type MarketPurchaseCallback = (
        purchasableId: string, payload: string, extraInfo: { [key: string]: string }) => void;
    type MarketPurchaseCanceledCallback = (purchasableId: string) => void;
    type MarketItemsRefreshStartedCallback = () => void;
    type MarketItemsRefreshedCallback = (marketItemIds: string[]) => void;
    type MarketItemsRefreshFailedCallback = (errorMessage: string) => void;
    type RestoreTransactionStartedCallback = () => void;
    type RestoreTransactionFinishedCallback = (succeeded: boolean) => void;
    type UnexpectedStoreErrorCallback = (errorCode: number) => void;

    class CCError {
        static createWithValue(value: any): CCError;
        static tryFillError(error: CCError, value: { [key: string]: any }, tag: string = null): void;
        getInfo(): string;
    }

    class CCPurchaseType {
        constructor();
        init(): boolean;
        buy(payload: string, error: CCError = null): void;
        canAfford(error: CCError = null): boolean;
        setAssociatedItemId(mAssociatedItemId: string): void;
        getAssociatedItemId(): string;
    }

    class CCVirtualGood extends CCPurchasableVirtualItem {
        resetBalance(balance: number, notify: boolean, error: CCError = null): number;
        getBalance(error: CCError = null): number;
    }

    class CCVirtualCategory extends CCDomain {
        static create(name: string, goodItemIds: string[]): CCVirtualCategory;
        init(name: string, goodItemIds: string[]): boolean;
        setName(mName: string): void;
        getName(): string;
        setGoodItemIds(mGoodItemIds: string[]): void;
        getGoodItemIds(): string[];
    }

    class CCVirtualCurrencyPack extends CCPurchasableVirtualItem {
        static create(
            name: string,
            description: string,
            itemId: string,
            currencyAmount: number,
            currencyItemId: string,
            purchaseType: CCPurchaseType): CCVirtualCurrencyPack;

        init(
            name: string,
            description: string,
            itemId: string,
            currencyAmount: number,
            currencyItemId: string,
            purchaseType: CCPurchaseType): boolean;

        setCurrencyAmount(mCurrency: number): void;
        getCurrencyAmount(): number;
        setCurrencyItemId(mCurrencyItemId: string): void;
        getCurrencyItemId(): string;
    }

    class CCSoomlaEntity extends CCDomain {
        init(id: string, name: string = "", description: string = ""): boolean;
        getType(): string;
        equals(obj: any): boolean;
        clone(newId: string): CCSoomlaEntity;
    }

    class CCVirtualItem extends CCSoomlaEntity {
        getItemId(): string;
        give(amount: number, error: CCError = null): number;
        give(amount: number, notify: boolean, error: CCError = null): number;
        take(amount: number, error: CCError = null): number;
        take(amount: number, notify: boolean, error: CCError = null): number;
        resetBalance(balance: number, error: CCError = null): number;
        resetBalance(balance: number, notify: boolean, error: CCError = null): number;
        getBalance(error: CCError = null): number;
        getBalance(): number;
        save(saveToDB: boolean = true): void;
    }

    class CCVirtualCurrency extends CCVirtualItem {
        static create(name: string, description: string, itemId: string): CCVirtualCurrency;
    }

    class CCPurchasableVirtualItem {
        constructor();
        init(name: string, description: string, itemId: string, purchaseType: CCPurchaseType): boolean;
        canAfford(error: CCError = null): boolean;
        buy(payload: string, error: CCError = null): void;
        canBuy(): boolean;
        setPurchaseType(mPurchaseType: CCPurchaseType): void;
        getPurchaseType(): CCPurchaseType;
    }

    class CCVirtualGood extends CCPurchasableVirtualItem {
        resetBalance(balance: number, notify: boolean, error: CCError = null): number;
        getBalance(error: CCError = null): number;
    }

    class CCLifetimeVG extends CCVirtualGood {
        static create(
            name: string,
            description: string,
            itemId: string,
            purchaseType: CCPurchaseType): CCLifetimeVG;
        canBuy(): boolean;
        give(amount: number, notify: boolean, error: CCError = null): number;
        take(amount: number, notify: boolean, error: CCError = null): number;
        getType(): string;
    }

    class CCLifetimeVGBuilder {
        constructor();
        setPurchaseType(type: CCPurchaseType): this;
        setName(name: string): this;
        setDescription(description: string): this;
        setItemId(itemId: string): this;
        build(): CCVirtualItem;
    }

    class CCMarketItem extends CCDomain {
        static create(productId: string, price: number): CCMarketItem;
        init(productId: string, price: number): boolean;
        setProductId(mProductId: string): void;
        getProductId(): string;
        setPrice(mPrice: number): void;
        getPrice(): number;
        setMarketPriceAndCurrency(mMarketPriceAndCurrency: string): void;
        getMarketPriceAndCurrency(): string;
        setMarketTitle(mMarketTitle: string): void;
        getMarketTitle(): string;
        setMarketDescription(mMarketCurrencyCode: string): void;
        getMarketDescription(): string;
        setMarketCurrencyCode(mMarketCurrencyCode: string): void;
        getMarketCurrencyCode(): string;
        setMarketPriceMicros(mMarketPriceMicros: number): void;
        getMarketPriceMicros(): number;
    }

    class CCPurchasableVirtualItem extends CCVirtualItem {
        /* using CCVirtualItem::init */
        init(name: string, description: string, itemId: string, purchaseType: CCPurchaseType): boolean;
        canAfford(error: CCError = null): boolean;
        buy(payload: string, error: CCError = null): void;
        canBuy(): boolean;
        setPurchaseType(mPurchaseType: CCPurchaseType): void;
        getPurchaseType(): CCPurchaseType;
    }

    class CCPurchaseWithMarketBuilder {
        constructor();
        setProductId(productId: string): this;
        setPrice(price: number): this;
        build(): CCPurchaseType;
    }

    class CCPurchaseWithMarket extends CCPurchaseType {
        static create(productId: string, price: number): CCPurchaseWithMarket;
        static createWithMarketItem(marketItem: CCMarketItem): CCPurchaseWithMarket;
        initWithMarketItem(marketItem: CCMarketItem): boolean;
        setMarketItem(mMarketItem: CCMarketItem): void;
        getMarketItem(): CCMarketItem;
    }

    class CCSingleUsePackVG extends CCVirtualGood {
        static create(
            goodItemId: string,
            goodAmount: number,
            name: string,
            description: string,
            itemId: string,
            purchaseType: CCPurchaseType): CCSingleUsePackVG;

        init(
            goodItemId: string,
            goodAmount: number,
            name: string,
            description: string,
            itemId: string,
            PurchaseType: CCPurchaseType): boolean;

        setGoodItemId(mGoodItemId: string): void;
        getGoodItemId(): string;
        setGoodAmount(mGoodAmount: number): void;
        getGoodAmount(): number;
    }

    class CCStoreAssets {
        getVersion(): number;
        getCurrencies(): CCVirtualCurrency[];
        getGoods(): CCVirtualGood[];
        getCurrencyPacks(): CCVirtualCurrencyPack[];
        getCategories(): CCVirtualCategory[];
    }

    class CCSoomlaStore {
        static getInstance(): CCSoomlaStore;
        static initialize(storeAssets: CCStoreAssets, storeParams: { [key: string]: any }): void;
        buyMarketItem(productId: string, payload: string, error: CCError = null): void;
        restoreTransactions(): void;
        refreshInventory(): void;
        refreshMarketItemsDetails(error: CCError = null): void;
    }

    class CCStoreAssetsBuilder {
        constructor();
        setVersion(version: number): this;
        addCurrency(currency: CCVirtualCurrency): this;
        addGood(good: CCVirtualGood): this;
        addCurrencyPack(pack: CCVirtualCurrencyPack): this;
        addCategorie(category: CCVirtualCategory): this;
        build(): CCStoreAssets;
    }

    class CCStoreInfo {
        static sharedStoreInfo(): CCStoreInfo;
        static createShared(storeAssets: CCStoreAssets): void;
        init(storeAssets: CCStoreAssets): boolean;
        initWithValueMap(map: { [key: string]: any }): boolean;
        saveItem(virtualItem: CCVirtualItem, saveToDB: boolean = true): void;
        saveItems(virtualItems: CCVirtualItem[], saveToDB: boolean = true): void;
        save(): void;
        toValueMap(): { [key: string]: any };
        setCurrencies(mCurrencies: CCVirtualCurrency[]): void;
        getCurrencies(): CCVirtualCurrency[];
        setCurrencyPacks(mCurrencyPacks: CCVirtualCurrencyPack[]): void;
        getCurrencyPacks(): CCVirtualCurrencyPack[];
        setGoods(mGoods: CCVirtualGood[]): void;
        getGoods(): CCVirtualGood[];
        setCategories(mCategories: CCVirtualCategory[]): void;
        getCateGories(): CCVirtualCategory[];
    }

    class CCStoreInventory {
        static sharedStoreInventory(): CCStoreInventory;
        init(): boolean;
        canAfford(itemId: string, error: CCError = null): boolean;
        buyItem(itemId: string, error: CCError = null): void;
        buyItem(itemId: string, payload: string, error: CCError = null): void;
        getItemBalance(itemId: string, error: CCError = null): number;
        giveItem(itemId: string, amount: number, error: Error = null): void;
        takeItem(itemId: string, amount: number, error: CCError = null): void;
        equipVirtualGood(itemId: string, error: CCError = null): void;
        unEquipVirtualGood(itemId: string, error: CCError = null): void;
        isVirtualGoodEquipped(itemId: string, error: CCError): boolean;
        getGoodUpgradeLevel(goodItemId: string, error: CCError = null): number;
        upgradeGood(goodItemId: string, error: CCError = null): void;
        removeGoodUpgrades(goodItemId: string, error: CCError = null): void;
        refreshLocalInventory(): void;
        refreshOnGoodUpgrade(vg: CCVirtualGood, uvg: CCUpgradeVG): void;
        refreshOnGoodEquipped(equippable: CCEquippableVG): void;
        refreshOnGoodUnEquipped(equippable: CCEquippableVG): void;
        refreshOnCurrencyBalanceChanged(good: CCVirtualCurrency, balance: number, amountAdded: number): void;
        refreshOnGoodBalanceChanged(good: CCVirtualGood, balance: number, amountAdded: number): void;
        updateLocalBalance(itemId: string, balance: number): void;
    }

    class CCVirtualCurrencyBuilder {
        constructor();
        setName(name: string): this;
        setDescription(description: string): this;
        setItemId(itemId: string): this;
        build(): CCVirtualItem;
    }

    class CCVirtualCurrencyPack extends CCPurchasableVirtualItem {
        static create(
            name: string,
            description: string,
            itemId: string,
            currencyAmount: number,
            currencyItemId: string,
            purchaseType: CCPurchaseType): CCVirtualCurrencyPack;
        init(
            name: string,
            description: string,
            itemId: string,
            currencyAmount: number,
            currencyItemId: string,
            purchaseType: CCPurchaseType): boolean;
        setCurrencyAmount(mCurrencyAmount: number): void;
        getCurrencyAmount(): number;
        setCurrencyItemId(mCurrencyItemId: string): string;
        getCurrencyItemId(): string;
    }

    class CCVirtualItem extends CCSoomlaEntity {
        getItemId(): string;
        give(amount: number, error: CCError = null): number;
        give(amount: number, notify: boolean, error: CCError = null): number;
        take(amount: number, error: CCError = null): number;
        take(amount: number, notify: boolean, error: CCError): number;
        resetBalance(balance: number, error: CCError = null): number;
        resetBalance(balance: number, notify: boolean, error: CCError = null): number;
        getBalance(error: CCError = null): number;
        getBalance(): number;
        save(saveToDB: boolean = true): void;
    }

    class CCVirtualCurrencyPackBuilder {
        constructor();
        setName(name: string): this;
        setDescription(description: string): this;
        setItemId(itemId: string): this;
        setCurrencyAmount(currencyAmount: number): this;
        setCurrencyItemId(currencyItemId: string): this;
        setPurchaseType(type: CCPurchaseType): this;
        build(): CCVirtualCurrencyPack;
    }

    class StoreEventListener {
        constructor();
        setCurrencyBalanceChangedCallback(callback: CurrencyBalanceChangedCallback): void;
        setGoodBalanceChangedCallback(callback: GoodBalanceChangedCallback): void;
        setGoodUpgradeCallback(callback: GoodUpgradeCallback): void;
        setItemPurchasedCallback(callback: ItemPurchasedCallback): void;
        setMarketPurchaseCallback(callback: MarketPurchaseCallback): void;
        setMarketPurchaseStartedCallback(callback: MarketPurchaseStartedCallback): void;
        setMarketPurchaseCanceledCallback(callback: MarketPurchaseCanceledCallback): void;
        setMarketItemsRefreshStartedCallback(callback: MarketItemsRefreshStartedCallback): void;
        setMarketItemsRefreshedCallback(callback: MarketItemsRefreshedCallback): void;
        setMarketItemsRefreshFailedCallback(callback: MarketItemsRefreshFailedCallback): void;
        setRestoreTransactionStartedCallback(callback: RestoreTransactionStartedCallback): void;
        setRestoreTransactionFinishedCallback(callback: RestoreTransactionFinishedCallback): void;
        setUnexpectedStoreErrorCallback(callback: UnexpectedStoreErrorCallback): void;
        clear(): void;
    }

    class CCDomain {
        initWithValueMap(dict: { [key: string]: any }): boolean;
        toValueMap(): { [key: string]: any };
    }

    class CCSoomla {
        static initialize(soomlaSecret: string): void;
    }
}