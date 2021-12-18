import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { currentBalance, currency, lastMonth, nextMonth, loader, initial } = props;

	const renderItem = (header, balance, currency) => html` <div class="header-item">
		<div class="--header">${header}</div>
		<div class="--content">
			<span class="--balance ${balance > 0 ? '--positive' : '--negative'}"
				>${Number(balance).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span
			><span class="--currency">(${currency})</span>
		</div>
	</div>`;

	const renderHeader = () => {
		if (loader && loader.loading && !initial) {
			return nothing;
		}
		return html`${renderItem('Last Month', lastMonth, currency)}${renderItem(
			'Current Balance',
			currentBalance,
			currency
		)}${renderItem('Next Month', nextMonth, currency)}`;
	};

	return html`<div class="wallet-header">${renderHeader()}</div>`;
};
