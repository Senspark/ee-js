const serviceInfos: Array<[any, string]> = [];

export function service(name: string): any {
    return (target: any) => {
        serviceInfos.push([target, name]);
    };
}

function flushInfos(): void {
    if (serviceInfos.length === 0) {
        return;
    }
    for (const [target, serviceName] of serviceInfos) {
        (target.prototype as any).__service_name__ = serviceName;
    }
    serviceInfos.length = 0;
}

function getServiceName(target: any): string | undefined {
    flushInfos();
    return target.prototype.__service_name__;
}

/** Base class for all services. */
export interface Service {
    /** Destroys this service. */
    destroy(): void;
}

export class ServiceLocator {
    private static services: { [key: string]: Service | undefined } = {};

    public static resolve<T extends Service>(type: { prototype: T }): T {
        const serviceName = getServiceName(type);
        if (serviceName) {
            return this.services[serviceName] as T;
        }
        throw new Error("Service not registered.");
    }

    public static async register<T extends Service>(value: T): Promise<void> {
        const serviceName = getServiceName(value.constructor);
        if (serviceName) {
            const item = this.services[serviceName];
            item && item.destroy();
            this.services[serviceName] = value;
            return;
        }
        throw new Error("Service name not registered.");
    }
}