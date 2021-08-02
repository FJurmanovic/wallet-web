import { targets, controller, target } from '@github/catalyst';
//import { html, TemplateResult } from "core/utils";
import { html, render, TemplateResult } from 'core/utils';
import { AuthService } from 'services/';
import { AppFormElement, InputFieldElement } from 'components/';
import { RouterService } from 'core/services';
import { BasePageElement } from 'common/';

@controller
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

	renderForms = () => {
		return html` <input-field
				data-type="email"
				data-name="email"
				data-label="E-mail"
				data-targets="login-page.inputs"
				data-rules="required|is_email"
			></input-field>
			<input-field
				data-type="password"
				data-name="password"
				data-label="Password"
				data-targets="login-page.inputs"
				data-rules="required"
			>
			</input-field>
			<input-field
				data-type="checkbox"
				data-name="rememberMe"
				data-label="Remember me"
				data-targets="login-page.inputs"
				data-rules=""
			>
			</input-field>`;
	};

	render = (): TemplateResult => {
		return html`
			<app-form
				data-custom="login-page#onSubmit"
				data-target="login-page.appForm"
				data-render-input="login-page#renderForms"
			>
			</app-form>
			<div>
				<app-link data-to="/register" data-title="Create new account"></app-link>
			</div>
		`;
	};
}

export type { LoginPageElement };
