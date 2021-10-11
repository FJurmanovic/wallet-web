import { html, TemplateResult, controller, target } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { AppMainElement } from 'components/app-main/AppMainElement';
import { MenuItemElement } from 'components/menu-item/MenuItemElement';
import { WalletService } from 'services/';
import AppMenuElementTemplate from './AppMenuElementTemplate';

@controller('app-menu')
class AppMenuElement extends BaseComponentElement {
	private walletService: WalletService;
	private walletData: Array<any>;
	private totalWallets: number;
	@target walletlist: MenuItemElement;
	constructor() {
		super();
	}

	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		if (this.appMain.isAuth) {
			this.getWallets();
		}
		this.update();
		this.appMain.addEventListener('tokenchange', this.updateToken);
		this.appMain.addEventListener('walletupdate', this.updateToken);
	};

	elementDisconnected = (appMain: AppMainElement): void => {
		appMain?.removeEventListener('tokenchange', this.updateToken);
		appMain?.removeEventListener('walletupdate', this.updateToken);
	};

	getWallets = async (): Promise<void> => {
		try {
			const response = await this.walletService.getAll({ rpp: 3 });
			this.setWallets(response.items, response.totalRecords);
		} catch (err) {
			this.update();
		}
	};

	setWallets = (wallets: Array<any>, totalWallets: number): void => {
		this.walletData = wallets;
		this.totalWallets = totalWallets;
		this.update();
	};

	updateToken = (): void => {
		if (this.isAuth) {
			this.getWallets();
		} else {
			this.update();
		}
	};

	get isAuth(): boolean {
		if (this.appMain?.isAuth) {
			return true;
		}
		return false;
	}

	renderWallets = (): Array<TemplateResult> => {
		if (this.isAuth && this.totalWallets > 0) {
			return this.walletData.map(
				(wallet) => html`<menu-item data-path="/wallet/${wallet.id}">${wallet.name}</menu-item>`
			);
		}
		return null;
	};

	modalWallet = (): void => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('wallet-create');
		}
	};

	modalTransaction = (s): void => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('transaction-create');
		}
	};

	modalSubscription = (s): void => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('subscription-create');
		}
	};

	render = (): TemplateResult =>
		AppMenuElementTemplate({ isAuth: this.isAuth, totalWallets: this.totalWallets, walletData: this.walletData });
}

export type { AppMenuElement };
