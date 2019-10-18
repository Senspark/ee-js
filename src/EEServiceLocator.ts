import assert = require('assert');

const nameToConstructor: { [key: string]: any } = {};
const constructorToName: { [key: string]: any } = {};

export function service(name: string): any {
    return (constructor: any) => {
        assert(nameToConstructor[name] === undefined);
        nameToConstructor[name] = constructor;
        constructorToName[constructor] = name;
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
        const constructor = type.prototype.constructor;
        const key = constructor.toString();
        if (this.services[key]) {
            return this.services[key] as T;
        }
        throw new Error("Please set first");
    }

    public static async register<T extends Service>(value: T): Promise<void> {
        let constructor = value.constructor;
        while (constructor !== null) {
            const key = constructor.toString();
            if (constructorToName[key]) {
                const item = this.services[key];
                item && item.destroy();
                this.services[key] = value;
                break;
            }
            constructor = cc.js.getSuper(constructor);
        }
    }
}