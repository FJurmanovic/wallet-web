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
    @attr goBack: string;
    @attr title: string;
    @target main: Element;
    routerService: RouterService;
    constructor() {
        super();
    }

    public connectedCallback(): void {
        this.routerService = this.appMain?.routerService;
        this.update();
        if (isTrue(this.goBack)) {
            window.addEventListener("routechanged", () => {
                this.update();
            });
        }
    }

    public disconnectedCallback(): void {}

    goTo = () => {
        if (!isTrue(this.goBack) && this.to) {
            this.routerService.goTo(this.to);
        } else {
            this.routerService.goBack();
        }
        this.update();
    };

    get disabled() {
        return isTrue(this.goBack) && this.routerService.emptyState;
    }

    render() {
        return html`${this.disabled
            ? html`<span data-target="app-link.main" style="color:grey"
                  >${this.title}</span
              >`
            : html`<span
                  data-target="app-link.main"
                  data-action="click:app-link#goTo"
                  style="text-decoration: underline; cursor: pointer;"
                  >${this.title}</span
              >`}`;
    }

    update() {
        render(this.render(), this);
    }
}
