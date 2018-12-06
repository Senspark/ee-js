import assert = require('assert');

const dict: { [key: string]: any } = {};

export function service(name: string): any {
    return (constructor: any) => {
        assert(dict[name] === undefined);
        dict[name] = constructor;
    };
}

export class ServiceLocator {
    private static services: { [key: string]: any } = {};

    public static resolve<T>(type: { prototype: T }): T {
        const keys = Object.keys(this.services);
        for (const key of keys) {
            if (cc.js.isChildClassOf(this.services[key].constructor, type.prototype.constructor)) {
                return this.services[key] as T;
            }
        }
        throw new Error("Please set first ");
    }

    public static register<T>(value: T): void {
        const keys = Object.keys(dict);
        let constructor = value.constructor;
        while (constructor !== null) {
            if (keys.some(key => {
                if (dict[key] === constructor) {
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