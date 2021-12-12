import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	return html`<div>
		<div class="wallet-buttons">
			<button class="btn btn-squared btn-primary" app-action="click:history-page#transactionCheck">
				Check Transactions
			</button>
		</div>
		<app-pagination data-target="history-page.pagination"></app-pagination>
	</div>`;
};
