import { AppService, BaseService } from 'core/services';

class SubscriptionService extends BaseService {
	constructor(public appService: AppService) {
		super('/subscription', appService);
	}

	endSubscription = (id) => {
		return this.appService.put(this.endpoint + `/end/${id}`, null, null);
	};
}

export default SubscriptionService;
