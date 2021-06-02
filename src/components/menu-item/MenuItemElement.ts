import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { AppMainElement } from "components/app-main/AppMainElement";
import { RouterService } from "core/services";
import { BaseComponentElement } from "common/";

@controller
class MenuItemElement extends BaseComponentElement {
    @attr path: string;
    @attr title: string;
    @target itemEl: HTMLElement;
    routerService: RouterService;
    constructor() {
        super();
    }

    public elementConnected = () => {
        this.routerService = this.appMain?.routerService;
        if (!this.title && this.innerText) {
            const _slottedText = this.innerText;
            this.innerText = null;
            this.title = _slottedText;
        }
        this.update();
        window.addEventListener("routechanged", this.update);
    };

    public elementDisconnected = () => {
        window.removeEventListener("routechanged", this.update);
    };

    get current() {
        return this.routerService.comparePath(this.path);
    }

    render = () => {
        return html`
            <div
                class="${this.current ? "selected " : ""}menu-item"
                data-target="menu-item.itemEl"
            >
                <app-link data-to="${this.path}">${this.title}</app-link>
            </div>
        `;
    };
}
