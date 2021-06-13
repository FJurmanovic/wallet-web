import { controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { TransactionsService, WalletService } from 'services/';
import { AppMainElement, AppPaginationElement, WalletHeaderElement } from 'components/';
import { BasePageElement } from 'common/';

@controller
class WalletPageElement extends BasePageElement {
	private transactionsService: TransactionsService;
	private walletService: WalletService;
	@target pagination: AppPaginationElement;
	@target walletHeader: WalletHeaderElement;
	walletId: string;
	constructor() {
		super({
			title: 'Wallet',
		});
	}

	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.transactionsService = new TransactionsService(this.appMain?.appService);
		if (this?.routerService?.routerState?.data) {
			const { walletId } = this?.routerService?.routerState?.data;
			if (walletId) {
				this.walletId = walletId;
			}
		}
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
		this.walletHeader?.executeFetch();
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
			const response = await this.transactionsService.getAll(options);
			return response;
		} catch (err) {
			throw err;
		}
	};

	getBalance = async (): Promise<void> => {
		try {
			const response = await this.walletService.getBalance({
				walletId: this.walletId,
			});
			this.setBalance(response);
		} catch (err) {
			throw err;
		}
	};

	setBalance = (header) => {
		if (!this.walletHeader) return;
		this.walletHeader.currency = header.currency;
		this.walletHeader.currentBalance = header.currentBalance || '0';
		this.walletHeader.lastMonth = header.lastMonth || '0';
		this.walletHeader.nextMonth = header.nextMonth || '0';
	};

	newExpense = (s): void => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('transaction-create', {
				walletId: this.routerService?.routerState?.data?.walletId,
				transactionType: 'expense',
			});
		}
	};

	newGain = (s): void => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('transaction-create', {
				walletId: this.routerService?.routerState?.data?.walletId,
				transactionType: 'gain',
			});
		}
	};

	render = (): TemplateResult => {
		const renderHeader = () => html`<wallet-header
			data-target="wallet-page.walletHeader"
			data-current-balance="0"
			data-last-month="0"
			data-next-month="0"
			data-currency="0"
			data-custom="wallet-page#getBalance"
		></wallet-header>`;

		const renderWallet = () => {
			if (this.routerService?.routerState?.data?.walletId) {
				return html`<div class="wallet-buttons">
					<button class="btn btn-squared btn-red" app-action="click:wallet-page#newExpense">New Expense</button>
					<button class="btn btn-squared btn-green" app-action="click:wallet-page#newGain">New Gain</button>
				</div>`;
			}
			return html``;
		};
		return html`<div>
			${renderHeader()} ${renderWallet()}
			<app-pagination data-target="wallet-page.pagination"></app-pagination>
		</div>`;
	};
}

export type { WalletPageElement };
