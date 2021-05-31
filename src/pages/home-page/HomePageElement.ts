import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { AppMainElement } from "components/";

@controller
class HomePageElement extends HTMLElement {
    private pingService: PingService;
    @closest appMain: AppMainElement;
    constructor() {
        super();
    }

    connectedCallback() {
        this.pingService = new PingService(this.appMain?.appService);
        if (this.appMain.isAuth) this.getPong();
        this.update();
        window.addEventListener("tokenchange", this.update);
    }

    disconnectedCallback(): void {
        window.removeEventListener("tokenchange", this.update);
    }

    getPong = async () => {
        try {
            const response = await this.pingService.getAll();
        } catch (err) {
            throw err;
        }
    };

    pongEl = () => {
        return html`<div>${until(this.getPong())}</div>`;
    };

    openModal = () => {
        const _modal = this.appMain.appModal;
        if (_modal) {
            this.appMain.closeModal();
        } else {
            this.appMain.createModal("login-page");
        }
    };

    render() {
        return html`
            <app-link data-to="/" data-title="Main"></app-link> |
            ${this.appMain.isAuth
                ? html`<app-link data-to="/home" data-title="Home"></app-link>
                      |<app-link
                          data-to="/logout"
                          data-title="Logout"
                      ></app-link>`
                : html`<app-link
                      data-to="/login"
                      data-title="Login"
                  ></app-link>`}
            <button data-action="click:home-page#openModal">Test</button>
        `;
    }

    update = () => {
        render(this.render(), this);
    };
}
