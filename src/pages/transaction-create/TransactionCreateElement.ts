import { targets, controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { AuthService, TransactionsService, TransactionTypeService, WalletService } from 'services/';
import { AppFormElement, InputFieldElement } from 'components/';
import { RouterService } from 'core/services';
import { BasePageElement } from 'common/';
import { AppDropdownElement } from 'components/app-dropdown/AppDropdownElement';

@controller
class TransactionCreateElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement | AppDropdownElement>;
	@target appForm: AppFormElement;
	private transactionService: TransactionsService;
	private transactionTypeService: TransactionTypeService;
	private walletService: WalletService;
	walletData: any = null;
	authService: AuthService;
	errorMessage: string;
	private initial: boolean = false;
	constructor() {
		super({
			title: 'New Transaction',
		});
	}
	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.transactionService = new TransactionsService(this.appMain?.appService);
		this.transactionTypeService = new TransactionTypeService(this.appMain?.appService);
		this.authService = new AuthService(this.appMain.appService);
		this.walletData = this.getData();
		this.update();
		if (this.walletData && this.walletData.walletId) {
			this.setTransactionType();
		} else {
			this.initial = true;
		}
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

	setTransactionType = async () => {
		this.appForm.isValid = false;
		try {
			const response = await this.transactionTypeService.getAll();
			this.walletData.transactionTypeId = response?.find((type) => type.type == this.walletData.transactionType)?.id;
		} catch (err) {
		} finally {
			this.appForm.isValid = true;
		}
	};

	getWallets = async (options): Promise<void> => {
		try {
			const response = await this.walletService.getAll(options);
			return response;
		} catch (err) {}
	};

	getTypes = async (options): Promise<void> => {
		try {
			const response = await this.transactionTypeService.getAll(options);
			return response;
		} catch (err) {}
	};

	onSubmit = async (values): Promise<void> => {
		try {
			if (!this.validate()) {
				return;
			}

			const { description: description, wallet: walletId, amount, transactionType: transactionTypeId } = values;

			const walletData = this.walletData;

			const formData = {
				description,
				amount,
				walletId: walletData && walletData.walletId ? walletData.walletId : walletId,
				transactionTypeId:
					walletData && walletData.transactionTypeId ? walletData.transactionTypeId : transactionTypeId,
			};
			const response = await this.transactionService.post(formData);

			if (response?.id) {
				this.appMain.triggerTransactionUpdate();
				this.appMain.pushToast('success', 'Transaction created successfully!');

				if (walletData.walletId) {
					this.appMain?.closeModal();
				} else {
					this.routerService.goTo('/history', {
						walletId: response.walletId,
					});
				}
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
		const renderInput = (type, name, label, rules, hide?) => {
			if (hide) {
				return html``;
			}
			return html`<input-field
				data-type="${type}"
				data-name="${name}"
				data-label="${label}"
				data-targets="transaction-create.inputs"
				data-rules="${rules}"
			></input-field>`;
		};

		const renderDropdown = (fetch, name, label, rules, hide?) => {
			if (hide) {
				return html``;
			}
			return html`<app-dropdown
				data-name="${name}"
				data-label="${label}"
				data-targets="transaction-create.inputs"
				data-rules="${rules}"
				data-fetch="${fetch}"
			></app-dropdown>`;
		};

		return html`
			<div>Create wallet</div>
			<app-form
				data-custom="transaction-create#onSubmit"
				data-has-cancel="true"
				data-target="transaction-create.appForm"
			>
				${renderInput('number', 'amount', 'Amount', 'required')}
				${renderInput('text', 'description', 'Description', 'required')}
				${renderDropdown(
					'transaction-create#getWallets',
					'wallet',
					'Wallet',
					'required',
					this.walletData && this.walletData.walletId
				)}
				${renderDropdown(
					'transaction-create#getTypes',
					'transactionType',
					'Transaction Type',
					'required',
					this.walletData && this.walletData.walletId
				)}
				${this.errorMessage ? html`<div>${this.errorMessage}</div>` : html``}
			</app-form>
		`;
	};
}

export type { TransactionCreateElement };
