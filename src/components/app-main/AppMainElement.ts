import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { RouterService } from "core/services";

@controller
class AppMainElement extends HTMLElement {
    public routerService: RouterService;
    constructor() {
        super();
    }
    connectedCallback() {
        this.routerService = new RouterService(this);
        this.routerService.setRoutes([
            {
                path: "/",
                component: "home-page",
                layout: "menu-layout",
            },
            {
                path: "/home",
                component: "home-page",
            },
        ]);
        this.routerService.init();
    }
}

export type { AppMainElement };
