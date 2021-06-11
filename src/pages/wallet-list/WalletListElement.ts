import { targets, controller, target } from "@github/catalyst";
import { html, TemplateResult } from "lit-html";
import { AuthService, WalletService } from "services/";
import { AppPaginationElement, InputFieldElement } from "components/";
import { BasePageElement } from "common/";

@controller
class WalletListElement extends BasePageElement {
    @targets inputs: Array<InputFieldElement>;
    private walletService: WalletService;
    @target pagination: AppPaginationElement;
    authService: AuthService;
    errorMessage: string;
    constructor() {
        super({
            title: "Wallet List",
        });
    }
    elementConnected = (): void => {
        this.walletService = new WalletService(this.appMain?.appService);
        this.authService = new AuthService(this.appMain.appService);
        this.update();
        this.pagination?.setCustomRenderItem(this.renderItem);
        this.pagination?.setFetchFunc?.(this.getWallets, true)!;
    };

    getWallets = async (options): Promise<any> => {
        try {
            const response = await this.walletService.getAll(options);
            return response;
        } catch (err) {
            throw err;
        }
    };

    renderItem = (item): TemplateResult => html`<tr>
        <td><app-link data-to="/wallet/${item.id}">${item.name}</app-link></td>
    </tr>`;

    render = (): TemplateResult => {
        return html`
            <div>Wallets</div>
            <app-pagination
                data-target="wallet-list.pagination"
            ></app-pagination>
        `;
    };
}

export type { WalletListElement };
