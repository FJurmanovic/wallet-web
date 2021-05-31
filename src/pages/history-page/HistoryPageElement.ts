import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { TransactionsService } from "services/";
import { AppMainElement } from "components/";

@controller
class HistoryPageElement extends HTMLElement {
    private transactionsService: TransactionsService;
    private transactions: Array<any> = [];
    @closest appMain: AppMainElement;
    constructor() {
        super();
    }

    connectedCallback() {
        this.transactionsService = new TransactionsService(
            this.appMain?.appService
        );
        if (this.appMain.isAuth) this.getTransactions();
        this.update();
        window.addEventListener("tokenchange", this.update);
    }

    disconnectedCallback(): void {
        window.removeEventListener("tokenchange", this.update);
    }

    getTransactions = async () => {
        try {
            const response = await this.transactionsService.getAll();
            if (response) {
                this.setTransactions(response);
            }
        } catch (err) {
            throw err;
        }
    };

    setTransactions(transactions: Array<any>) {
        this.transactions = transactions;
        this.update();
    }

    openModal = () => {
        const _modal = this.appMain.appModal;
        if (_modal) {
            this.appMain.closeModal();
        } else {
            this.appMain.createModal("login-page");
        }
    };

    render = () => {
        return html`
            <ul>
                ${this.transactions
                    ? this.transactions.map((transaction) => {
                          html` <li>${transaction.description}</li> `;
                      })
                    : null}
            </ul>
        `;
    };

    update = () => {
        render(this.render(), this);
    };
}
