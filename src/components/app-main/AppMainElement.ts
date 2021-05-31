import { controller, target } from "@github/catalyst";
import { closest } from "core/utils";
import { AppService, HttpClient, RouterService } from "core/services";
import { AuthStore } from "core/store";

@controller
class AppMainElement extends HTMLElement {
    public routerService: RouterService;
    public authStore: AuthStore;
    private httpClient: HttpClient;
    public appService: AppService;
    @closest appMain;
    @target appModal;
    @target mainRoot;

    constructor() {
        super();
    }
    connectedCallback() {
        if (this.appMain !== this) return;
        const mainRoot = this.createMainRoot();
        this.httpClient = new HttpClient();
        this.appService = new AppService(this, this.httpClient);
        this.routerService = new RouterService(mainRoot);
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
                layout: "menu-layout",
                middleware: this.middleAuth,
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
                layout: "menu-layout",
            },
            {
                path: "/token-expired",
                component: "login-page",
                layout: "menu-layout",
            },
            {
                path: "/logout",
                component: "logout-page",
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

    createModal = (element: string) => {
        console.log(this.appModal);
        this.closeModal();
        const _appModal = document.createElement("app-modal");
        _appModal.setAttribute("data-target", "app-main.appModal");
        const _modalElement = document.createElement(element);
        _modalElement.setAttribute("data-target", "app-modal.modalElement");
        _appModal.appendChild(_modalElement);
        this.appendChild(_appModal);
    };

    createMainRoot = () => {
        if (this.mainRoot) this.removeChild(this.mainRoot);
        const _mainRoot = document.createElement("app-root");
        _mainRoot.setAttribute("data-target", "app-main.mainRoot");
        this.appendChild(_mainRoot);
        return _mainRoot;
    };

    closeModal = () => {
        if (this.appModal) this.removeChild(this.appModal);
    };

    get isAuth(): boolean {
        return this.authStore && this.authStore.token;
    }
}

export type { AppMainElement };
