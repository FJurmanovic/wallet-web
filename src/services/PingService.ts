import { BaseService } from "core/services";

class PingService extends BaseService {
    constructor() {
        super("/api");
    }
}

export default PingService;
