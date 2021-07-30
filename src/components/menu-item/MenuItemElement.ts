import { attr, controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { AppMainElement } from 'components/app-main/AppMainElement';
import { BaseComponentElement } from 'common/';
import { deviceWidths } from 'core/constants';
import { MenuLayoutElement } from 'layouts/';

@controller
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
		if(this.initialized && changed == 'data-title') {
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

	render = (): TemplateResult => {
		console.log(this.title)
		return html`
			<div class="${this.current ? 'selected ' : ''}menu-item" data-target="menu-item.itemEl">
				<app-link class="${this.className}" data-to="${this.path}" data-custom-action="click:menu-item#itemClick" data-title="${this.title}"></app-link
				>
				${this.customaction
					? html`<div data-target="menu-item.customButton" app-action="${this.customaction}">+</div>`
					: html``}
			</div>
		`;
	};
}

export type { MenuItemElement };
