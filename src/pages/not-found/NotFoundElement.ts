import { controller } from "@github/catalyst";
import { closest, update } from "core/utils";
import { html, render } from "@github/jtml";
import { AppMainElement } from "components/";
import { BasePageElement } from "common/";

@controller
class NotFoundElement extends BasePageElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.update();
    }

    render = () => {
        return html`
            <div>404 - Page not found</div>
            <div><app-link data-to="/" data-title="Homepage"></app-link></div>
        `;
    };
}
