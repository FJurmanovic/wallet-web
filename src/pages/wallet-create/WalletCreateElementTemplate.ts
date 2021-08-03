import { html, TemplateResult } from 'core/utils';

export default ({ errorMessage }): TemplateResult => html`
	<app-form data-custom="wallet-create#onSubmit" data-has-cancel="true">
		<input-field
			data-type="text"
			data-name="name"
			data-label="Name"
			data-targets="wallet-create.inputs"
			data-rules="required"
		></input-field>
		${errorMessage ? html`<div>${errorMessage}</div>` : html``}
	</app-form>
`;
