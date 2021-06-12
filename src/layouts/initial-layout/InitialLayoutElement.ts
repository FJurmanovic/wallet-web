import { controller, target } from '@github/catalyst';
import { closest } from 'core/utils';
import { html, TemplateResult } from 'core/utils';
import { BaseLayoutElement } from 'common/layouts';
import { AppMainElement } from 'components/';

@controller
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

	render = (): TemplateResult => {
		return html`
			<div data-target="initial-layout.appPage">
				<app-slot data-target="initial-layout.appSlot"></app-slot>
			</div>
		`;
	};
}

export type { InitialLayoutElement };
