import { TemplateResult, targets, controller, target } from 'core/utils';
import { AuthService } from 'services/';
import { AppFormElement, InputFieldElement } from 'components/';
import { BasePageElement } from 'common/';
import LoginFormTemplate from './LoginFormTemplate';
import LoginPageElementTemplate from './LoginPageElementTemplate';

@controller('login-page')
class LoginPageElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement>;
	@target appForm: AppFormElement;
	authService: AuthService;
	constructor() {
		super({
			title: 'Login',
		});
	}
	elementConnected = (): void => {
		this.authService = new AuthService(this.appMain.appService);
		this.update();
	};

	get emailInput(): InputFieldElement {
		for (const i in this.inputs) {
			if (this.inputs[i]?.name == 'email') {
				return this.inputs[i];
			}
		}
	}

	get passwordInput(): InputFieldElement {
		for (const i in this.inputs) {
			if (this.inputs[i]?.name == 'password') {
				return this.inputs[i];
			}
		}
	}

	get values(): Object {
		const formObject: any = {};
		this.inputs.forEach((input: InputFieldElement) => {
			const inputType = input.inp;
			if (input.type === 'checkbox') {
				formObject[input.name] = (inputType as HTMLInputElement).checked;
			} else {
				formObject[input.name] = (inputType as HTMLInputElement).value;
			}
		});
		return formObject;
	}

	onSubmit = async (): Promise<void> => {
		try {
			if (!this.validate()) {
				return;
			}
			const response = await this.appMain.authStore.userLogin(this.values);

			if (response?.token) {
				this.routerService.goTo('/');
			}
		} catch (err) {
			if (err?.errorCode == 400103) {
				this.emailInput.setError(err?.message);
				this.emailInput.update();
			} else if (err?.errorCode == 400104) {
				this.passwordInput.setError(err?.message);
				this.passwordInput.update();
			} else {
				this.appForm?.setError('Unable to log in!');
			}
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

	renderForms = (): TemplateResult => LoginFormTemplate();

	render = (): TemplateResult => LoginPageElementTemplate();
}

export type { LoginPageElement };
