import { target } from "@github/catalyst";
import { html, render } from "@github/jtml";
import { AppMainElement } from "components/";
import { closest } from "core/utils";

class BaseLayoutElement extends HTMLElement {
    @target appSlot: HTMLElement;
    @closest appMain: AppMainElement;
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
        const _appSlot = `<div data-target="base-layout.content"><${newTag}></${newTag}></div>`;
        this._appSlot = _appSlot;
        this.appSlot.innerHTML = _appSlot;
    };

    bindEvents = () => {
        const _elems = this.querySelectorAll("[data-action]");
        _elems?.forEach((el) => {
            for (const action of (el.getAttribute("data-action") || "")
                .trim()
                .split(/\s+/)) {
                const eventSep = action.lastIndexOf(":");
                const methodSep = action.lastIndexOf("#");
                const tag = action.slice(eventSep + 1, methodSep);

                const type = action.slice(0, eventSep);
                const method = action.slice(methodSep + 1);

                if (tag.toUpperCase() === this.tagName) {
                    this.addEventListener(type, this[method]);
                }
            }
        });
    };

    render = () => {
        return html``;
    };

    update = () => {
        render(this.render(), this);
        this.bindEvents();
    };
}

export default BaseLayoutElement;
