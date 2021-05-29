import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { BaseLayoutElement } from "common/layouts";

@controller
class MenuLayoutElement extends BaseLayoutElement {
    constructor() {
        super();
    }

    @update
    connectedCallback() {}

    update() {
        render(
            html`
                <div>Menu</div>
                <div data-target="menu-layout.slotted"></div>
            `,
            this
        );
    }
}
