import { AppService, BaseService } from "core/services";

class WalletService extends BaseService {
    constructor(appService: AppService) {
        super("/wallet", appService);
    }

    getBalance = (params?: Object, headers?: HeadersInit) => {
        return this.appService.get(
            this.endpoint + "/wallet-header",
            params,
            headers
        );
    };
}

export default WalletService;
