import { targets, controller } from '@github/catalyst';
import { html, TemplateResult } from 'lit-html';
import { AuthService, TransactionsService, WalletService } from 'services/';
import { InputFieldElement } from 'components/';
import { RouterService } from 'core/services';
import { BasePageElement } from 'common/';
import { AppDropdownElement } from 'components/app-dropdown/AppDropdownElement';

@controller
class TransactionCreateElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement | AppDropdownElement>;
	private transactionService: TransactionsService;
	private walletService: WalletService;
	authService: AuthService;
	errorMessage: string;
	constructor() {
		super({
			title: 'New Transaction',
		});
	}
	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.transactionService = new TransactionsService(this.appMain?.appService);
		this.authService = new AuthService(this.appMain.appService);
		this.update();
	};

	get nameInput(): InputFieldElement | AppDropdownElement {
		for (const i in this.inputs) {
			if (this.inputs[i]?.name == 'name') {
				return this.inputs[i];
			}
		}
	}

	get values(): any {
		const formObject: any = {};
		this.inputs.forEach((input: InputFieldElement) => {
			const inputType = input.inp;
			formObject[input.name] = (inputType as HTMLInputElement).value;
		});
		return formObject;
	}

	getWallets = async (options): Promise<void> => {
		try {
			const response = await this.walletService.getAll(options);
			return response;
		} catch (err) {}
	};

	onSubmit = async (values): Promise<void> => {
		try {
			if (!this.validate()) {
				return;
			}

			const { description: description, wallet: walletId, amount } = values;

			const response = await this.transactionService.post({
				description,
				walletId,
				amount,
			});

			if (response?.id) {
				this.appMain.triggerWalletUpdate();
				this.routerService.goTo('/history', {
					walletId: response.id,
				});
			}
		} catch (err) {
			this.errorMessage = 'Unable to create transaction!';
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
			<app-form data-custom="transaction-create#onSubmit" data-has-cancel="true">
				<input-field
					data-type="number"
					data-name="amount"
					data-label="Amount"
					data-targets="transaction-create.inputs"
					data-rules="required"
				></input-field>
				<input-field
					data-type="text"
					data-name="description"
					data-label="Description"
					data-targets="transaction-create.inputs"
					data-rules="required"
				></input-field>
				<app-dropdown
					data-name="wallet"
					data-label="Wallet"
					data-targets="transaction-create.inputs"
					data-rules="required"
					data-fetch="transaction-create#getWallets"
				>
				</app-dropdown>
				${this.errorMessage ? html`<div>${this.errorMessage}</div>` : html``}
			</app-form>
		`;
	};
}

export type { TransactionCreateElement };
