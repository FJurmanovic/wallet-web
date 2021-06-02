import { controller, target } from "@github/catalyst";
import { BaseComponentElement } from "common/";
import { AppMainElement } from "components/app-main/AppMainElement";
import { closest } from "core/utils";

@controller
class AppModalElement extends BaseComponentElement {
    @target modalElement: HTMLElement;
    constructor() {
        super();
    }

    elementConnected = () => {};
}
