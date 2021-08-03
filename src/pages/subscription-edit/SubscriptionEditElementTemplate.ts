import { html, TemplateResult } from 'core/utils';

export default (): TemplateResult => html`
	<app-form
		data-custom="subscription-edit#onSubmit"
		data-has-cancel="true"
		data-target="subscription-edit.appForm"
		data-render-input="subscription-edit#renderForms"
	>
	</app-form>
`;
