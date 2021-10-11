import { TemplateResult, attr, controller } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { findMethod } from 'core/utils';
import { WalletHeaderElementTemplate } from 'components/wallet-header';

@controller('wallet-header')
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

	render = (): TemplateResult =>
		WalletHeaderElementTemplate({
			currentBalance: this.currentBalance,
			currency: this.currency,
			lastMonth: this.lastMonth,
			nextMonth: this.nextMonth,
			loader: this.loader,
			initial: this.initial,
		});
}

export type { WalletHeaderElement };
