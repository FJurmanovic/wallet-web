import { HttpClient } from "core/services";

class BaseService {
    private httpClient: HttpClient;
    constructor(private endpoint: string) {
        this.httpClient = new HttpClient();
    }

    getAll = (headers: HeadersInit) => {
        return this.httpClient.get(this.endpoint, null, headers);
    };

    get = (params: Object, headers: HeadersInit) => {
        return this.httpClient.get(this.endpoint, params, headers);
    };

    put = (data: Object, headers: HeadersInit) => {
        return this.httpClient.put(this.endpoint, data, headers);
    };

    post = (data: Object, headers: HeadersInit) => {
        return this.httpClient.post(this.endpoint, data, headers);
    };

    delete = (data: Object, headers: HeadersInit) => {
        return this.httpClient.delete(this.endpoint, data, headers);
    };
}

export default BaseService;
