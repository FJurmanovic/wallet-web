import { html, TemplateResult } from 'core/utils';

export default (): TemplateResult => html`
	<wallet-header
		data-target="home-page.walletHeader"
		data-current-balance="0"
		data-last-month="0"
		data-next-month="0"
		data-currency="0"
		data-custom="home-page#getBalance"
	></wallet-header>
`;
