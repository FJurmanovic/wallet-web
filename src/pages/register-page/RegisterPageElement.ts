import { targets, controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { AuthService } from 'services/';
import { AppFormElement, InputFieldElement } from 'components/';
import { BasePageElement } from 'common/';

@controller
class RegisterPageElement extends BasePageElement {
	@targets inputs: Array<InputFieldElement>;
	@target appForm: AppFormElement;
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
		} catch (err) {
			if (err?.errorCode == 400103) {
				this.appForm?.getInput('email')?.setError(err?.message);
				this.appForm?.getInput('email')?.update();
			} else if (err?.errorCode == 400104) {
				this.appForm?.getInput('password')?.setError(err?.message);
				this.appForm?.getInput('password')?.update();
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

	render = (): TemplateResult => {
		return html`
			<app-form data-custom="register-page#onSubmit" data-has-cancel="true" data-target="register-page.appForm">
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
					data-rules="required|is_email"
				></input-field>
				<input-field
					data-type="password"
					data-name="password"
					data-label="Password"
					data-targets="register-page.inputs"
					data-rules="required"
				>
				</input-field>
				<input-field
					data-type="password"
					data-name="confirmpassword"
					data-label="Confirm Password"
					data-targets="register-page.inputs"
					data-rules="required|is_same[field(password)]"
				>
			</app-form>
		`;
	};
}

export type { RegisterPageElement };
