declare namespace ee {
    namespace core {
        class LogLevel {
            static readonly Verbose: LogLevel;
            static readonly Debug: LogLevel;
            static readonly Info: LogLevel;
            static readonly Warn: LogLevel;
            static readonly Error: LogLevel;
            static readonly Assert: LogLevel;
            constructor(priority: number, desc: string);

            priority: number;
            desc: string;
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
    }

    namespace ads {
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
            setResultCallback(callback: (boolean) => void): void;
            setOnClickedCallback(callback: () => void): void;
            doOnClicked(): void;
        }

        class MultiRewardedVideo extends IRewardedVideo {
            constructor();
            constructor(logger: core.Logger);
            addItem(item: IRewardedVideo): this;
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
}