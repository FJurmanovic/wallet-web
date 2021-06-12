import { controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { AppMainElement } from 'components/app-main/AppMainElement';
import { MenuItemElement } from 'components/menu-item/MenuItemElement';
import { WalletService } from 'services/';

@controller
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

	render = (): TemplateResult => {
		const { isAuth, totalWallets, walletData } = this;

		const regularMenu = (path: string, title: string, action?: string): TemplateResult => {
			if (action) {
				return html` <menu-item data-path="${path}" data-customaction="${action}">${title}</menu-item> `;
			}
			return html`<menu-item data-path="${path}">${title}</menu-item>`;
		};
		const authMenu = (path: string, title: string, action?: string): TemplateResult => {
			if (isAuth) {
				return regularMenu(path, title, action);
			}
			return html``;
		};
		const notAuthMenu = (path: string, title: string, action?: string): TemplateResult => {
			if (!isAuth) {
				return regularMenu(path, title, action);
			}
			return html``;
		};
		const renderWallets = (wallets: Array<any>) => {
			if (isAuth && totalWallets > 0) {
				return html`<div class="menu-item divider"></div>
					${wallets.map((wallet) => regularMenu(`/wallet/${wallet.id}`, wallet.name))}`;
			}
			return html``;
		};
		const menuHeader = (title) => html`<div class="menu-item menu-header">${title}</div>`;

		return html`
			<div data-target="app-menu.sidebar">
				${menuHeader(__CONFIG__.appName)} ${regularMenu('/', 'Home')}
				${authMenu('/history', 'Transaction History', 'click:app-menu#modalTransaction')}
				${authMenu('/wallet/all', 'My Wallets', 'click:app-menu#modalWallet')} ${renderWallets(walletData)}
				<span class="menu-item divider"></span>
				${authMenu('/logout', 'Logout')} ${notAuthMenu('/login', 'Login')} ${notAuthMenu('/register', 'Register')}
			</div>
		`;
	};
}

export type { AppMenuElement };
