/** @jsx createElement */
/** @jsx.Frag Fragment */

import { TemplateResult, createElement, Fragment } from 'core/utils';

export default (): TemplateResult => (
	<Fragment>
		<input-field
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
		></input-field>
		<input-field
			data-type="checkbox"
			data-name="rememberMe"
			data-label="Remember me"
			data-targets="login-page.inputs"
			data-rules=""
		></input-field>
	</Fragment>
);
