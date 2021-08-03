import { controller, target } from 'core/utils';
import { BaseComponentElement } from 'common/';

@controller('app-slot')
class AppSlotElement extends BaseComponentElement {
	@target slotElement: HTMLElement;
	constructor() {
		super();
	}

	elementConnected = (): void => {};
}

export type { AppSlotElement };
