import { attr, controller, target } from "@github/catalyst";
import { html, render } from "@github/jtml";
import { AppMainElement } from "components/app-main/AppMainElement";
import { closest, isTrue } from "core/utils";

@controller
class AppPaginationElement extends HTMLElement {
    @closest appMain: AppMainElement;
    public items: Array<any>;
    @attr page: number;
    @attr rpp: number;
    @attr totalItems: number;
    @attr autoInit: string;
    fetchFunc: Function = () => {};
    constructor() {
        super();
    }

    connectedCallback() {}

    attributeChangedCallback() {
        this.update();
    }

    setItems = (items) => {
        this.items = items;
        this.update();
    };

    setFetchFunc = async (fetchFunc: Function, autoInit?) => {
        this.fetchFunc = fetchFunc;
        if (autoInit) {
            const options = {
                rpp: this.rpp || 5,
                page: this.page || 1,
            };
            this.executeFetch(options);
        }
    };

    executeFetch = async (options?) => {
        if (!options) {
            options = {
                rpp: this.rpp || 5,
                page: this.page || 1,
            };
        }

        try {
            const response = await this.fetchFunc(options);
            this.setItems(response?.items);
            this.totalItems = response?.totalRecords;
            this.page = response?.page;
            this.rpp = response?.rpp;
        } catch (err) {
            console.error(err);
        }
    };

    pageBack = () => {
        const { page } = this;
        if (page > 1) {
            this.page--;
            this.executeFetch();
        }
    };

    pageNext = () => {
        const { rpp, totalItems, page } = this;
        const pageRange = Math.ceil(totalItems / rpp);
        if (page < pageRange) {
            this.page++;
            this.executeFetch();
        }
    };

    render = () => {
        const { rpp, totalItems, page, items } = this;

        const renderItem = (item) => html`<tr>
            <td>${item.description}</td>
            <td>${item.amount}</td>
        </tr>`;

        const renderItems = () => {
            if (items?.length > 0) {
                return html`${items?.map((item) => renderItem(item))}`;
            }
            return html``;
        };

        const renderPagination = () => {
            if (totalItems > items?.length) {
                const pageRange = Math.ceil(totalItems / rpp);
                return html`
                    <div>
                        <button
                            class="btn btn-blue btn-squared ${page <= 1
                                ? "disabled"
                                : ""}"
                            data-action="click:app-pagination#pageBack"
                        >
                            Prev
                        </button>
                        <button
                            class="btn btn-blue btn-squared ${page >= pageRange
                                ? "disabled"
                                : ""}"
                            data-action="click:app-pagination#pageNext"
                        >
                            Next
                        </button>
                    </div>
                `;
            }
        };

        return html`<div>
            <table>
                ${renderItems()}
            </table>
            ${renderPagination()}
        </div>`;
    };

    update = () => {
        render(this.render(), this);
    };
}

export type { AppPaginationElement };
