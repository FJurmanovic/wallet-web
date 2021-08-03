import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { hasEndCheck, walletData, errorMessage } = props;
	const renderInput = (type, name, label, rules, hide?, customAction?) => {
		if (hide) {
			return null;
		}
		return html`<input-field
			data-type="${type}"
			data-name="${name}"
			data-label="${label}"
			data-targets="subscription-create.inputs"
			data-rules="${rules}"
			data-custom-action="${customAction || ''}"
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
			data-targets="transaction-create.inputs"
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
			data-targets="subscription-create.inputs"
			data-rules="${rules}"
			data-fetch="${fetch}"
		></app-dropdown>`;
	};
	return html`
				<div slot="inputs">
					${renderNumericInput('^d+(?:.d{1,2})?$', 'amount', 'Amount', 'required', false)}
					${renderInput('text', 'description', 'Description', 'required')}
					${renderInput('date', 'startDate', 'Start date', 'required')}
					${renderInput('checkbox', 'hasEnd', 'Existing End Date', '', false, 'change:subscription-create#onCheck')}
					${renderInput(
						'date',
						'endDate',
						'End date',
						'required|is_after[field(startDate)]',
						!(hasEndCheck?.inp as HTMLInputElement)?.checked
					)}
					${renderDropdown('subscription-create#getWallets', 'wallet', 'Wallet', 'required', walletData && walletData.walletId)}
					${renderDropdown('subscription-create#getTypes', 'transactionType', 'Transaction Type', 'required')}
					${renderInput('number', 'customRange', 'Every', 'required')}
					${renderDropdown('subscription-create#getSubs', 'subscriptionType', 'Subscription Type', 'required')}
					${errorMessage ? html`<div>${errorMessage}</div>` : nothing}</template
				>`;
};
