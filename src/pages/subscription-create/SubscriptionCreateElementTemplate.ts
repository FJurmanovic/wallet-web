import { html, TemplateResult } from 'core/utils';

export default (): TemplateResult => html`
	<app-form
		data-custom="subscription-create#onSubmit"
		data-has-cancel="true"
		data-target="subscription-create.appForm"
		data-render-input="subscription-create#renderForms"
	>
	</app-form>
`;
