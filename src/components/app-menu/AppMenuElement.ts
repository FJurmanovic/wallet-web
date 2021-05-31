import { controller, target } from "@github/catalyst";
import { html, render } from "@github/jtml";
import { AppMainElement } from "components/app-main/AppMainElement";
import { closest, update } from "core/utils";
import { WalletService } from "services/";

@controller
class AppMenuElement extends HTMLElement {
    private walletService: WalletService;
    private walletData: Array<any>;
    private totalWallets: number;
    @closest appMain: AppMainElement;
    constructor() {
        super();
    }

    connectedCallback() {
        this.walletService = new WalletService(this.appMain?.appService);
        this.update();
        if (this.appMain.isAuth) this.getWallets();
        window.addEventListener("tokenchange", this.updateToken);
    }

    disconnectedCallback(): void {
        window.removeEventListener("tokenchange", this.updateToken);
    }

    getWallets = async () => {
        try {
            const response = await this.walletService.getAll({ rpp: 2 });
            this.setWallets(response.items, response.totalRecords);
        } catch (err) {
            this.update();
        }
    };

    setWallets(wallets: Array<any>, totalWallets: number) {
        this.walletData = wallets;
        this.totalWallets = totalWallets;
        console.log("eh");
        this.update();
    }

    updateToken = () => {
        if (this.isAuth) {
            this.getWallets();
        } else {
            this.update();
        }
    };

    update = () => {
        render(this.render(), this);
    };

    get isAuth() {
        return this.appMain.isAuth;
    }

    render = () => {
        return html`
            <ul>
                <li>
                    <app-link data-to="/">Home</app-link>
                </li>
                ${this.isAuth
                    ? html` <li>
                          <app-link data-to="/history">History</app-link>
                      </li>`
                    : null}
                ${this.isAuth && this.totalWallets > 0
                    ? this.walletData.map((wallet) => {
                          return html`
                              <li>
                                  <app-link data-to="/wallet/${wallet.id}"
                                      >${wallet.name}</app-link
                                  >
                              </li>
                          `;
                      })
                    : null}
                ${this.isAuth && this.totalWallets > 2
                    ? html`
                          <li>
                              <app-link data-to="/wallet/all">Other</app-link>
                          </li>
                      `
                    : null}
                ${this.isAuth
                    ? html` <li>
                          <app-link data-to="/logout">Logout</app-link>
                      </li>`
                    : null}
                ${!this.isAuth
                    ? html`
                          <li>
                              <app-link data-to="/login">Login</app-link>
                          </li>
                          <li>
                              <app-link data-to="/register">Register</app-link>
                          </li>
                      `
                    : null}
            </ul>
        `;
    };
}
