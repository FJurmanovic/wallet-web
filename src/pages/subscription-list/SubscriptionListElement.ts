import { controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { SubscriptionService } from 'services/';
import { AppMainElement, AppPaginationElement } from 'components/';
import { BasePageElement } from 'common/';

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

	getSubscriptions = async (options): Promise<any> => {
		try {
			if (this?.routerService?.routerState?.data) {
				const { walletId } = this?.routerService?.routerState?.data;
				if (walletId) {
					options['walletId'] = walletId;
				}
			}
			options.embed = 'TransactionType';
			options.sortBy = 'dateCreated|desc';
			const response = await this.subscriptionService.getAll(options);
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
			<app-pagination data-target="subscription-list.pagination"></app-pagination>
		</div>`;
	};
}

export type { SubscriptionListElement };
