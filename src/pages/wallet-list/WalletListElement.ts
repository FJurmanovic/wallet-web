import { targets, controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { AuthService, WalletService } from 'services/';
import { AppMainElement, AppPaginationElement, InputFieldElement } from 'components/';
import { BasePageElement } from 'common/';

@controller
class WalletListElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement>;
	private walletService: WalletService;
	@target pagination: AppPaginationElement;
	authService: AuthService;
	errorMessage: string;
	constructor() {
		super({
			title: 'Wallet List',
		});
	}
	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.authService = new AuthService(this.appMain.appService);
		this.update();
		this.pagination?.setCustomRenderItem(this.renderItem);
		this.pagination?.setFetchFunc?.(this.getWallets, true)!;
		this.appMain.addEventListener('walletupdate', this.updateToken);
	};

	elementDisconnected = (appMain: AppMainElement) => {
		appMain?.removeEventListener('walletupdate', this.updateToken);
	}

	get updateToken() {
		return this.pagination?.defaultFetch;
	} 

	getWallets = async (options): Promise<any> => {
		try {
			const response = await this.walletService.getAll(options);
			return response;
		} catch (err) {
			throw err;
		}
	};

	walletEdit = (id) => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('wallet-edit', {
				id: id
			});
		}
	}

	renderItem = (item): TemplateResult => html`<tr class="col-wallet">
		<td><app-link class="wallet-item" data-to="/wallet/${item.id}" data-title="${item.name}"></app-link></td>
		<td>
			<span><button @click=${() => this.walletEdit(item.id)}}>Edit</button></span>
		</td>
	</tr>`;

	render = (): TemplateResult => {
		return html` <app-pagination data-target="wallet-list.pagination"></app-pagination> `;
	};
}

export type { WalletListElement };
