import { controller } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { BasePageElement } from 'common/';

@controller
class NotFoundElement extends BasePageElement {
	constructor() {
		super({
			title: '404 - Not Found',
		});
	}
	elementConnected = (): void => {
		this.update();
	};

	render = (): TemplateResult => {
		return html`
			<div>404 - Page not found</div>
			<div><app-link data-to="/" data-title="Homepage"></app-link></div>
		`;
	};
}

export type { NotFoundElement };
