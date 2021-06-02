import {
    attr,
    targets,
    controller,
    target,
    listenForBind,
} from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { AppMainElement } from "components/app-main/AppMainElement";
import { RouterService } from "core/services";
import { BaseComponentElement } from "common/";

@controller
class AppLinkElement extends BaseComponentElement {
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
        if (!this.title && this.innerText) {
            const _slottedText = this.innerText;
            this.innerText = null;
            this.title = _slottedText;
        }
        this.update();
        if (isTrue(this.goBack)) {
            window.addEventListener("routechanged", this.update);
        }
    }

    public disconnectedCallback(): void {
        if (isTrue(this.goBack)) {
            window.removeEventListener("routechanged", this.update);
        }
    }

    goTo = (e: Event) => {
        e.preventDefault();
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

    render = () => {
        return html`${this.disabled
            ? html`<a
                  class="btn btn-link btn-disabled"
                  data-target="app-link.main"
                  style="color:grey"
                  >${this.title}</a
              >`
            : html`<a
                  class="btn btn-link btn-disabled"
                  data-target="app-link.main"
                  data-action="click:app-link#goTo"
                  href="${this.to}"
                  style="text-decoration: underline; cursor: pointer;"
                  >${this.title}</a
              >`}`;
    };
}
