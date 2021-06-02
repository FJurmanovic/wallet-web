import { controller } from "@github/catalyst";
import { closest } from "core/utils";
import { html, render } from "@github/jtml";
import { BaseLayoutElement } from "common/layouts";
import { AppMainElement } from "components/";

@controller
class MenuLayoutElement extends BaseLayoutElement {
    @closest appMain: AppMainElement;

    constructor() {
        super();
    }

    elementConnected = () => {
        this.update();
        window.addEventListener("tokenchange", this.updateAuth);
        window.addEventListener("routechanged", this.updateAuth);
    };

    elementDisconnected = () => {
        window.removeEventListener("tokenchange", this.updateAuth);
        window.removeEventListener("routechanged", this.updateAuth);
    };

    get isAuth() {
        const _is = this.appMain?.routerService?.routerState?.middleware;
        if (typeof _is == "function") {
            return _is();
        }
        return !!_is;
    }

    updateAuth = () => {
        this.update();
    };

    render = () => {
        const _isAuth = this.isAuth;
        return html`
            ${_isAuth ? html`<app-menu></app-menu>` : html``}
            <app-slot data-target="menu-layout.appSlot"></app-slot>
        `;
    };
}
