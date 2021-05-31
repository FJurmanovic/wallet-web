import { target } from "@github/catalyst";

class BaseLayoutElement extends HTMLElement {
    @target slotted: HTMLElement;
    public isLayout: boolean = true;
    public _slotted: string;
    constructor() {
        super();
    }

    get slotTag() {
        return this.slotted?.firstElementChild?.tagName;
    }

    compareTags = (tag: string | HTMLElement): boolean => {
        if (typeof tag === "string") {
            return this.slotTag === tag;
        }
        return tag?.tagName === this.slotTag;
    };

    setElement = (newTag: string) => {
        const _slotted = `<${newTag}></${newTag}>`;
        this._slotted = _slotted;
        this.slotted.innerHTML = _slotted;
    };
}

export default BaseLayoutElement;
