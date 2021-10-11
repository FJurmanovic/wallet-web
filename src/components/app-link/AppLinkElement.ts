import { isTrue } from 'core/utils';
import { TemplateResult, attr, controller, target } from 'core/utils';
import { AppMainElement } from 'components/app-main/AppMainElement';
import { BaseComponentElement } from 'common/';
import { AppLinkElementTemplate } from 'components/app-link';

@controller('app-link')
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
		if (this.initialized && changed == 'data-title') {
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
			return this.routerService?.emptyState;
		}
		return false;
	}

	render = (): TemplateResult =>
		AppLinkElementTemplate({
			disabled: this.disabled,
			className: this.classList,
			title: this.title,
			customAction: this.customAction,
			to: this.to,
		});
}

export type { AppLinkElement };
