import { controller, target } from "@github/catalyst";
import { AppMainElement } from "components/app-main/AppMainElement";
import { closest } from "core/utils";

@controller
class AppSlotElement extends HTMLElement {
    @target slotElement: HTMLElement;
    @closest appMain: AppMainElement;
    constructor() {
        super();
    }

    connectedCallback() {}
}
