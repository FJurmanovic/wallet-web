import { controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { TransactionsService } from 'services/';
import { AppMainElement, AppPaginationElement } from 'components/';
import { BasePageElement } from 'common/';

@controller
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
			const response = await this.transactionsService.getAll(options);
			return response;
		} catch (err) {
			throw err;
		}
	};

	render = (): TemplateResult => {
		const renderWallet = () => {
			if (this.routerService?.routerState?.data?.walletId) {
				return html`<span>${this.routerService?.routerState?.data?.walletId}</span>`;
			}
			return html``;
		};
		return html`<div>
			${renderWallet()}
			<app-pagination data-target="history-page.pagination"></app-pagination>
		</div>`;
	};
}

export type { HistoryPageElement };
