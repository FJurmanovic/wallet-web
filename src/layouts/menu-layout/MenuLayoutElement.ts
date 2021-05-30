import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { BaseLayoutElement } from "common/layouts";

@controller
class MenuLayoutElement extends BaseLayoutElement {
    @closest appMain;

    constructor() {
        super();
    }

    @update
    connectedCallback() {}

    render() {
        return html`
            <div>
                <app-link data-go-back="true" data-title="Go back"></app-link>
            </div>
            <div data-target="menu-layout.slotted"></div>
        `;
    }

    update() {
        render(this.render(), this);
    }
}
