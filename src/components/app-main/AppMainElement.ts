import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { AppService, HttpClient, RouterService } from "core/services";
import { AuthStore } from "core/store";

@controller
class AppMainElement extends HTMLElement {
    public routerService: RouterService;
    public authStore: AuthStore;
    private httpClient: HttpClient;
    public appService: AppService;

    constructor() {
        super();
    }
    connectedCallback() {
        this.httpClient = new HttpClient();
        this.appService = new AppService(this, this.httpClient);
        this.routerService = new RouterService(this);
        this.authStore = new AuthStore(this.appService);
        this.routerService.setRoutes([
            {
                path: "/",
                component: "home-page",
                layout: "menu-layout",
            },
            {
                path: "/home",
                component: "home-page",
                middleware: this.isAuth,
            },
            {
                path: "/rb",
                component: "register-page",
            },
            {
                path: "/unauthorized",
                component: "register-page",
            },
            {
                path: "token-expired",
                component: "register-page",
            },
        ]);
        this.routerService.init();
    }

    isAuth = () => {
        if (this.authStore?.token == null) {
            this.routerService.goTo("/unauthorized");
            return true;
        }
    };
}

export type { AppMainElement };
