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
    @update
    connectedCallback() {
        this.pingService = new PingService(this.appMain?.appService);
        this.getPong();
    }

    getPong = async () => {
        try {
            const response = await this.pingService.getAll();
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    pongEl = () => {
        return html`<div>${until(this.getPong())}</div>`;
    };

    update() {
        render(
            html`<app-link data-to="/home" data-title="Home"></app-link> |
                <app-link data-to="/" data-title="Main"></app-link> |
                <app-link data-to="/rb" data-title="$1"></app-link>`,
            this
        );
    }
}
