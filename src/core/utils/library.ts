import { attr, target, targets, register } from '@github/catalyst';
import { bind, bindShadow } from '@github/catalyst/lib/bind';
import { autoShadowRoot } from '@github/catalyst/lib/auto-shadow-root';
import { defineObservedAttributes, initializeAttrs } from '@github/catalyst/lib/attr';

import { CustomElement } from '@github/catalyst/lib/custom-element';
import { html } from 'core/utils';

function renderChildren(children) {
	let _html = '';
	for (const child of children) {
		if (!child) break;
		if (typeof child === 'string') {
			_html += child;
		} else {
			_html += createElement(...child);
		}
	}
	return _html;
}

const htmlTagReg = /<\/?[a-z][\s\S]*>/i;

function processElement(tag?, attributes?, ...children) {
	console.log(tag, attributes, children);
	const isHtmlTag = htmlTagReg.test(tag);
	if (isHtmlTag) {
		console.log('tag1', [tag]);
		return tag;
	}
	if (!tag) {
		console.log('tag2', [tag]);
		return renderChildren(children);
	}

	let _html = '<';
	_html += tag;
	for (const [key, value] of Object.entries(attributes || {})) {
		_html += ` ${key}="${value}"`;
	}
	_html += '>';
	_html += renderChildren(children);
	_html += `</${tag}>`;
	console.log('tag3', [_html]);
	return _html;
}

function createElement(...args) {
	return processElement(...args);
}

const Fragment = null;

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

export { attr, controller, target, targets, createElement, Fragment };
