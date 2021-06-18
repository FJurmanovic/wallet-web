import { AppService, BaseService } from 'core/services';

class SubscriptionTypeService extends BaseService {
	constructor(appService: AppService) {
		super('/subscription-type', appService);
	}
}

export default SubscriptionTypeService;
