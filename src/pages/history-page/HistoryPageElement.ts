import { TemplateResult, controller, target } from 'core/utils';
import { TransactionsService } from 'services/';
import { AppMainElement, AppPaginationElement } from 'components/';
import { BasePageElement } from 'common/';
import { HistoryPageElementTemplate } from 'pages/history-page';

@controller('history-page')
class HistoryPageElement extends BasePageElement {
	private transactionsService: TransactionsService;
	@target pagination: AppPaginationElement;
	constructor() {
		super({
			title: 'Transaction History',
		});
	}

	elementConnected = (): void => {
		this.transactionsService = new TransactionsService(this.appMain?.appService);
		this.update();
		this.pagination?.setFetchFunc?.(this.getTransactions, true)!;
		this.appMain.addEventListener('tokenchange', this.update);
		this.appMain.addEventListener('transactionupdate', this.transactionUpdated);
	};

	elementDisconnected = (appMain: AppMainElement): void => {
		appMain?.removeEventListener('tokenchange', this.update);
		appMain?.removeEventListener('transactionupdate', this.transactionUpdated);
	};

	transactionUpdated = () => {
		this.pagination?.executeFetch();
	};

	getTransactions = async (options): Promise<any> => {
		try {
			if (this?.routerService?.routerState?.data) {
				const { walletId } = this?.routerService?.routerState?.data;
				if (walletId) {
					options['walletId'] = walletId;
				}
			}
			options.embed = 'TransactionType';
			options.sortBy = 'transactionDate|desc';
			options.noPending = true;
			const response = await this.transactionsService.getAll(options);
			return response;
		} catch (err) {
			throw err;
		}
	};

	transactionCheck = () => {
		this.appMain.createModal('transaction-check', {
			autoInit: true,
		});
	};

	render = (): TemplateResult =>
		HistoryPageElementTemplate({ walletId: this.routerService?.routerState?.data?.walletId });
}

export type { HistoryPageElement };
