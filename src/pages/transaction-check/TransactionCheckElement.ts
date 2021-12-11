import { TemplateResult, controller, target, html } from 'core/utils';
import { TransactionsService } from 'services/';
import { AppMainElement, AppPaginationElement } from 'components/';
import { BasePageElement } from 'common/';
import { TransactionCheckElementTemplate } from 'pages/transaction-check';
import dayjs from 'dayjs';

@controller('transaction-check')
class TransactionCheckElement extends BasePageElement {
	private transactionsService: TransactionsService;
	@target pagination: AppPaginationElement;
	modalData: any = null;
	constructor() {
		super({
			title: 'Transaction Check',
		});
	}

	elementConnected = (): void => {
		this.transactionsService = new TransactionsService(this.appMain?.appService);
		this.update();
		this.pagination?.setCustomRenderItem?.(this.renderSubscription)!;
		this.pagination?.setFetchFunc?.(this.getTransactions, false)!;
		this.modalData = this.getData();
		this.pagination?.executeFetch?.(null, () => this.mappedData(this.modalData.data));
	};

	mappedData = (data) => {
		for (const item of data?.items) {
			item.formattedDate = dayjs(item.transactionDate).format('YYYY-MM-DD');
		}
		return data;
	};

	renderSubscription = (item) => html`<tr class="col-transactions">
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
		<td class="--right">
			<span><button class="btn btn-rounded btn-gray" @click="${() => this.transactionEdit(item)}}">Edit</button></span>
		</td>
	</tr>`;

	transactionEdit = (item) => {
		item.isEdit = !item.isEdit;
		this.pagination?.update();
	};

	transactionUpdated = () => {
		this.pagination?.executeFetch();
	};

	getTransactions = async (options): Promise<any> => {
		try {
			options.embed = 'TransactionType';
			options.sortBy = 'dateCreated|desc';
			const response = await this.transactionsService.check(options);
			return response;
		} catch (err) {
			throw err;
		}
	};

	render = (): TemplateResult =>
		TransactionCheckElementTemplate({ walletId: this.routerService?.routerState?.data?.walletId });
}

export type { TransactionCheckElement };
