import { target } from "@github/catalyst";

class BaseLayoutElement extends HTMLElement {
    @target appSlot: HTMLElement;
    public isLayout: boolean = true;
    public _appSlot: string;
    constructor() {
        super();
    }

    get slotTag() {
        return this.appSlot?.firstElementChild?.tagName;
    }

    compareTags = (tag: string | HTMLElement): boolean => {
        if (typeof tag === "string") {
            return this.slotTag === tag;
        }
        return tag?.tagName === this.slotTag;
    };

    setElement = (newTag: string) => {
        const _appSlot = `<${newTag}></${newTag}>`;
        this._appSlot = _appSlot;
        this.appSlot.innerHTML = _appSlot;
    };
}

export default BaseLayoutElement;
