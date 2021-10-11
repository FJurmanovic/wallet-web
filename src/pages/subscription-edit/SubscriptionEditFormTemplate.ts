import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { hasEndCheck, walletData, errorMessage } = props;
	const renderInput = (type, name, label, rules, hide?, customAction?) => {
		return html`<input-field
			data-type="${type}"
			data-name="${name}"
			data-label="${label}"
			data-targets="subscription-edit.inputs"
			data-rules="${rules}"
			data-custom-action="${customAction || ''}"
			data-disabled="${hide}"
		></input-field>`;
	};

	const renderNumericInput = (pattern, name, label, rules, hide?, customAction?) => {
		if (hide) {
			return nothing;
		}
		return html`<input-field
			data-type="number"
			data-pattern="${pattern}"
			data-name="${name}"
			data-label="${label}"
			data-targets="subscription-edit.inputs"
			data-rules="${rules}"
			custom-action="${customAction}"
		></input-field>`;
	};

	const renderDropdown = (fetch, name, label, rules, hide?) => {
		if (hide) {
			return nothing;
		}
		return html`<app-dropdown
			data-name="${name}"
			data-label="${label}"
			data-targets="subscription-edit.inputs"
			data-rules="${rules}"
			data-fetch="${fetch}"
		></app-dropdown>`;
	};
	return html`
				<div slot="inputs">
					${renderNumericInput('^d+(?:.d{1,2})?$', 'amount', 'Amount', 'required', false)}
					${renderInput('text', 'description', 'Description', 'required')}
					${renderInput('checkbox', 'hasEnd', 'Existing End Date', '', false, 'change:subscription-edit#onCheck')}
					${renderInput('date', 'endDate', 'End date', 'required', !(hasEndCheck?.inp as HTMLInputElement)?.checked)}
					${renderDropdown('subscription-edit#getWallets', 'wallet', 'Wallet', 'required', walletData && walletData.walletId)}
					${errorMessage ? html`<div>${errorMessage}</div>` : nothing}</template
				>`;
};
