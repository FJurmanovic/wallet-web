import { targets, controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import {
	AuthService,
	SubscriptionService,
	SubscriptionTypeService,
	TransactionTypeService,
	WalletService,
} from 'services/';
import { AppFormElement, InputFieldElement } from 'components/';
import { BasePageElement } from 'common/';
import { AppDropdownElement } from 'components/app-dropdown/AppDropdownElement';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@controller
class SubscriptionCreateElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement | AppDropdownElement>;
	@target appForm: AppFormElement;
	private subscriptionService: SubscriptionService;
	private transactionTypeService: TransactionTypeService;
	private subscriptionTypeService: SubscriptionTypeService;
	private walletService: WalletService;
	walletData: any = null;
	authService: AuthService;
	errorMessage: string;
	private initial: boolean = false;
	constructor() {
		super({
			title: 'New Subscription',
		});
	}
	elementConnected = (): void => {
		this.walletService = new WalletService(this.appMain?.appService);
		this.subscriptionService = new SubscriptionService(this.appMain?.appService);
		this.transactionTypeService = new TransactionTypeService(this.appMain?.appService);
		this.subscriptionTypeService = new SubscriptionTypeService(this.appMain?.appService);
		this.authService = new AuthService(this.appMain.appService);
		this.walletData = this.getData();
		this.update();
		if (this.walletData && this.walletData.walletId) {
			this.setTransactionType();
		} else {
			this.initial = true;
		}
	};

	get hasEndCheck(): InputFieldElement | AppDropdownElement {
		for (const i in this.inputs) {
			if (this.inputs[i]?.name == 'hasEnd') {
				return this.inputs[i];
			}
		}
	}

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

	getSubs = async (options): Promise<void> => {
		try {
			const response = await this.subscriptionTypeService.getAll(options);
			return response;
		} catch (err) {}
	};

	onSubmit = async (values): Promise<void> => {
		try {
			if (!this.validate()) {
				return;
			}

			const {
				description: description,
				wallet: walletId,
				amount,
				customRange,
				transactionType: transactionTypeId,
				subscriptionType: subscriptionTypeId,
				startDate,
				endDate,
			} = values;

			const startDateFormat = dayjs(startDate).utc(true).format();
			const endDateFormat = dayjs(endDate).utc(true).format();

			const walletData = this.walletData;

			const formData = {
				description,
				amount,
				customRange: customRange || 0,
				hasEnd: (this.hasEndCheck?.inp as HTMLInputElement)?.checked,
				startDate: startDateFormat,
				endDate: endDateFormat,
				walletId: walletData && walletData.walletId ? walletData.walletId : walletId,
				transactionTypeId:
					walletData && walletData.transactionTypeId ? walletData.transactionTypeId : transactionTypeId,
				subscriptionTypeId:
					walletData && walletData.subscriptionTypeId ? walletData.subscriptionTypeId : subscriptionTypeId,
			};
			const response = await this.subscriptionService.post(formData);

			if (response?.id) {
				this.appMain.triggerTransactionUpdate();
				this.appMain.pushToast('success', 'Subscription created successfully!');

				if (walletData.walletId) {
					this.appMain?.closeModal();
				} else {
					this.routerService.goTo('/subscriptions', {
						walletId: response.walletId,
					});
				}
			}
		} catch (err) {
			this.errorMessage = 'Unable to create subscription!';
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

	onCheck = () => {
		this.appForm.update();
		this.appForm.validate();
		this.appForm.update();
	};

	renderForms = () => {
		const renderInput = (type, name, label, rules, hide?, customAction?) => {
			if (hide) {
				return null;
			}
			return html`<input-field
				data-type="${type}"
				data-name="${name}"
				data-label="${label}"
				data-targets="subscription-create.inputs"
				data-rules="${rules}"
				data-custom-action="${customAction || ''}"
			></input-field>`;
		};

		const renderNumericInput = (pattern, name, label, rules, hide?, customAction?) => {
			if (hide) {
				return html``;
			}
			return html`<input-field
				data-type="number"
				data-pattern="${pattern}"
				data-name="${name}"
				data-label="${label}"
				data-targets="transaction-create.inputs"
				data-rules="${rules}"
				custom-action="${customAction}"
			></input-field>`;
		};

		const renderDropdown = (fetch, name, label, rules, hide?) => {
			if (hide) {
				return html``;
			}
			return html`<app-dropdown
				data-name="${name}"
				data-label="${label}"
				data-targets="subscription-create.inputs"
				data-rules="${rules}"
				data-fetch="${fetch}"
			></app-dropdown>`;
		};
		return html`
				<div slot="inputs">
					${renderNumericInput('^d+(?:.d{1,2})?$', 'amount', 'Amount', 'required', false)}
					${renderInput('text', 'description', 'Description', 'required')}
					${renderInput('date', 'startDate', 'Start date', 'required')}
					${renderInput('checkbox', 'hasEnd', 'Existing End Date', '', false, 'change:subscription-create#onCheck')}
					${renderInput(
						'date',
						'endDate',
						'End date',
						'required|is_after[field(startDate)]',
						!(this.hasEndCheck?.inp as HTMLInputElement)?.checked
					)}
					${renderDropdown(
						'subscription-create#getWallets',
						'wallet',
						'Wallet',
						'required',
						this.walletData && this.walletData.walletId
					)}
					${renderDropdown('subscription-create#getTypes', 'transactionType', 'Transaction Type', 'required')}
					${renderInput('number', 'customRange', 'Every', 'required')}
					${renderDropdown('subscription-create#getSubs', 'subscriptionType', 'Subscription Type', 'required')}
					${this.errorMessage ? html`<div>${this.errorMessage}</div>` : html``}</template
				>`;
	};

	render = (): TemplateResult => {
		return html`
			<app-form
				data-custom="subscription-create#onSubmit"
				data-has-cancel="true"
				data-target="subscription-create.appForm"
				data-render-input="subscription-create#renderForms"
			>
			</app-form>
		`;
	};
}

export type { SubscriptionCreateElement };
