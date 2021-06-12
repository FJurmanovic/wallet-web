import { controller, target } from '@github/catalyst';
import { BaseComponentElement } from 'common/';

@controller
class AppModalElement extends BaseComponentElement {
	@target modalElement: HTMLElement;
	@target modalContent: HTMLElement;
	constructor() {
		super();
	}

	elementConnected = (): void => {};
}

export type { AppModalElement };
