import { Timer, controller, targets } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { ToastPortalElementTemplate } from 'components/toast-portal';

@controller('toast-portal')
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
		this.update();
	};

	popToast = () => {
		this.toasts?.pop();
		if (this.toasts?.length < 1) {
			this.appMain?.removeToastPortal();
		}
		this.update();
	};

	render = () => ToastPortalElementTemplate({ toasts: this.toasts });
}

export type Toast = {
	type: string;
	message: string;
};

export type { ToastPortalElement };
