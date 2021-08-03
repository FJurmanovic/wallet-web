import { attr, controller, TemplateResult } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { AppPaginationElementTemplate } from 'components/app-pagination';

@controller('app-pagination')
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

	defaultFetch = () => {
		const options = {
			rpp: this.rpp || 10,
			page: 1,
		};
		this.executeFetch(options);
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
				id: id,
			});
		}
	};

	render = (): TemplateResult =>
		AppPaginationElementTemplate({
			rpp: this.rpp,
			totalItems: this.totalItems,
			page: this.page,
			items: this.items,
			customRenderItem: this.customRenderItem,
			colLayout: this.colLayout,
			transactionEdit: this.transactionEdit,
			customRenderItems: this.customRenderItems,
			loader: this.loader,
			initial: this.initial,
			tableLayout: this.tableLayout,
		});
}

export type { AppPaginationElement };
