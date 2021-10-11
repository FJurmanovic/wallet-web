import { html, TemplateResult, controller, target } from 'core/utils';
import { SubscriptionService, TransactionsService, WalletService } from 'services/';
import { AppMainElement, AppPaginationElement, WalletHeaderElement } from 'components/';
import { BasePageElement } from 'common/';
import dayjs from 'dayjs';
import { WalletPageElementTemplate } from 'pages/wallet-page';

@controller('wallet-page')
class WalletPageElement extends BasePageElement {
	private transactionsService: TransactionsService;
	private subscriptionService: SubscriptionService;
	private walletService: WalletService;
	@target pagination: AppPaginationElement;
	@target paginationSub: AppPaginationElement;
	@target walletHeader: WalletHeaderElement;
	walletId: string;
	walletTitle: string;
	constructor() {
		super({
			title: 'Wallet',
		});
	}

	get pageTitle() {
		if (this.walletTitle) {
			return `Wallet - ${this.walletTitle}`;
		}
		return 'Wallet';
	}

	elementConnected = async (): Promise<void> => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.transactionsService = new TransactionsService(this.appMain?.appService);
		this.subscriptionService = new SubscriptionService(this.appMain?.appService);
		if (this?.routerService?.routerState?.data) {
			const { walletId } = this?.routerService?.routerState?.data;
			if (walletId) {
				this.walletId = walletId;
			}
		}
		await this.getWallet();
		this.update();
		this.pagination?.setFetchFunc?.(this.getTransactions, true)!;
		this.paginationSub?.setFetchFunc?.(this.getSubscriptions, true)!;
		this.paginationSub?.setCustomRenderItem?.(this.renderSubscription)!;
		this.appMain.addEventListener('walletupdate', this.getWallet);
		this.appMain.addEventListener('tokenchange', this.update);
		this.appMain.addEventListener('transactionupdate', this.transactionUpdated);
	};

	elementDisconnected = (appMain: AppMainElement): void => {
		appMain?.removeEventListener('walletupdate', this.getWallet);
		appMain?.removeEventListener('tokenchange', this.update);
		appMain?.removeEventListener('transactionupdate', this.transactionUpdated);
	};

	transactionUpdated = () => {
		this.walletHeader?.executeFetch();
		this.pagination?.executeFetch();
		this.paginationSub?.executeFetch();
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

	getWallet = async () => {
		try {
			const id = this.walletId;
			const response = await this.walletService.get(id, null);
			this.walletTitle = response.name;
		} catch (err) {
			throw err;
		}
		this.update();
	};

	subscriptionEdit = (id) => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('subscription-edit', {
				id: id,
			});
		}
	};

	subscriptionEnd = async (id) => {
		if (confirm('Are you sure you want to end this subscription?')) {
			await this.subscriptionService.endSubscription(id);
			this.appMain.triggerTransactionUpdate();
		}
	};

	renderSubscription = (item) =>
		WalletPageSubscriptionTemplate({
			item,
			subscriptionEnd: this.subscriptionEnd,
			subscriptionEdit: this.subscriptionEdit,
		});

	getSubscriptions = async (options): Promise<any> => {
		try {
			if (this?.routerService?.routerState?.data) {
				const { walletId } = this?.routerService?.routerState?.data;
				if (walletId) {
					options['walletId'] = walletId;
				}
			}
			options.embed = 'TransactionType,SubscriptionType';
			options.sortBy = 'dateCreated|desc';
			const response = await this.subscriptionService.getAll(options);
			response?.items?.map?.((i) => {
				switch (i.subscriptionType.type) {
					case 'monthly':
						i.rangeName = i.customRange != 1 ? 'Months' : 'Month';
						i.nextTransaction = dayjs(i.lastTransactionDate).add(i.customRange, 'month');
						break;
					case 'yearly':
						i.rangeName = i.customRange != 1 ? 'Years' : 'Year';
						i.nextTransaction = dayjs(i.lastTransactionDate).add(i.customRange, 'year');
						break;
					case 'daily':
						i.rangeName = i.customRange != 1 ? 'Days' : 'Day';
						i.nextTransaction = dayjs(i.lastTransactionDate).add(i.customRange, 'day');
						break;
					case 'weekly':
						i.rangeName = i.customRange != 1 ? 'Weeks' : 'Week';
						i.nextTransaction = dayjs(i.lastTransactionDate).add(7 * i.customRange, 'day');
						break;
				}
			});
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

	newSub = (s): void => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('subscription-create', {
				walletId: this.routerService?.routerState?.data?.walletId,
			});
		}
	};

	walletEdit = () => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('wallet-edit', {
				id: this.routerService?.routerState?.data?.walletId,
			});
		}
	};

	render = (): TemplateResult =>
		WalletPageElementTemplate({ walletId: this.routerService?.routerState?.data?.walletId });
}

const WalletPageSubscriptionTemplate = ({ item, subscriptionEdit, subscriptionEnd }): TemplateResult => html`<tr
	class="col-subscription"
>
	<td class="--left">${dayjs(item.lastTransactionDate).format("MMM DD 'YY")}</td>
	<td class="--left">every ${item.customRange} ${item.rangeName}</td>
	<td class="--left">${item.description}</td>
	<td class="--left">${dayjs(item.nextTransaction).format("MMM DD 'YY")}</td>
	<td class="balance-cell --right">
		<span class="balance ${item.amount > 0 && item?.transactionType?.type != 'expense' ? '--positive' : '--negative'}">
			${item?.transactionType?.type == 'expense' ? '- ' : ''}
			${Number(item.amount).toLocaleString('en-US', {
				maximumFractionDigits: 2,
				minimumFractionDigits: 2,
			})}
		</span>
		<span class="currency">(${item.currency ? item.currency : 'USD'})</span>
	</td>
	${item.hasEnd
		? html``
		: html` <td class="--right">
				<span><button class="btn btn-rounded btn-gray" @click="${() => subscriptionEdit(item.id)}}">Edit</button></span>
				<span><button class="btn btn-rounded btn-alert" @click="${() => subscriptionEnd(item.id)}}">End</button></span>
		  </td>`}
</tr>`;

export type { WalletPageElement };
