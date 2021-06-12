import { AppService, BaseService } from 'core/services';

class TransactionsService extends BaseService {
	constructor(appService: AppService) {
		super('/transaction', appService);
	}
}

export default TransactionsService;
