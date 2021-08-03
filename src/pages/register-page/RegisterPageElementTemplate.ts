import { html, TemplateResult } from 'core/utils';

export default (): TemplateResult => {
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
