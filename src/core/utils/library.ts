import { attr, target, targets, register } from '@github/catalyst';
import { bind, bindShadow } from '@github/catalyst/lib/bind';
import { autoShadowRoot } from '@github/catalyst/lib/auto-shadow-root';
import { defineObservedAttributes, initializeAttrs } from '@github/catalyst/lib/attr';

import { CustomElement } from '@github/catalyst/lib/custom-element';

function controller(customElement: CustomElement | string): void | any {
	if (typeof customElement == 'string') {
		return function (classObject: CustomElement) {
			const connect = classObject.prototype.connectedCallback;
			classObject.prototype.connectedCallback = function (this: HTMLElement) {
				this.toggleAttribute('data-catalyst', true);
				autoShadowRoot(this);
				initializeAttrs(this);
				bind(this);
				if (connect) connect.call(this);
				if (this.shadowRoot) bindShadow(this.shadowRoot);
			};
			defineObservedAttributes(classObject);
			if (!window.customElements.get(customElement)) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				window[classObject.name] = classObject;
				window.customElements.define(customElement, classObject);
			}
		};
	} else {
		const classObject = customElement;
		const connect = classObject.prototype.connectedCallback;
		classObject.prototype.connectedCallback = function (this: HTMLElement) {
			this.toggleAttribute('data-catalyst', true);
			autoShadowRoot(this);
			initializeAttrs(this);
			bind(this);
			if (connect) connect.call(this);
			if (this.shadowRoot) bindShadow(this.shadowRoot);
		};
		defineObservedAttributes(classObject);
		register(classObject);
	}
}

export { attr, controller, target, targets };
