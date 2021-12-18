/** @jsx createElement */
/** @jsx.Frag Fragment */

import { TemplateResult, createElement } from 'core/utils';

export default (props): TemplateResult => {
	return (
		<div>
			<div class="wallet-buttons">
				<button class="btn btn-squared btn-primary" app-action="click:history-page#transactionCheck">
					Check Transactions
				</button>
			</div>
			<app-pagination data-target="history-page.pagination"></app-pagination>
		</div>
	);
};
