import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { finished, loading } = props;
	const renderLoader = (finished: boolean, loading: boolean) => {
		if (!finished && !loading) {
			return html`<div class="loader --removing"></div>`;
		} else if (loading) {
			return html`<div class="loader --loading"></div>`;
		}
		return nothing;
	};
	return html`<div class="loader-wrapper">
		<div class="loader-relative">${renderLoader(finished, loading)}</div>
	</div>`;
};
