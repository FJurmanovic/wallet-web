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

    connectedCallback() {
        this.update();
        window.addEventListener("tokenchange", this.updateAuth);
    }

    disconnectedCallback(): void {
        window.removeEventListener("tokenchange", this.updateAuth);
    }

    get isAuth() {
        const _hasToken = this.appMain?.isAuth;
        const _hasData = this.appMain?.authStore?.user;
        return _hasToken;
    }

    updateAuth = () => {
        this.update();
    };

    render = () => {
        return html`
            <app-menu></app-menu>
            <app-slot data-target="menu-layout.appSlot"></app-slot>
        `;
    };

    update = () => {
        render(this.render(), this);
    };
}
