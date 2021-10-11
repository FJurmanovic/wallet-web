import { html, TemplateResult, targets, controller, target } from 'core/utils';
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
import { SubscriptionEditElementTemplate, SubscriptionEditFormTemplate } from 'pages/subscription-edit';
dayjs.extend(utc);

@controller('subscription-edit')
class SubscriptionEditElement extends BasePageElement {
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
			title: 'Edit Subscription',
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
		this.getSubscription(this.walletData?.id);
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

	getSubscription = async (id) => {
		try {
			const response = await this.subscriptionService.get(id, {
				embed: 'Wallet',
			});
			const wallet = this.appForm.getInput('wallet');
			if (wallet) {
				(wallet as AppDropdownElement).setItemValue(response.wallet);
			}
			response.wallet = response.walletId;
			response.endDate = dayjs(response.endDate).format('YYYY-MM-DD');
			this.appForm.set(response);
		} catch (err) {}
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

			const { description: description, wallet: walletId, amount, endDate } = values;

			const endDateFormat = dayjs(endDate).utc(true).format();

			const walletData = this.walletData;

			const formData = {
				description,
				amount,
				hasEnd: (this.hasEndCheck?.inp as HTMLInputElement)?.checked,
				endDate: endDateFormat,
				walletId: walletData && walletData.walletId ? walletData.walletId : walletId,
			};
			const response = await this.subscriptionService.put(this.walletData.id, formData);

			if (response?.id) {
				this.appMain.triggerTransactionUpdate();
				this.appMain.pushToast('success', 'Subscription edited successfully!');

				if (walletData.id) {
					this.appMain?.closeModal();
				} else {
					this.appMain?.closeModal();
					this.routerService.goTo('/subscriptions', {
						walletId: response.walletId,
					});
				}
			}
		} catch (err) {
			this.errorMessage = 'Unable to edit subscription!';
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

	renderForms = () =>
		SubscriptionEditFormTemplate({
			hasEndCheck: this.hasEndCheck,
			walletData: this.walletData,
			errorMessage: this.errorMessage,
		});

	render = (): TemplateResult => SubscriptionEditElementTemplate();
}

export type { SubscriptionEditElement };
