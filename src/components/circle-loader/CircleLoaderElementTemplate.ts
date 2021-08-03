import { html, TemplateResult } from 'core/utils';

export default ({ size }): TemplateResult => html`<div class="circle-loader ${size ? `-${size}` : ''}"></div>`;
