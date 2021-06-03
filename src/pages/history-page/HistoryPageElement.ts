import { controller, target } from "@github/catalyst";
import { html, TemplateResult } from "@github/jtml";
import { TransactionsService } from "services/";
import { AppMainElement, AppPaginationElement } from "components/";
import { BasePageElement } from "common/";

@controller
class HistoryPageElement extends BasePageElement {
    private transactionsService: TransactionsService;
    @target pagination: AppPaginationElement;
    constructor() {
        super();
    }

    elementConnected = (): void => {
        this.transactionsService = new TransactionsService(
            this.appMain?.appService
        );
        this.update();
        this.pagination?.setFetchFunc?.(this.getTransactions, true)!;
        this.appMain.addEventListener("tokenchange", this.update);
    };

    elementDisconnected = (appMain: AppMainElement): void => {
        appMain?.removeEventListener("tokenchange", this.update);
    };

    getTransactions = async (options): Promise<any> => {
        try {
            if (this?.routerService?.routerState?.data) {
                const { walletId } = this?.routerService?.routerState?.data;
                if (walletId) {
                    options["walletId"] = walletId;
                }
            }
            const response = await this.transactionsService.getAll(options);
            return response;
        } catch (err) {
            throw err;
        }
    };

    render = (): TemplateResult => {
        const renderWallet = () => {
            if (this.routerService?.routerState?.data?.walletId) {
                return html`<span
                    >${this.routerService?.routerState?.data?.walletId}</span
                >`;
            }
            return html``;
        };
        return html`<div>
            ${renderWallet()}
            <app-pagination
                data-target="history-page.pagination"
            ></app-pagination>
        </div>`;
    };
}

export type { HistoryPageElement };
