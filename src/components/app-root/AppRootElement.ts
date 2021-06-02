import { controller, target } from "@github/catalyst";
import { BaseComponentElement } from "common/";
import { AppMainElement } from "components/app-main/AppMainElement";
import { closest } from "core/utils";

@controller
class AppRootElement extends BaseComponentElement {
    @target rootElement: HTMLElement;
    constructor() {
        super();
    }

    connectedCallback() {}
}
