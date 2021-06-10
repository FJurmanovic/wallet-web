import { attr, controller, target } from "@github/catalyst";
import { html, TemplateResult } from "@github/jtml";
import { BaseComponentElement } from "common/";
import { CircleLoaderElement } from "components/circle-loader/CircleLoaderElement";

@controller
class AppPaginationElement extends BaseComponentElement {
    public items: Array<any>;
    @attr page: number;
    @attr rpp: number;
    @attr totalItems: number;
    @attr autoInit: string;

    private customRenderItems: () => TemplateResult;
    private customRenderItem: (item: any) => TemplateResult;
    fetchFunc: Function = () => {};
    constructor() {
        super();
    }

    elementConnected = (): void => {};

    attributeChangedCallback(): void {
        this.update();
    }

    setItems = (items): void => {
        this.items = items;
        this.update();
    };

    setFetchFunc = async (fetchFunc: Function, autoInit?): Promise<void> => {
        this.fetchFunc = fetchFunc;
        if (autoInit) {
            const options = {
                rpp: this.rpp || 5,
                page: this.page || 1,
            };
            this.executeFetch(options);
        }
    };

    setCustomRenderItems = (customRenderItems: () => TemplateResult) => {
        this.customRenderItems = customRenderItems;
        this.update();
    };

    setCustomRenderItem = (customRenderItem: (item: any) => TemplateResult) => {
        this.customRenderItem = customRenderItem;
        this.update();
    };

    executeFetch = async (options?): Promise<void> => {
        if (!options) {
            options = {
                rpp: this.rpp || 5,
                page: this.page || 1,
            };
        }

        try {
            this.loader?.start?.();
            const response = await this.fetchFunc(options);
            this.loader?.stop?.();
            this.setItems(response?.items);
            this.totalItems = response?.totalRecords;
            this.page = response?.page;
            this.rpp = response?.rpp;
        } catch (err) {
            this.loader?.stop?.();
            console.error(err);
        }
    };

    pageBack = (): void => {
        const { page } = this;
        if (page > 1) {
            this.page--;
            this.executeFetch();
        }
    };

    pageNext = (): void => {
        const { rpp, totalItems, page } = this;
        const pageRange = Math.ceil(totalItems / rpp);
        if (page < pageRange) {
            this.page++;
            this.executeFetch();
        }
    };

    render = (): TemplateResult => {
        const { rpp, totalItems, page, items } = this;

        const renderItem = this.customRenderItem
            ? this.customRenderItem
            : (item) => html`<tr>
                  <td>${item.description}</td>
                  <td>${item.amount}</td>
              </tr>`;

        const renderItems = this.customRenderItems
            ? this.customRenderItems
            : () => {
                  if (this.loader && this.loader.loading) {
                      return html`<circle-loader></circle-loader>`;
                  } else {
                      if (items?.length > 0) {
                          return html`<div class="table">
                              ${items?.map((item) => renderItem(item))}
                          </div>`;
                      }
                      return html``;
                  }
              };

        const renderPagination = () => {
            if (totalItems > items?.length) {
                const pageRange = Math.ceil(totalItems / rpp);
                return html`
                    <div>
                        <button
                            class="btn btn-primary btn-squared ${page <= 1
                                ? "disabled"
                                : ""}"
                            app-action="click:app-pagination#pageBack"
                        >
                            Prev
                        </button>
                        <button
                            class="btn btn-primary btn-squared ${page >=
                            pageRange
                                ? "disabled"
                                : ""}"
                            app-action="click:app-pagination#pageNext"
                        >
                            Next
                        </button>
                    </div>
                `;
            }
        };

        return html`<div>${renderItems()} ${renderPagination()}</div>`;
    };
}

export type { AppPaginationElement };
