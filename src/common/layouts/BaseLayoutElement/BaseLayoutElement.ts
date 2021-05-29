import { target } from "@github/catalyst";

class BaseLayoutElement extends HTMLElement {
    @target slotted: HTMLElement;
    public isLayout: boolean = true;
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
        console.log(this.innerHTML);
        this.slotted.innerHTML = `<${newTag}></${newTag}>`;
    };
}

export default BaseLayoutElement;
