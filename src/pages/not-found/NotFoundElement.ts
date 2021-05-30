import { controller } from "@github/catalyst";
import { closest, update } from "core/utils";
import { html, render } from "@github/jtml";
import { AppMainElement } from "components/";

@controller
class NotFoundElement extends HTMLElement {
    @closest appMain: AppMainElement;
    constructor() {
        super();
    }
    @update
    connectedCallback() {}

    render() {
        return html`
            <div>404 - Page not found</div>
            <div><app-link data-to="/" data-title="Homepage"></app-link></div>
        `;
    }

    update() {
        render(this.render(), this);
    }
}