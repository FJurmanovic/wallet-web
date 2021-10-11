import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { randId, required, pattern, _disabled, customAction, type, error, label } = props;
	const renderMessage = (label: string) => {
		if (label) {
			return html`<label for="${randId}">${label}${required ? ' (*)' : ''}</label>`;
		}
		return nothing;
	};

	const renderError = (error: string) => {
		if (error) {
			return html`<div class="input-error"><span>${error}</span></div>`;
		}
		return nothing;
	};

	const renderInput = (type) => {
		if (pattern) {
			return html` <input
				name="${name}"
				autocomplete="${name}"
				type="${type}"
				pattern="${pattern}"
				step="0.01"
				data-target="input-field.inp"
				id="${randId}"
				?disabled=${_disabled}
				app-action=" input:input-field#inputChange blur:input-field#validateDisplay
				${customAction ? customAction : ''} "
			/>`;
		}
		return html` <input
			name="${name}"
			autocomplete="${name}"
			type="${type}"
			data-target="input-field.inp"
			?disabled=${_disabled}
			id="${randId}"
			app-action="
                    input:input-field#inputChange
                    blur:input-field#validateDisplay
					${customAction ? customAction : ''}
                "
		/>`;
	};

	return html`<div
		class="input-main${type === 'checkbox' ? ' input-main--checkbox' : ''}"
		data-target="input-field.main"
	>
		${renderMessage(label)}${renderError(error)} ${renderInput(type)}
	</div>`;
};
