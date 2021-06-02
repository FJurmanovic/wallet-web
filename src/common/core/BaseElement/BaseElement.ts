import { html, render } from "@github/jtml";
import { AppMainElement } from "components/";
import { closest } from "core/utils";

class BaseElement extends HTMLElement {
    @closest appMain: AppMainElement;
    private elementDisconnectCallbacks: Array<Function> = [];
    constructor() {
        super();
    }

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
                    const _callback = () =>
                        el.removeEventListener(type, this?.[method]);
                    this.elementDisconnectCallbacks.push(_callback);
                } else {
                    this.childNodes.forEach((child: HTMLElement) => {
                        if (child.tagName == tag.toUpperCase()) {
                            el.addEventListener(type, child?.[method]);
                            const _callback = () =>
                                el.removeEventListener(type, child?.[method]);
                            this.elementDisconnectCallbacks.push(_callback);
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

    connectedCallback() {
        this.elementConnected();
    }

    disconnectedCallback() {
        this.elementDisconnected();
        if (Array.isArray(this.elementDisconnectCallbacks)) {
            this.elementDisconnectCallbacks.forEach((callback: Function) => {
                if (typeof callback == "function") {
                    callback();
                }
            });
        }
    }

    elementConnected = () => {
        this.update();
    };

    elementDisconnected = () => {};
}

export default BaseElement;
