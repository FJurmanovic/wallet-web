import { html, TemplateResult } from 'core/utils';

export default ({ errorMessage }): TemplateResult => html`
	<app-form data-custom="wallet-edit#onSubmit" data-has-cancel="true" data-target="wallet-edit.appForm">
		<input-field
			data-type="text"
			data-name="name"
			data-label="Name"
			data-targets="wallet-edit.inputs"
			data-rules="required"
		></input-field>
		${errorMessage ? html`<div>${errorMessage}</div>` : html``}
	</app-form>
`;
