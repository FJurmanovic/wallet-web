import { AppService, BaseService } from "core/services";

class WalletService extends BaseService {
    constructor(appService: AppService) {
        super("/wallet", appService);
    }
}

export default WalletService;
