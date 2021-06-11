import { attr, controller, target } from '@github/catalyst';
import { isTrue } from 'core/utils';
import { html, TemplateResult } from 'lit-html';
import { AppMainElement } from 'components/app-main/AppMainElement';
import { RouterService } from 'core/services';
import { BaseComponentElement } from 'common/';

@controller
class AppLinkElement extends BaseComponentElement {
	@attr to: string;
	@attr goBack: string;
	@attr title: string;
	@target main: Element;
	constructor() {
		super();
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
			return this.routerService.emptyState;
		}
		return false;
	}

	render = (): TemplateResult => {
		return html`${this.disabled
			? html`<a class="btn btn-link btn-disabled" data-target="app-link.main" style="color:grey">${this.title}</a>`
			: html`<a
					class="btn btn-link"
					data-target="app-link.main"
					app-action="click:app-link#goTo"
					href="${this.to}"
					style="text-decoration: underline; cursor: pointer;"
					>${this.title}</a
			  >`}`;
	};
}

export type { AppLinkElement };
