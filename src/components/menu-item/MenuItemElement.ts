import { TemplateResult, attr, controller, target } from 'core/utils';
import { AppMainElement } from 'components/app-main/AppMainElement';
import { BaseComponentElement } from 'common/';
import { deviceWidths } from 'core/constants';
import { MenuLayoutElement } from 'layouts/';
import { MenuItemElementTemplate } from 'components/menu-item';

@controller('menu-item')
class MenuItemElement extends BaseComponentElement {
	@attr path: string;
	@attr title: string;
	@attr customaction: string;
	@target itemEl: HTMLElement;
	@target customButton: HTMLDivElement;
	constructor() {
		super();
		this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
	}

	public elementConnected = (): void => {
		if (!this.title && this.innerText) {
			const _slottedText = this.innerText;
			this.innerText = null;
			this.title = _slottedText;
		}
		this.update();
		this.appMain.addEventListener('routechanged', this.update);
	};

	public elementDisconnected = (appMain: AppMainElement): void => {
		appMain?.removeEventListener('routechanged', this.update);
	};

	attributeChangedCallback(changed) {
		if (this.initialized && changed == 'data-title') {
			this.update();
		}
	}

	get current(): boolean {
		return this.routerService?.comparePath(this.path);
	}

	itemClick = (e) => {
		if (window.innerWidth < deviceWidths.mobile) {
			(this.appMain?.mainRoot?.rootElement as MenuLayoutElement)?.retractMenu?.();
		}
	};

	render = (): TemplateResult =>
		MenuItemElementTemplate({
			current: this.current,
			className: this.className,
			path: this.path,
			title: this.title,
			customaction: this.customaction,
		});
}

export type { MenuItemElement };
