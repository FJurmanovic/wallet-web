import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { errorMessage, walletData } = props;
	const renderInput = (type, name, label, rules, hide?, customAction?) => {
		if (hide) {
			return nothing;
		}
		return html`<input-field
			data-type="${type}"
			data-name="${name}"
			data-label="${label}"
			data-targets="transaction-create.inputs"
			data-rules="${rules}"
			custom-action="${customAction}"
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
			data-targets="transaction-create.inputs"
			data-rules="${rules}"
			data-fetch="${fetch}"
		></app-dropdown>`;
	};

	return html`
		<app-form data-custom="transaction-create#onSubmit" data-has-cancel="true" data-target="transaction-create.appForm">
			${renderNumericInput('^d+(?:.d{1,2})?$', 'amount', 'Amount', 'required', false)}
			${renderInput('text', 'description', 'Description', 'required')}
			${renderInput('date', 'transactionDate', 'Transaction date', 'required')}
			${renderDropdown(
				'transaction-create#getWallets',
				'wallet',
				'Wallet',
				'required',
				walletData && walletData.walletId
			)}
			${renderDropdown(
				'transaction-create#getTypes',
				'transactionType',
				'Transaction Type',
				'required',
				walletData && walletData.walletId
			)}
			${errorMessage ? html`<div>${errorMessage}</div>` : nothing}
		</app-form>
	`;
};
