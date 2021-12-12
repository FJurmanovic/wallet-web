import { TemplateResult, controller, target, html } from 'core/utils';
import { TransactionsService, TransactionStatusService } from 'services/';
import { AppPaginationElement } from 'components/';
import { BasePageElement } from 'common/';
import { TransactionCheckElementTemplate } from 'pages/transaction-check';
import dayjs from 'dayjs';

@controller('transaction-check')
class TransactionCheckElement extends BasePageElement {
	private transactionsService: TransactionsService;
	private transactionStatusService: TransactionStatusService;
	transactionStatuses: [];
	@target pagination: AppPaginationElement;
	modalData: any = null;
	constructor() {
		super({
			title: 'Transaction Check',
			hideTitleHead: true,
		});
	}

	elementConnected = async (): Promise<void> => {
		this.transactionStatusService = new TransactionStatusService(this.appMain?.appService);
		await this.fetchTransactionStatus();
		this.transactionsService = new TransactionsService(this.appMain?.appService);
		this.update();
		this.modalData = this.getData();
		this.pagination?.setCustomRenderItem?.(this.renderSubscription)!;
		this.pagination?.setFetchFunc?.(this.getTransactions, this.modalData?.autoInit)!;
		if (!this.modalData?.autoInit) {
			this.pagination?.executeFetch?.(null, () => this.mappedData(this.modalData.data));
		}
	};

	mappedData = (data) => {
		for (const item of data?.items) {
			item.formattedDate = dayjs(item.transactionDate).format('YYYY-MM-DD');
		}
		return data;
	};

	renderSubscription = (item) => {
		const renderEditActions = () => html`<div class="d--flex">
			<button class="btn btn-rounded btn-red" @click="${() => this.transactionEdit(item)}}">Cancel</button>
			<button class="btn btn-rounded btn-primary" @click="${() => this.transactionEditSave(item)}}">Save</button>
		</div>`;
		const renderRegularActions = () => html`<div class="d--flex">
			<button class="btn btn-rounded btn-primary" @click="${() => this.transactionEdit(item)}}">Edit</button>
			<button class="btn btn-rounded btn-green" @click="${() => this.transactionEditComplete(item)}}">Complete</button>
		</div>`;
		return html`<tr class="col-checks">
			${!item.isEdit
				? html`<td class="--left">${dayjs(item.transactionDate).format("MMM DD 'YY")}</td>`
				: html`<input-field
						data-type="date"
						data-name="${item.name}"
						data-targets="transaction-check.inputs"
						data-initial-value="${item.formattedDate}"
						@change="${(e) => (item.newTransactionDate = e.target.value)}"
				  ></input-field>`}
			<td class="--left">${item.description}</td>
			<td class="balance-cell --right">
				<span
					class="balance ${item.amount > 0 && item?.transactionType?.type != 'expense' ? '--positive' : '--negative'}"
				>
					${item?.transactionType?.type == 'expense' ? '- ' : ''}
					${Number(item.amount).toLocaleString('en-US', {
						maximumFractionDigits: 2,
						minimumFractionDigits: 2,
					})}
				</span>
				<span class="currency">(${item.currency ? item.currency : 'USD'})</span>
			</td>
			<td class="--right">${item.isEdit ? renderEditActions() : renderRegularActions()}</td>
		</tr>`;
	};

	fetchTransactionStatus = async () => {
		this.transactionStatuses = await this.transactionStatusService.getAll();
	};

	transactionEdit = (item) => {
		item.isEdit = !item.isEdit;
		this.pagination?.update();
	};

	transactionEditSave = async (item) => {
		const resource = {
			transactionDate: dayjs(item.newTransactionDate || item.transactionDate)
				.utc(true)
				.format(),
		};
		await this.updateTransaction(item.id, resource);
	};

	transactionEditComplete = async (item) => {
		const completedStatusId = (this.transactionStatuses?.find((item: any) => item.status === 'completed') as any)?.id!;
		if (completedStatusId) {
			const resource = {
				transactionStatusId: completedStatusId,
			};
			await this.updateTransaction(item.id, resource);
		}
	};

	transactionUpdated = () => {
		this.pagination?.executeFetch();
	};

	getTransactions = async (options): Promise<any> => {
		try {
			options.embed = 'TransactionType';
			options.sortBy = 'transactionDate|asc';
			const response = await this.transactionsService.check(options);
			return this.mappedData(response);
		} catch (err) {
			throw err;
		}
	};

	updateTransaction = async (id, resource): Promise<any> => {
		try {
			const response = await this.transactionsService.put(id, resource);
			return response;
		} catch (err) {
			throw err;
		} finally {
			const options = {
				page: this.pagination?.page || 1,
				rpp: this.pagination?.rpp || 10,
			};
			this.pagination?.executeFetch(options);
			this.appMain?.triggerTransactionUpdate?.()!;
		}
	};

	render = (): TemplateResult =>
		TransactionCheckElementTemplate({ walletId: this.routerService?.routerState?.data?.walletId });
}

export type { TransactionCheckElement };
