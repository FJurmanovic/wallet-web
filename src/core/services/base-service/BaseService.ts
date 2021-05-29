import { AppService, HttpClient } from "core/services";

class BaseService {
    constructor(public endpoint: string, public appService: AppService) {}

    getAll = (headers?: HeadersInit) => {
        return this.appService.get(this.endpoint, null, headers);
    };

    get = (params?: Object, headers?: HeadersInit) => {
        return this.appService.get(this.endpoint, params, headers);
    };

    put = (data?: Object, headers?: HeadersInit) => {
        return this.appService.put(this.endpoint, data, headers);
    };

    post = (data?: Object, headers?: HeadersInit) => {
        return this.appService.post(this.endpoint, data, headers);
    };

    delete = (data?: Object, headers?: HeadersInit) => {
        return this.appService.delete(this.endpoint, data, headers);
    };
}

export default BaseService;
