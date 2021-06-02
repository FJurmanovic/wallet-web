import { controller, target } from "@github/catalyst";
import { html, render, TemplateResult } from "@github/jtml";
import { BaseComponentElement } from "common/";
import { AppMainElement } from "components/app-main/AppMainElement";
import { closest, update } from "core/utils";
import { WalletService } from "services/";

@controller
class AppMenuElement extends BaseComponentElement {
    private walletService: WalletService;
    private walletData: Array<any>;
    private totalWallets: number;
    constructor() {
        super();
    }

    connectedCallback() {
        this.walletService = new WalletService(this.appMain?.appService);
        if (this.appMain.isAuth) {
            this.getWallets();
        } else {
            this.update();
        }
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

    setWallets = (wallets: Array<any>, totalWallets: number) => {
        this.walletData = wallets;
        this.totalWallets = totalWallets;
        this.update();
    };

    updateToken = () => {
        if (this.isAuth) {
            this.getWallets();
        } else {
            this.update();
        }
    };

    get isAuth(): boolean {
        if (this.appMain?.isAuth) {
            return true;
        }
        return false;
    }

    renderWallets = () => {
        if (this.isAuth && this.totalWallets > 0) {
            return this.walletData.map(
                (wallet) => html`<menu-item data-path="/wallet/${wallet.id}"
                    >${wallet.name}</menu-item
                >`
            );
        }
        return null;
    };

    render = () => {
        const { isAuth, totalWallets, walletData } = this;

        const regularMenu = (path: string, title: string): TemplateResult =>
            html`<menu-item data-path="${path}">${title}</menu-item>`;
        const authMenu = (path: string, title: string): TemplateResult => {
            if (isAuth) {
                return regularMenu(path, title);
            }
            return html``;
        };
        const notAuthMenu = (path: string, title: string): TemplateResult => {
            if (!isAuth) {
                return regularMenu(path, title);
            }
            return html``;
        };
        const renderWallets = (wallets: Array<any>) => {
            if (isAuth && totalWallets > 0) {
                return html`${wallets.map((wallet) =>
                    regularMenu(`wallet/${wallet.id}`, wallet.name)
                )}`;
            }
            return html``;
        };
        const otherWallets = () => {
            if (isAuth && totalWallets > 2) {
                return regularMenu("/wallet/all", "Other");
            }
            return html``;
        };
        return html`
            <div data-target="app-menu.sidebar">
                ${regularMenu("/", "Home")} ${authMenu("/history", "History")}
                ${renderWallets(walletData)} ${otherWallets()}
                ${authMenu("/logout", "Logout")}
                ${notAuthMenu("/login", "Login")}
                ${notAuthMenu("/register", "Register")}
            </div>
        `;
    };
}
