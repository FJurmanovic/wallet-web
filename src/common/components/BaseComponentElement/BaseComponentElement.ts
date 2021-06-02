import { html, render } from "@github/jtml";
import { AppMainElement } from "components/";
import { closest } from "core/utils";

class BaseComponentElement extends HTMLElement {
    @closest appMain: AppMainElement;
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
                    el.addEventListener(type, this?.[method]);
                } else {
                    this.childNodes.forEach((child: HTMLElement) => {
                        if (child.tagName == tag.toUpperCase()) {
                            el.addEventListener(type, child?.[method]);
                        }
                    });
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

export default BaseComponentElement;
