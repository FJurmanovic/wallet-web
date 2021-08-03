import { TemplateResult, controller } from 'core/utils';
import { BasePageElement } from 'common/';
import { NotFoundElementTemplate } from 'pages/not-found';

@controller('not-found')
class NotFoundElement extends BasePageElement {
	constructor() {
		super({
			title: '404 - Not Found',
		});
	}
	elementConnected = (): void => {
		this.update();
	};

	render = (): TemplateResult => NotFoundElementTemplate();
}

export type { NotFoundElement };
