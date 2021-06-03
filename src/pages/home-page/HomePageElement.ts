import { controller } from "@github/catalyst";
import { html, TemplateResult, until } from "@github/jtml";
import { PingService } from "services/";
import { AppMainElement } from "components/";
import { BasePageElement } from "common/";

@controller
class HomePageElement extends BasePageElement {
    private pingService: PingService;
    constructor() {
        super();
    }

    elementConnected = (): void => {
        this.pingService = new PingService(this.appMain?.appService);
        this.update();
        this.appMain.addEventListener("tokenchange", this.update);
    };

    elementDisconnected = (appMain: AppMainElement): void => {
        appMain?.removeEventListener("tokenchange", this.update);
    };

    getPong = async (): Promise<void> => {
        try {
            const response = await this.pingService.getAll();
        } catch (err) {
            throw err;
        }
    };

    pongEl = (): TemplateResult => {
        return html`<div>${until(this.getPong())}</div>`;
    };

    openModal = (): void => {
        const _modal = this.appMain.appModal;
        if (_modal) {
            this.appMain.closeModal();
        } else {
            this.appMain.createModal("wallet-create");
        }
    };

    render = (): TemplateResult => {
        return html`
            <button data-action="click:home-page#openModal">New Wallet</button>
        `;
    };
}

export { HomePageElement };
