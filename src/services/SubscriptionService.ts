import { AppService, BaseService } from 'core/services';

class SubscriptionService extends BaseService {
	constructor(public appService: AppService) {
		super('/subscription', appService);
	}

	endSubscription = (id) => {
		return this.appService.post(this.endpoint + `/end`, {id}, null);
	};
}

export default SubscriptionService;
