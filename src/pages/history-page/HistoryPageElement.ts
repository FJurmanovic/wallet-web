import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { TransactionsService } from "services/";
import { AppMainElement, AppPaginationElement } from "components/";

@controller
class HistoryPageElement extends HTMLElement {
    private transactionsService: TransactionsService;
    @closest appMain: AppMainElement;
    @target pagination: AppPaginationElement;
    constructor() {
        super();
    }

    connectedCallback() {
        this.transactionsService = new TransactionsService(
            this.appMain?.appService
        );
        this.update();
        this.pagination?.setFetchFunc?.(this.getTransactions, true)!;
        window.addEventListener("tokenchange", this.update);
    }

    disconnectedCallback(): void {
        window.removeEventListener("tokenchange", this.update);
    }

    getTransactions = async (options) => {
        try {
            const response = await this.transactionsService.getAll(options);
            return response;
        } catch (err) {
            throw err;
        }
    };

    render = () => {
        return html`
            <app-pagination
                data-target="history-page.pagination"
            ></app-pagination>
        `;
    };

    update = () => {
        render(this.render(), this);
    };
}
