import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { AppMainElement } from "components/app-main/AppMainElement";
import { RouterService } from "core/services";

@controller
class AppLinkElement extends HTMLElement {
    @closest appMain: AppMainElement;
    @attr to: string;
    @attr title: string;
    @target main: Element;
    routerService: RouterService;
    constructor() {
        super();
    }

    public connectedCallback(): void {
        this.update();
        this.routerService = this.appMain?.routerService;
        this.main.addEventListener("click", this.goTo);
    }

    public disconnectedCallback(): void {
        this.main.removeEventListener("click", this.goTo);
    }

    goTo = () => {
        this.routerService.goTo(this.to);
    };

    update() {
        render(
            html`<span
                data-target="app-link.main"
                style="text-decoration: underline; cursor: pointer;"
                >${this.title}</span
            >`,
            this
        );
    }
}
