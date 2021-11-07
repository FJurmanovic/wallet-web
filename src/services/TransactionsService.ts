import { AppService, BaseService } from 'core/services';

class TransactionsService extends BaseService {
	constructor(appService: AppService) {
		super('/transaction', appService);
	}

	check = (params?: Object, headers?: HeadersInit) => {
		return this.appService.get(this.endpoint + '/check', params, headers);
	};
}

export default TransactionsService;
