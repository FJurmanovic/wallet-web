import { controller, targets } from '@github/catalyst';
import { delay, html, Timer } from 'core/utils';
import { BaseComponentElement } from 'common/';

@controller
class ToastPortalElement extends BaseComponentElement {
	@targets toastElement: HTMLElement;
	toasts: Array<Toast> = [];
	timer: Timer;
	constructor() {
		super();
	}

	elementConnected = (): void => {
		this.update();
	};

	pushToast = (type: string, message: string): void => {
		const toastLen = this.toasts.length;
		this.toasts = [{ type, message }, ...this.toasts];
		if (toastLen < 1) {
			this.timer = new Timer(() => {
				this.popToast();
				if (this.toasts.length > 0) {
					this.timer.reset();
				}
			}, 5000);
		}
		// const interval = setInterval(() => {
		// 	this.popToast();
		// 	clearInterval(interval);
		// }, 5000);
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
			const message = () =>
				html`
					<div class="toast ${type ? `--${type}` : '--default'}">
						<span class="toast-text">${note}</span>
					</div>
				`;
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
