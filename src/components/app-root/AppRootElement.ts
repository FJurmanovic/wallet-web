import { controller, target } from 'core/utils';
import { BaseComponentElement } from 'common/';

@controller('app-root')
class AppRootElement extends BaseComponentElement {
	@target rootElement: HTMLElement;
	constructor() {
		super();
	}

	elementConnected = (): void => {};
}

export type { AppRootElement };
