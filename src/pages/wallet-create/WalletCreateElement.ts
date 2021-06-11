import { targets, controller } from '@github/catalyst';
import { html, TemplateResult } from 'lit-html';
import { AuthService, WalletService } from 'services/';
import { InputFieldElement } from 'components/';
import { RouterService } from 'core/services';
import { BasePageElement } from 'common/';

@controller
class WalletCreateElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement>;
	private walletService: WalletService;
	authService: AuthService;
	errorMessage: string;
	constructor() {
		super({
			title: 'New Wallet',
		});
	}
	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.authService = new AuthService(this.appMain.appService);
		this.update();
	};

	get nameInput(): InputFieldElement {
		for (const i in this.inputs) {
			if (this.inputs[i]?.name == 'name') {
				return this.inputs[i];
			}
		}
	}

	get values(): Object {
		const formObject: any = {};
		this.inputs.forEach((input: InputFieldElement) => {
			const inputType = input.inp;
			formObject[input.name] = (inputType as HTMLInputElement).value;
		});
		return formObject;
	}

	onSubmit = async (): Promise<void> => {
		try {
			if (!this.validate()) {
				return;
			}
			const response = await this.walletService.post(this.values);

			if (response?.id) {
				this.appMain.triggerWalletUpdate();
				this.routerService.goTo('/wallet/:walletId', {
					walletId: response.id,
				});
			}
		} catch (err) {
			this.errorMessage = 'Unable to create wallet!';
			this.update();
		}
	};

	validate(): boolean {
		let _return = true;
		this.inputs.forEach((input: InputFieldElement) => {
			const valid: boolean = input.validate();
			if (!valid) _return = false;
		});
		return _return;
	}

	render = (): TemplateResult => {
		return html`
			<div>Create wallet</div>
			<app-form data-custom="wallet-create#onSubmit" data-has-cancel="true">
				<input-field
					data-type="text"
					data-name="name"
					data-label="Name"
					data-targets="wallet-create.inputs"
					data-rules="required"
				></input-field>
				${this.errorMessage ? html`<div>${this.errorMessage}</div>` : html``}
			</app-form>
		`;
	};
}

export type { WalletCreateElement };
