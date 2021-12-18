/** @jsx createElement */
/** @jsx.Frag Fragment */

import { TemplateResult, createElement, Fragment } from 'core/utils';

const Form = (
	<app-form
		data-custom="login-page#onSubmit"
		data-target="login-page.appForm"
		data-render-input="login-page#renderForms"
	></app-form>
);

const RegisterLink = (
	<div>
		<app-link data-to="/register" data-title="Create new account"></app-link>
	</div>
);

export default (): TemplateResult => {
	return (
		<Fragment>
			<Form />
			<RegisterLink />
		</Fragment>
	);
};
