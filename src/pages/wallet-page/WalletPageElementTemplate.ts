import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { walletId } = props;
	const renderHeader = () => html`<wallet-header
		data-target="wallet-page.walletHeader"
		data-current-balance="0"
		data-last-month="0"
		data-next-month="0"
		data-currency="0"
		data-custom="wallet-page#getBalance"
	></wallet-header>`;

	const renderWallet = () => {
		if (walletId) {
			return html`<div class="wallet-buttons">
				<button class="btn btn-squared btn-gray" app-action="click:wallet-page#walletEdit">Edit Wallet</button>
				<div class="button-group">
					<button class="btn btn-squared btn-primary" app-action="click:wallet-page#newSub">New Subscription</button>
					<button class="btn btn-squared btn-red" app-action="click:wallet-page#newExpense">New Expense</button>
					<button class="btn btn-squared btn-green" app-action="click:wallet-page#newGain">New Gain</button>
				</div>
			</div>`;
		}
		return nothing;
	};
	return html`<div>
		${renderHeader()} ${renderWallet()}
		<h2>Transactions</h2>
		<app-pagination data-target="wallet-page.pagination"></app-pagination>
		<h2>Subscriptions</h2>
		<app-pagination data-target="wallet-page.paginationSub" data-table-layout="subscription-table"></app-pagination>
	</div>`;
};
