import { AppService, BaseService } from 'core/services';

class TransactionStatusService extends BaseService {
	constructor(appService: AppService) {
		super('/transaction-status', appService);
	}
}

export default TransactionStatusService;
