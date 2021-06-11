import { controller, target } from '@github/catalyst';
import { BaseComponentElement } from 'common/';

@controller
class AppRootElement extends BaseComponentElement {
	@target rootElement: HTMLElement;
	constructor() {
		super();
	}

	elementConnected = (): void => {};
}

export type { AppRootElement };
