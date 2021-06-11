import { attr, controller } from "@github/catalyst";
import { html } from "lit-html";
import { BaseComponentElement } from "common/";

@controller
class CircleLoaderElement extends BaseComponentElement {
    @attr size: string;
    constructor() {
        super();
    }

    elementConnected = (): void => {
        this.update();
    };

    render = () => {
        return html`<div
            class="circle-loader ${this.size ? `-${this.size}` : ""}"
        ></div>`;
    };
}

export type { CircleLoaderElement };
