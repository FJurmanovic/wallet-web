import { AppService, BaseService } from "core/services";

class PingService extends BaseService {
    constructor(appService: AppService) {
        super("/wallet", appService);
    }
}

export default PingService;
