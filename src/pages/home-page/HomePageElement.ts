import { TemplateResult, controller, target } from 'core/utils';
import { WalletService } from 'services/';
import { AppMainElement, WalletHeaderElement } from 'components/';
import { BasePageElement } from 'common/';
import { HomePageElementTemplate } from 'pages/home-page';

@controller('home-page')
class HomePageElement extends BasePageElement {
	@target walletHeader: WalletHeaderElement;
	private walletService: WalletService;
	constructor() {
		super({
			title: 'Home',
		});
	}

	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.update();
		this.appMain.addEventListener('tokenchange', this.update);
		this.getBalance();
	};

	elementDisconnected = (appMain: AppMainElement): void => {
		appMain?.removeEventListener('tokenchange', this.update);
	};

	getBalance = async (): Promise<void> => {
		try {
			const response = await this.walletService.getBalance();
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

	render = (): TemplateResult => HomePageElementTemplate();
}

export { HomePageElement };
