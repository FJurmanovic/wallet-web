import { AppMainElement } from "components/";
import { HttpClient } from "..";

class AppService {
    constructor(
        public appMain: AppMainElement,
        public httpClient: HttpClient
    ) {}

    post = async (
        url: string,
        data: Object,
        headersParam: HeadersInit
    ): Promise<any> => {
        headersParam = {
            ...headersParam,
            Authorization: `BEARER ${this.appMain?.authStore?.token}`,
        };
        try {
            const response = await this.httpClient.post(
                url,
                data,
                headersParam
            );
            if (
                response?.statusCode == 400 ||
                response?.statusCode == 500 ||
                response?.statusCode == 401
            ) {
                if (response?.statusCode == 401) {
                    this.appMain.authStore.token = null;
                    this.appMain.routerService.goTo("/token-expired");
                }
                throw response;
            }
            return response;
        } catch (err) {
            throw err;
        }
    };

    put = async (
        url: string,
        data: Object,
        headersParam: HeadersInit
    ): Promise<any> => {
        headersParam = {
            ...headersParam,
            Authorization: `BEARER ${this.appMain?.authStore?.token}`,
        };
        try {
            const response = await this.httpClient.put(url, data, headersParam);
            if (
                response?.statusCode == 400 ||
                response?.statusCode == 500 ||
                response?.statusCode == 401
            ) {
                if (response?.statusCode == 401) {
                    this.appMain.authStore.token = null;
                    this.appMain.routerService.goTo("/token-expired");
                }
                throw response;
            }
            return response;
        } catch (err) {
            throw err;
        }
    };

    delete = async (
        url: string,
        data: Object,
        headersParam: HeadersInit
    ): Promise<any> => {
        headersParam = {
            ...headersParam,
            Authorization: `BEARER ${this.appMain?.authStore?.token}`,
        };
        try {
            const response = await this.httpClient.delete(
                url,
                data,
                headersParam
            );
            if (
                response?.statusCode == 400 ||
                response?.statusCode == 500 ||
                response?.statusCode == 401
            ) {
                if (response?.statusCode == 401) {
                    this.appMain.authStore.token = null;
                    this.appMain.routerService.goTo("/token-expired");
                }
                throw response;
            }
            return response;
        } catch (err) {
            throw err;
        }
    };

    get = async (
        url: string,
        params: Object,
        headersParam: HeadersInit
    ): Promise<any> => {
        headersParam = {
            ...headersParam,
            Authorization: `BEARER ${this.appMain?.authStore?.token}`,
        };
        try {
            const response = await this.httpClient.get(
                url,
                params,
                headersParam
            );
            if (
                response?.statusCode == 400 ||
                response?.statusCode == 500 ||
                response?.statusCode == 401
            ) {
                if (response?.statusCode == 401) {
                    this.appMain.routerService.goTo("/token-expired");
                    this.appMain.authStore.token = null;
                }
                throw response;
            }
            return response;
        } catch (err) {
            throw err;
        }
    };
}

export default AppService;
