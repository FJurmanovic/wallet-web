import { html, TemplateResult } from 'core/utils';

export default ({ disabled, className, title, customAction, to }): TemplateResult =>
	html`${disabled
		? html`<a
				class="btn btn-link btn-disabled${className ? ` ${className}` : ''}"
				data-target="app-link.main"
				style="color:grey"
				><span class="link-text">${title}</span></a
		  >`
		: html`<a
				class="btn btn-link${className ? ` ${className}` : ''}"
				data-target="app-link.main"
				app-action="click:app-link#goTo ${customAction ? customAction : ''}"
				href="${to}"
				style="text-decoration: underline; cursor: pointer;"
				><span class="link-text">${title}</span></a
		  >`}`;
