import { attr, controller, target } from '@github/catalyst';
import { isTrue } from 'core/utils';
import { html, TemplateResult } from 'core/utils';
import { AppMainElement } from 'components/app-main/AppMainElement';
import { RouterService } from 'core/services';
import { BaseComponentElement } from 'common/';

@controller
class AppLinkElement extends BaseComponentElement {
	@attr to: string;
	@attr goBack: string;
	@attr title: string;
	@attr customAction: string;
	@target main: Element;
	constructor() {
		super();
		this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
	}

	elementConnected = (): void => {
		if (!this.title && this.innerText) {
			const _slottedText = this.innerText;
			this.innerText = null;
			this.title = _slottedText;
		}
		this.update();
		if (isTrue(this.goBack)) {
			this.appMain.addEventListener('routechanged', this.update);
		}
	};

	elementDisconnected = (appMain: AppMainElement): void => {
		if (isTrue(this.goBack)) {
			appMain?.removeEventListener('routechanged', this.update);
		}
	};

	attributeChangedCallback(changed) {
		if(this.initialized && changed == 'data-title') {
			this.update();
		}
	}

	goTo = (e: Event): void => {
		e.preventDefault();
		if (!isTrue(this.goBack) && this.to) {
			this.routerService.goTo(this.to);
		} else {
			this.routerService.goBack();
		}
		this.update();
	};

	get disabled(): boolean {
		if (isTrue(this.goBack)) {
			console.log(this.routerService)
			return this.routerService?.emptyState;
		}
		return false;
	}

	render = (): TemplateResult => {
		return html`${this.disabled
			? html`<a
					class="btn btn-link btn-disabled${this.className ? ` ${this.className}` : ''}"
					data-target="app-link.main"
					style="color:grey"
					><span class="link-text">${this.title}</span></a
			  >`
			: html`<a
					class="btn btn-link${this.className ? ` ${this.className}` : ''}"
					data-target="app-link.main"
					app-action="click:app-link#goTo ${this.customAction ? this.customAction : ''}"
					href="${this.to}"
					style="text-decoration: underline; cursor: pointer;"
					><span class="link-text">${this.title}</span></a
			  >`}`;
	};
}

export type { AppLinkElement };
