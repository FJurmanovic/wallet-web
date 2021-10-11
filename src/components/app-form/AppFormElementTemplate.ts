import { html, isTrue, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { renderInput, customRender, error, isValid, hasCancel } = props;
	const renderSubmit = (valid: boolean) => {
		if (!valid) {
			return html`
				<button class="btn btn-squared btn-primary --submit disabled" type="submit" disabled>Submit</button>
			`;
		}
		return html` <button class="btn btn-squared btn-primary --submit" type="submit">Submit</button> `;
	};
	const renderError = (error: string) => {
		if (error) {
			return html`<span>${error}</span>`;
		}
		return html``;
	};
	const renderCancel = (hasCancel: boolean) => {
		if (hasCancel) {
			return html`<button class="btn btn-squared btn-red --cancel" type="button" app-action="click:app-form#goBack">
				Cancel
			</button>`;
		}
		return html``;
	};

	return html`
		<div class="app-form">
			<form
				app-action="submit:app-form#onSubmit"
				data-target="app-form.formElement"
				autocomplete="on"
				method="POST"
				action="javascript:void(0)"
			>
				${renderInput ? customRender() : html`<slot data-target="app-form.innerSlot"></slot>`} ${renderError(error)}
				<div class="form-buttons">
					<div class="button-content">${renderSubmit(isValid)}${renderCancel(isTrue(hasCancel))}</div>
				</div>
			</form>
		</div>
	`;
};
