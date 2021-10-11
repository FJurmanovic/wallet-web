import { html, TemplateResult, controller, target, closest } from 'core/utils';
import { BaseLayoutElement } from 'common/layouts';
import { AppMainElement } from 'components/';
import { InitialLayoutElementTemplate } from 'layouts/initial-layout';

@controller('initial-layout')
class InitialLayoutElement extends BaseLayoutElement {
	@closest appMain: AppMainElement;
	@target appPage: HTMLDivElement;

	constructor() {
		super();
	}

	elementConnected = (): void => {
		this.update();
	};

	elementDisconnected = (appMain: AppMainElement): void => {};

	render = (): TemplateResult => InitialLayoutElementTemplate();
}

export type { InitialLayoutElement };
