import { html, nothing, TemplateResult } from 'core/utils';
import { Toast } from './';

export default (props): TemplateResult => {
	const { toasts } = props;
	const renderToast = (note: string, type: string) => {
		const message = () =>
			html`
				<div class="toast ${type ? `--${type}` : '--default'}">
					<span class="toast-text">${note}</span>
				</div>
			`;
		return html`${message()}`;
	};

	const renderToasts = (toasts: Array<Toast>) => {
		if (toasts) {
			return html`<div class="toast-list">
				${toasts.map(({ type, message }, i) => (i < 3 ? renderToast(message, type) : nothing))}
			</div>`;
		}
		return nothing;
	};
	return html`<div class="toast-portal">${renderToasts(toasts)}</div>`;
};
