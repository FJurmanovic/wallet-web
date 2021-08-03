import { html, TemplateResult } from 'core/utils';

export default ({ current, className, path, title, customaction }): TemplateResult => html`
	<div class="${current ? 'selected ' : ''}menu-item" data-target="menu-item.itemEl">
		<app-link
			class="${className}"
			data-to="${path}"
			data-custom-action="click:menu-item#itemClick"
			data-title="${title}"
		></app-link>
		${customaction ? html`<div data-target="menu-item.customButton" app-action="${customaction}">+</div>` : html``}
	</div>
`;
