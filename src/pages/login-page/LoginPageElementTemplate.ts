import { html, TemplateResult } from 'core/utils';

export default (): TemplateResult => html`
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
