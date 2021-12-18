/** @jsx createElement */
/** @jsx.Frag Fragment */

import { html, isTrue, nothing, TemplateResult, createElement, Fragment } from 'core/utils';

const renderSubmit = (valid: boolean) => {
	if (!valid) {
		return (
			<button class="btn btn-squared btn-primary --submit disabled" type="submit" disabled>
				Submit
			</button>
		);
	}
	return (
		<button class="btn btn-squared btn-primary --submit" type="submit">
			Submit
		</button>
	);
};
const renderError = (error: string) => {
	if (error) {
		return <span>${error}</span>;
	}
	return null;
};
const renderCancel = (hasCancel: boolean) => {
	if (hasCancel) {
		return (
			<button class="btn btn-squared btn-red --cancel" type="button" app-action="click:app-form#goBack">
				Cancel
			</button>
		);
	}
	return null;
};

export default (props): TemplateResult => {
	const { renderInput, customRender, error, isValid, hasCancel } = props;

	return (
		<div class="app-form">
			<form
				app-action="submit:app-form#onSubmit"
				data-target="app-form.formElement"
				autocomplete="on"
				method="POST"
				action="javascript:void(0)"
			>
				{renderInput ? (
					customRender()
				) : (
					<Fragment>
						<slot data-target="app-form.innerSlot"></slot> {renderError(error)}
					</Fragment>
				)}
				<div class="form-buttons">
					<div class="button-content">
						{renderSubmit(isValid)}
						{renderCancel(isTrue(hasCancel))}
					</div>
				</div>
			</form>
		</div>
	);
};
