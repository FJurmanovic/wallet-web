import { attr } from '@github/catalyst';
import { html, render, isTrue, TemplateResult } from 'core/utils';
import { BaseElement } from 'common/';

class BasePageElement extends BaseElement {
	public _pageTitle: string = '';
	public hideTitleHead: boolean = false;
	@attr hidetitle: string;
	@attr customtitle: string;
	private _data: any;
	constructor(options: OptionType) {
		super();
		if (options?.title) {
			this._pageTitle = options?.title;
		}
		this.hideTitleHead = options?.hideTitleHead || false;
		this.connectedCallback = this.connectedCallback.bind(this);
		this.disconnectedCallback = this.disconnectedCallback.bind(this);
	}

	get pageTitle() {
		return this._pageTitle;
	}

	public renderTitle = () => {
		if (!isTrue(this.hidetitle)) {
			return html`<div class="page --title">${this.customtitle ? this.customtitle : this.pageTitle}</div>`;
		}
		return html``;
	};

	update = (): void => {
		let renderPage = this.render();
		if (typeof renderPage === 'string') {
			const strings: any = [renderPage];
			renderPage = html(strings);
		}
		const _render = () => html` ${this.renderTitle()} ${renderPage} `;
		render(_render(), this);
		this.bindEvents('app-action');
		this.updateCallback();
	};

	connectedCallback() {
		if (!this.hideTitleHead) {
			this.appMain.setTitle(this.pageTitle);
		}
		super.connectedCallback();
	}

	setData = (data: any) => {
		this._data = data;
	};

	getData = () => {
		return this._data;
	};
}

export default BasePageElement;

export type OptionType = {
	title?: string;
	hideTitleHead?: boolean;
};
