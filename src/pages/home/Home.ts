import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services";

@controller
class AppMainElement extends HTMLElement {
    private pingService: PingService;
    constructor() {
        super();
        this.pingService = new PingService();
    }
    @update
    connectedCallback() {}

    getPong = async () => {
        try {
            const response = await this.pingService.getAll();
            return response.api;
        } catch (err) {
            console.log(err);
        }
    };

    pongEl = () => {
        return html`<div>${until(this.getPong())}</div>`;
    };

    update() {
        render(html`${this.pongEl()}`, this);
    }
}
