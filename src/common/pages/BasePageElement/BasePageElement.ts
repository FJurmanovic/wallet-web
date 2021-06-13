import { attr } from '@github/catalyst';
import { html, render } from 'core/utils';
import { BaseElement } from 'common/';
import { isTrue } from 'core/utils';

class BasePageElement extends BaseElement {
	public pageTitle: string = '';
	@attr hidetitle: string;
	@attr customtitle: string;
	private _data: any;
	constructor(options: OptionType) {
		super();
		if (options?.title) {
			this.pageTitle = options?.title;
		}
		this.connectedCallback = this.connectedCallback.bind(this);
		this.disconnectedCallback = this.disconnectedCallback.bind(this);
	}

	public renderTitle = () => {
		if (!isTrue(this.hidetitle)) {
			return html`<div class="page --title">${this.customtitle ? this.customtitle : this.pageTitle}</div>`;
		}
		return html``;
	};

	update = (): void => {
		const _render = () => html` ${this.renderTitle()} ${this.render()} `;
		render(_render(), this);
		this.bindEvents('app-action');
		this.updateCallback();
	};

	connectedCallback() {
		this.appMain.setTitle(this.pageTitle);
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
};
