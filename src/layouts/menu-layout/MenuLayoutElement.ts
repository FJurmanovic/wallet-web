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
        return _hasData && _hasToken;
    }

    updateAuth = () => {
        this.update();
    };

    render() {
        return html`
            ${this.isAuth &&
            html`<div>
                <app-link data-go-back="true" data-title="Go back"></app-link>
            </div>`}
            <div data-target="menu-layout.slotted"></div>
        `;
    }

    update = () => {
        render(this.render(), this);
        const _slotted = this._slotted;
        if (_slotted && this.slotted) {
            this.slotted.innerHTML = _slotted;
        }
    };
}
