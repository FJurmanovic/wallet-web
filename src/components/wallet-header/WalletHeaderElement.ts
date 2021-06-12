import { attr, controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { CircleLoaderElement } from 'components/circle-loader/CircleLoaderElement';
import { findMethod } from 'core/utils';

@controller
class WalletHeaderElement extends BaseComponentElement {
	@attr currentBalance: number;
	@attr lastMonth: number;
	@attr nextMonth: number;
	@attr currency: string;
	@attr custom: string;
	initial: boolean = false;

	fetchFunc: Function = () => {};
	constructor() {
		super();
	}

	elementConnected = (): void => {
		this.executeFetch();
		this.update();
	};

	attributeChangedCallback(): void {
		this.update();
	}

	get submitFunc() {
		return findMethod(this.custom, this.appMain);
	}

	executeFetch = async (options?): Promise<void> => {
		try {
			this.loader?.start?.();
			await this.submitFunc(options);
			this.loader?.stop?.();
		} catch (err) {
			this.loader?.stop?.();
			console.error(err);
		} finally {
			this.initial = true;
		}
	};

	render = (): TemplateResult => {
		const { currentBalance, currency, lastMonth, nextMonth } = this;

		const renderItem = (header, balance, currency) => html`<div class="header-item">
			<div class="--header">${header}</div>
			<div class="--content">
				<span class="--balance ${balance > 0 ? '--positive' : '--negative'}"
					>${Number(balance).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span
				><span class="--currency">(${currency})</span>
			</div>
		</div>`;

		const renderHeader = () => {
			if (this.loader && this.loader.loading && !this.initial) {
				return html``;
			}
			return html`${renderItem('Last Month', lastMonth, currency)}${renderItem(
				'Current Balance',
				currentBalance,
				currency
			)}${renderItem('Next Month', nextMonth, currency)}`;
		};

		return html`<div class="wallet-header">${renderHeader()}</div>`;
	};
}

export type { WalletHeaderElement };
