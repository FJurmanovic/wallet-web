import { TemplateResult, targets, controller, target } from 'core/utils';
import { AuthService, WalletService } from 'services/';
import { AppFormElement, InputFieldElement } from 'components/';
import { BasePageElement } from 'common/';
import { WalletEditElementTemplate } from 'pages/wallet-edit';

@controller('wallet-edit')
class WalletEditElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement>;
	@target appForm: AppFormElement;
	private walletService: WalletService;
	authService: AuthService;
	errorMessage: string;
	walletData: any;
	constructor() {
		super({
			title: 'Edit Wallet',
		});
	}
	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.authService = new AuthService(this.appMain.appService);
		this.walletData = this.getData();
		this.update();
		this.getWallet(this.walletData?.id);
	};

	getWallet = async (id) => {
		try {
			const response = await this.walletService.get(id, null);
			this.appForm.set(response);
		} catch (err) {}
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
			const response = await this.walletService.put(this.walletData?.id, this.values);

			if (response?.id) {
				this.appMain.triggerWalletUpdate();
				this.appMain.pushToast('success', 'Wallet edited successfully!');
				this.appMain.closeModal();
			}
		} catch (err) {
			this.errorMessage = 'Unable to edit wallet!';
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

	render = (): TemplateResult => WalletEditElementTemplate({ errorMessage: this.errorMessage });
}

export type { WalletEditElement };
