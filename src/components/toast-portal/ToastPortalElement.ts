import { controller, targets } from '@github/catalyst';
import { delay, html, until } from 'core/utils';
import { BaseComponentElement } from 'common/';

@controller
class ToastPortalElement extends BaseComponentElement {
	@targets toastElement: HTMLElement;
	toasts: Array<Toast> = [];
	constructor() {
		super();
	}

	elementConnected = (): void => {
		this.update();
	};

	pushToast = (type: string, message: string): void => {
		this.toasts = [{ type, message }, ...this.toasts];
		const interval = setInterval(() => {
			this.popToast();
			clearInterval(interval);
		}, 5000);
		this.update();
	};

	popToast = () => {
		this.toasts?.pop();
		if (this.toasts?.length < 1) {
			this.appMain?.removeToastPortal();
		}
		this.update();
	};

	render = () => {
		const renderToast = (note: string, type: string) => {
			const message = () => html` <div class="toast ${type ? `--${type}` : '--default'}">${note}</div> `;
			return html`${message()}`;
		};

		const renderToasts = (toasts: Array<Toast>) => {
			if (toasts) {
				return html`<div class="toast-list">
					${toasts.map(({ type, message }, i) => (i < 3 ? renderToast(message, type) : html``))}
				</div>`;
			}
			return html``;
		};
		return html`<div class="toast-portal">${renderToasts(this.toasts)}</div>`;
	};
}

type Toast = {
	type: string;
	message: string;
};

export type { ToastPortalElement };
