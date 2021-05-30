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
    @closest appMain;

    constructor() {
        super();
    }
    connectedCallback() {
        if (this.appMain !== this) return;
        this.httpClient = new HttpClient();
        this.appService = new AppService(this, this.httpClient);
        this.routerService = new RouterService(this);
        this.authStore = new AuthStore(this.appService);
        this.routerService.setRoutes([
            {
                path: "/",
                component: "home-page",
                layout: "menu-layout",
                middleware: this.middleAuth,
            },
            {
                path: "/home",
                component: "home-page",
            },
            {
                path: "/register",
                component: "register-page",
                layout: "menu-layout",
            },
            {
                path: "/login",
                component: "login-page",
                layout: "menu-layout",
            },
            {
                path: "/unauthorized",
                component: "login-page",
            },
            {
                path: "token-expired",
                component: "login-page",
            },
        ]);
        this.routerService.init();
    }

    middleAuth = () => {
        if (!this.isAuth) {
            this.routerService.goTo("/unauthorized");
            return true;
        }
    };

    get isAuth(): boolean {
        return this.authStore && this.authStore.token;
    }
}

export type { AppMainElement };
