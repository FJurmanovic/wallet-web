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
            const response = await this.transactionsService.getAll(options);
            return response;
        } catch (err) {
            throw err;
        }
    };

    render = (): TemplateResult => {
        return html`
            <app-pagination
                data-target="history-page.pagination"
            ></app-pagination>
        `;
    };
}

export type { HistoryPageElement };
