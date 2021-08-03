import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { walletId } = props;
	const renderWallet = () => {
		if (walletId) {
			return html`<span>${walletId}</span>`;
		}
		return nothing;
	};
	return html`<div>
		${renderWallet()}
		<app-pagination data-target="subscription-list.pagination" data-table-layout="subscription-table"></app-pagination>
	</div>`;
};
