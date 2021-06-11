import { targets, controller } from '@github/catalyst';
import { html, TemplateResult } from 'lit-html';
import { AuthService } from 'services/';
import { InputFieldElement } from 'components/';
import { BasePageElement } from 'common/';

@controller
class RegisterPageElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement>;
	authService: AuthService;
	constructor() {
		super({
			title: 'Register',
		});
	}
	elementConnected = (): void => {
		this.authService = new AuthService(this.appMain.appService);
		this.update();
	};

	get values(): Object {
		const formObject = {};
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
			const response = await this.appMain.authStore.userRegister(this.values);

			if (response?.id) {
				this.appMain.routerService.goTo('/login');
			}
		} catch (err) {}
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
			<app-form data-custom="register-page#onSubmit" data-has-cancel="true">
				<input-field
					data-type="text"
					data-name="username"
					data-label="Username"
					data-targets="register-page.inputs"
					data-rules="required"
				></input-field>
				<input-field
					data-type="email"
					data-name="email"
					data-label="E-mail"
					data-targets="register-page.inputs"
					data-rules="required|isEmail"
				></input-field>
				<input-field
					data-type="password"
					data-name="password"
					data-label="Password"
					data-targets="register-page.inputs"
					data-rules="required"
				>
				</input-field>
			</app-form>
		`;
	};
}

export type { RegisterPageElement };
