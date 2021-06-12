import { controller, target } from '@github/catalyst';
import { closest } from 'core/utils';
import { html, TemplateResult } from 'core/utils';
import { BaseLayoutElement } from 'common/layouts';
import { AppMainElement } from 'components/';

@controller
class MenuLayoutElement extends BaseLayoutElement {
	@closest appMain: AppMainElement;
	@target appPage: HTMLDivElement;

	constructor() {
		super();
	}

	elementConnected = (): void => {
		this.update();
		this.appMain.addEventListener('tokenchange', this.updateAuth);
		this.appMain.addEventListener('routechanged', this.updateAuth);
	};

	elementDisconnected = (appMain: AppMainElement): void => {
		appMain?.removeEventListener('tokenchange', this.updateAuth);
		appMain?.removeEventListener('routechanged', this.updateAuth);
	};

	get isAuth(): boolean {
		const _is = this.appMain?.routerService?.routerState?.middleware;
		if (typeof _is == 'function') {
			return _is();
		}
		return !!_is;
	}

	updateAuth = (): void => {
		this.update();
	};

	render = (): TemplateResult => {
		const _isAuth = this.isAuth;
		return html`
			<div data-target="menu-layout.appPage">
				${_isAuth ? html`<app-menu></app-menu>` : html``}
				<app-slot data-target="menu-layout.appSlot"></app-slot>
			</div>
		`;
	};
}

export type { MenuLayoutElement };
