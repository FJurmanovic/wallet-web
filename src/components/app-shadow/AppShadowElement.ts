import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { AppService, HttpClient, RouterService } from "core/services";
import { AuthStore } from "core/store";

@controller
class AppShadowElement extends HTMLElement {
    constructor() {
        super();
    }

    @update
    connectedCallback() {
        this.attachShadow({ mode: "open" });
    }

    render() {
        return html` <app-main></app-main> `;
    }

    update() {
        render(this.render(), this.shadowRoot!);
    }
}
