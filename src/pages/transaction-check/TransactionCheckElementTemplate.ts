import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	return html`<div>
		<app-pagination data-target="transaction-check.pagination"></app-pagination>
	</div>`;
};
