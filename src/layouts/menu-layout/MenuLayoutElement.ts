import { controller, target } from '@github/catalyst';
import { closest } from 'core/utils';
import { html, TemplateResult } from 'core/utils';
import { BaseLayoutElement } from 'common/layouts';
import { AppMainElement } from 'components/';

@controller
class MenuLayoutElement extends BaseLayoutElement {
	@closest appMain: AppMainElement;
	@target appPage: HTMLDivElement;
	@target appSidebar: HTMLDivElement;

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

	retractMenu = () => {
		this.appPage.classList.toggle('--retracted');
	};

	render = (): TemplateResult => {
		const _isAuth = this.isAuth;
		return html`
			<div class="app-layout" data-target="menu-layout.appPage">
				${_isAuth
					? html`<div class="app-sidebar" data-target="menu-layout.appSidebar"><app-menu></app-menu></div>`
					: html``}
				<div class="app-content">
					<app-slot data-target="menu-layout.appSlot"></app-slot>
				</div>
			</div>
		`;
	};
}

export type { MenuLayoutElement };
