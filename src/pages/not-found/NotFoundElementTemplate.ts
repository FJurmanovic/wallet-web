import { html, TemplateResult } from 'core/utils';

export default (): TemplateResult => html`
	<div>404 - Page not found</div>
	<div><app-link data-to="/" data-title="Homepage"></app-link></div>
`;
