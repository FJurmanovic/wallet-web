import { AppService, BaseService } from 'core/services';

class SubscriptionService extends BaseService {
	constructor(appService: AppService) {
		super('/subscription', appService);
	}
}

export default SubscriptionService;
