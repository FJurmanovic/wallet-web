import { controller, target } from "@github/catalyst";
import { BaseComponentElement } from "common/";

@controller
class AppSlotElement extends BaseComponentElement {
    @target slotElement: HTMLElement;
    constructor() {
        super();
    }

    elementConnected = (): void => {};
}

export type { AppSlotElement };
