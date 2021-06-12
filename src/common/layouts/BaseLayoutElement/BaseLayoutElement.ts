import { target } from '@github/catalyst';
import { BaseElement } from 'common/';

class BaseLayoutElement extends BaseElement {
	@target appSlot: HTMLElement;
	public isLayout: boolean = true;
	public _appSlot: string;
	constructor() {
		super();
	}

	get slotTag(): string {
		return this.appSlot?.firstElementChild?.tagName;
	}

	compareTags = (tag: string | HTMLElement): boolean => {
		if (typeof tag === 'string') {
			return this.slotTag === tag;
		}
		return tag?.tagName === this.slotTag;
	};

	setElement = (newTag: string): void => {
		const _appSlot = `<div data-target="base-layout.content"><${newTag}></${newTag}></div>`;
		this._appSlot = _appSlot;
		this.appSlot.innerHTML = _appSlot;
	};
}

export default BaseLayoutElement;
