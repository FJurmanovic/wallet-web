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

    render = () => {
        return html`
            <button data-action="click:home-page#openModal">Test</button>
        `;
    };

    update = () => {
        render(this.render(), this);
    };
}
