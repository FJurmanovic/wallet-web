import { html, TemplateResult } from 'core/utils';

export default ({ isAuth }): TemplateResult => html`
	<div class="app-layout" data-target="menu-layout.appPage">
		${isAuth ? html`<div class="app-sidebar" data-target="menu-layout.appSidebar"><app-menu></app-menu></div>` : html``}
		<div class="app-content">
			<app-slot data-target="menu-layout.appSlot"></app-slot>
		</div>
	</div>
`;
