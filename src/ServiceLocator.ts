import assert = require('assert');

const dict: { [key: string]: any } = {};

export function service(name: string): any {
    return (constructor: any) => {
        assert(dict[name] === undefined);
        dict[name] = constructor;
    };
}

/** Base class for all services. */
export interface Service {
    /** Destroys this service. */
    destroy(): void;
}

export class ServiceLocator {
    private static services: { [key: string]: Service | undefined } = {};

    public static resolve<T extends Service>(type: { prototype: T }): T {
        const keys = Object.keys(this.services);
        for (const key of keys) {
            const item = this.services[key];
            if (cc.js.isChildClassOf((item as any).constructor, type.prototype.constructor)) {
                return this.services[key] as T;
            }
        }
        throw new Error("Please set first");
    }

    public static async register<T extends Service>(value: T): Promise<void> {
        const keys = Object.keys(dict);
        let constructor = value.constructor;
        while (constructor !== null) {
            if (keys.some(key => {
                if (dict[key] === constructor) {
                    const item = this.services[key];
                    item && item.destroy();
                    this.services[key] = value;
                    return true;
                }
                return false;
            })) {
                break;
            }
            constructor = cc.js.getSuper(constructor);
        }
    }
}