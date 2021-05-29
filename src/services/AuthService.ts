import { AppService, BaseService } from "core/services";

class PingService extends BaseService {
    constructor(appService: AppService) {
        super("/auth", appService);
    }
    login = (data?: Object, headers?: HeadersInit) => {
        return this.appService.post(this.endpoint + "/login", data, headers);
    };
    register = (data?: Object, headers?: HeadersInit) => {
        return this.appService.post(this.endpoint + "/register", data, headers);
    };
}

export default PingService;
