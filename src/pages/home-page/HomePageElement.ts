import { controller, target } from "@github/catalyst";
import { html, TemplateResult, until } from "@github/jtml";
import { WalletService } from "services/";
import { AppMainElement, WalletHeaderElement } from "components/";
import { BasePageElement } from "common/";

@controller
class HomePageElement extends BasePageElement {
    @target walletHeader: WalletHeaderElement;
    private walletService: WalletService;
    constructor() {
        super({
            title: "Home",
        });
    }

    elementConnected = (): void => {
        this.walletService = new WalletService(this.appMain?.appService);
        this.update();
        this.appMain.addEventListener("tokenchange", this.update);
        this.getBalance();
    };

    elementDisconnected = (appMain: AppMainElement): void => {
        appMain?.removeEventListener("tokenchange", this.update);
    };

    getBalance = async (): Promise<void> => {
        try {
            const response = await this.walletService.getBalance();
            this.setBalance(response);
        } catch (err) {
            throw err;
        }
    };

    setBalance = (header) => {
        if (!this.walletHeader) return;
        this.walletHeader.currency = header.currency;
        this.walletHeader.currentBalance = header.currentBalance || "0";
        this.walletHeader.lastMonth = header.lastMonth || "0";
        this.walletHeader.nextMonth = header.nextMonth || "0";
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
            <button app-action="click:home-page#openModal">New Wallet</button>
            <wallet-header
                data-target="home-page.walletHeader"
                data-current-balance="0"
                data-last-month="0"
                data-next-month="0"
                data-currency="0"
                data-custom="home-page#getBalance"
            ></wallet-header>
        `;
    };
}

export { HomePageElement };
