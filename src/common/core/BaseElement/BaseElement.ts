import { html, render, TemplateResult } from "@github/jtml";
import { AppMainElement, AppModalElement, AppRootElement } from "components/";
import { AppService, RouterService } from "core/services";
import { AuthStore } from "core/store";
import { closest } from "core/utils";

class BaseElement extends HTMLElement {
    @closest appMain: AppMainElement;
    private _appMain: AppMainElement;
    private elementDisconnectCallbacks: Array<Function> = [];
    constructor() {
        super();
        this.connectedCallback = this.connectedCallback.bind(this);
        this.disconnectedCallback = this.disconnectedCallback.bind(this);
    }

    public get routerService(): RouterService {
        return this.appMain?.routerService;
    }

    public get authStore(): AuthStore {
        return this.appMain?.authStore;
    }

    public get appService(): AppService {
        return this.appMain?.appService;
    }

    public get appModal(): AppModalElement {
        return this.appMain?.appModal;
    }

    public get mainRoot(): AppRootElement {
        return this.appMain?.mainRoot;
    }

    public get isAuth(): boolean {
        return this.appMain?.isAuth();
    }

    public bindEvents = (): void => {
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

    render = (): TemplateResult => {
        return html``;
    };

    update = (): void => {
        render(this.render(), this);
        this.bindEvents();
    };

    connectedCallback(): void {
        this.elementConnected();
        this._appMain = this.appMain;
    }

    disconnectedCallback(): void {
        const { _appMain } = this;
        this.elementDisconnected(_appMain);
        if (Array.isArray(this.elementDisconnectCallbacks)) {
            this.elementDisconnectCallbacks.forEach((callback: Function) => {
                if (typeof callback == "function") {
                    callback(_appMain);
                }
            });
        }
    }

    elementConnected = (): void => {
        this.update();
    };

    elementDisconnected = (appMain: AppMainElement): void => {};
}

export default BaseElement;
