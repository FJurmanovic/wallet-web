import { html, TemplateResult } from 'core/utils';

export default (): TemplateResult => html`
	<div data-target="initial-layout.appPage">
		<app-slot data-target="initial-layout.appSlot"></app-slot>
	</div>
`;
