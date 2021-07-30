import { controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { SubscriptionService } from 'services/';
import { AppMainElement, AppPaginationElement } from 'components/';
import { BasePageElement } from 'common/';
import dayjs from 'dayjs';

@controller
class SubscriptionListElement extends BasePageElement {
	private subscriptionService: SubscriptionService;
	@target pagination: AppPaginationElement;
	constructor() {
		super({
			title: 'Subscription History',
		});
	}

	elementConnected = (): void => {
		this.subscriptionService = new SubscriptionService(this.appMain?.appService);
		this.update();
		this.pagination?.setFetchFunc?.(this.getSubscriptions, true)!;
		this.pagination?.setCustomRenderItem?.(this.renderSubscription)!;
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

	subscriptionEdit = (id) => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('subscription-edit', {
				id: id
			});
		}
	}

	subscriptionEnd = (id) => {
		if (confirm('Are you sure you want to end this subscription?')) {
			this.subscriptionService.endSubscription(id);
		}
	}

	renderSubscription = (item) => html`<tr class="col-subscription">
		<td class="--left">${dayjs(item.lastTransactionDate).format("MMM DD 'YY")}</td>
		<td class="--left">every ${item.customRange} ${item.rangeName}</td>
		<td class="--left">${item.description}</td>
		<td class="--left">${dayjs(item.nextTransaction).format("MMM DD 'YY")}</td>
		<td class="balance-cell --right">
			<span
				class="balance ${item.amount > 0 && item?.transactionType?.type != 'expense' ? '--positive' : '--negative'}"
			>
				${item?.transactionType?.type == 'expense' ? '- ' : ''}
				${Number(item.amount).toLocaleString('en-US', {
					maximumFractionDigits: 2,
					minimumFractionDigits: 2,
				})}
			</span>
			<span class="currency">(${item.currency ? item.currency : 'USD'})</span>
		</td>
		<td class="--left">
			<span><button @click=${() => this.subscriptionEdit(item.id)}}>Edit</button></span>
			<span><button @click=${() => this.subscriptionEnd(item.id)}}>End</button></span>
		</td>
	</tr>`;

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

	render = (): TemplateResult => {
		const renderWallet = () => {
			if (this.routerService?.routerState?.data?.walletId) {
				return html`<span>${this.routerService?.routerState?.data?.walletId}</span>`;
			}
			return html``;
		};
		return html`<div>
			${renderWallet()}
			<app-pagination
				data-target="subscription-list.pagination"
				data-table-layout="subscription-table"
			></app-pagination>
		</div>`;
	};
}

export type { SubscriptionListElement };
