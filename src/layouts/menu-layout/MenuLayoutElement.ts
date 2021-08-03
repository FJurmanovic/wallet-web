import { TemplateResult, controller, target, closest } from 'core/utils';
import { BaseLayoutElement } from 'common/layouts';
import { AppMainElement } from 'components/';
import { MenuLayoutElementTemplate } from 'layouts/menu-layout';

@controller('menu-layout')
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

	render = (): TemplateResult => MenuLayoutElementTemplate({ isAuth: this.isAuth });
}

export type { MenuLayoutElement };
