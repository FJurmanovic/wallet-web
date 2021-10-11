import { controller, target } from 'core/utils';
import { BaseComponentElement } from 'common/';

@controller('app-modal')
class AppModalElement extends BaseComponentElement {
	@target modalElement: HTMLElement;
	@target modalContent: HTMLElement;
	constructor() {
		super();
	}

	elementConnected = (): void => {};
}

export type { AppModalElement };
