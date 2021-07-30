import { attr, controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { CircleLoaderElement } from 'components/circle-loader/CircleLoaderElement';
import dayjs from 'dayjs';

@controller
class AppPaginationElement extends BaseComponentElement {
	public items: Array<any>;
	@attr page: number;
	@attr rpp: number;
	@attr totalItems: number;
	@attr autoInit: string;
	@attr tableLayout: string = 'transactions-table';
	@attr colLayout: string = 'col-transactions';
	initial: boolean = false;

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
				rpp: this.rpp || 10,
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
		} finally {
			this.initial = true;
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

	transactionEdit = (id) => {
		const _modal = this.appMain.appModal;
		if (_modal) {
			this.appMain.closeModal();
		} else {
			this.appMain.createModal('transaction-edit', {
				id: id
			});
		}
	}

	render = (): TemplateResult => {
		const { rpp, totalItems, page, items } = this;

		const renderItem = this.customRenderItem
			? this.customRenderItem
			: (item, iter) => html`<tr class="${this.colLayout ? this.colLayout : ''}">
					<td class="--left">${dayjs(item.transactionDate).format("MMM DD 'YY")}</td>
					<td class="--left">${item.description}</td>
					<td class="balance-cell --right">
						<span
							class="balance ${item.amount > 0 && item?.transactionType?.type != 'expense'
								? '--positive'
								: '--negative'}"
						>
							${item?.transactionType?.type == 'expense' ? '- ' : ''}
							${Number(item.amount).toLocaleString('en-US', {
								maximumFractionDigits: 2,
								minimumFractionDigits: 2,
							})}
						</span>
						<span class="currency">(${item.currency ? item.currency : 'USD'})</span>
					</td>
					<td class="--left">
						<span><button @click=${() => this.transactionEdit(item.id)}}>Edit</button></span>
					</td>
			  </tr>`;

		const renderItems = this.customRenderItems
			? this.customRenderItems
			: () => {
					if (this.loader && this.loader.loading && !this.initial) {
						return html``;
					} else {
						if (items?.length > 0) {
							return items?.map((item, iter) => renderItem(item, iter));
						}
						return html`<tr>
							<td>No data</td>
						</tr>`;
					}
			  };

		const renderPagination = () => {
			if (totalItems > items?.length) {
				const pageRange = Math.ceil(totalItems / rpp);
				return html`
					<div class="paginate">
						<span class="--total">(${items?.length}) / ${totalItems} Total Items</span>
						<div class="--footer">
							<span class="--pages">Page ${page} of ${pageRange}</span>
							${page <= 1 || this.loader.loading
								? html` <button
										class="btn btn-primary btn-squared disabled"
										disabled
										app-action="click:app-pagination#pageBack"
								  >
										Prev
								  </button>`
								: html` <button class="btn btn-primary btn-squared" app-action="click:app-pagination#pageBack">
										Prev
								  </button>`}
							${page >= pageRange || this.loader.loading
								? html` <button
										class="btn btn-primary btn-squared disabled"
										disabled
										app-action="click:app-pagination#pageNext"
								  >
										Next
								  </button>`
								: html`<button class="btn btn-primary btn-squared" app-action="click:app-pagination#pageNext">
										Next
								  </button>`}
						</div>
					</div>
				`;
			}
		};

		return html`<div class="app-pagination">
			<table class="${this.tableLayout} ${this.loader && this.loader.loading ? '--loading' : ''}">
				${renderItems()} ${renderPagination()}
			</table>
			${this.loader && this.loader.loading ? html`<circle-loader></circle-loader>` : html``}
		</div>`;
	};
}

export type { AppPaginationElement };
