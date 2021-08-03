import { html, nothing, TemplateResult } from 'core/utils';
import dayjs from 'dayjs';

export default (props): TemplateResult => {
	const {
		rpp,
		totalItems,
		page,
		items,
		customRenderItem,
		colLayout,
		transactionEdit,
		customRenderItems,
		loader,
		initial,
		tableLayout,
	} = props;

	const renderItem = customRenderItem
		? customRenderItem
		: (item, iter) => html`<tr class="${colLayout ? colLayout : ''}">
				<td class="--left">${dayjs(item.transactionDate).format("MMM DD 'YY")}</td>
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
					<span
						><button class="btn btn-rounded btn-gray" @click="${() => transactionEdit(item.id)}}">Edit</button></span
					>
				</td>
		  </tr>`;

	const renderItems = customRenderItems
		? customRenderItems
		: () => {
				if (loader && loader.loading && !initial) {
					return nothing;
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
						${page <= 1 || loader.loading
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
						${page >= pageRange || loader.loading
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
		<table class="${tableLayout} ${loader && loader.loading ? '--loading' : ''}">
			${renderItems()} ${renderPagination()}
		</table>
		${loader && loader.loading ? html`<circle-loader></circle-loader>` : nothing}
	</div>`;
};
