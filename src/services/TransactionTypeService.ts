import { AppService, BaseService } from 'core/services';

class TransactionTypeService extends BaseService {
	constructor(appService: AppService) {
		super('/transaction-type', appService);
	}
}

export default TransactionTypeService;
