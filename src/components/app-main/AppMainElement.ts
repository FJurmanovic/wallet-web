import { controller, target } from "@github/catalyst";
import { AppService, HttpClient, RouterService } from "core/services";
import { AuthStore } from "core/store";
import { AppModalElement, AppRootElement } from "components/";
import { closest } from "core/utils";

@controller
class AppMainElement extends HTMLElement {
    public routerService: RouterService;
    public authStore: AuthStore;
    private httpClient: HttpClient;
    public appService: AppService;
    @target appModal: AppModalElement;
    @target mainRoot: AppRootElement;
    @closest appMain: AppMainElement;

    constructor() {
        super();
    }
    connectedCallback() {
        if (this.appMain !== this) return;
        const mainRoot = this.createMainRoot();
        this.httpClient = new HttpClient();
        this.appService = new AppService(this, this.httpClient);
        this.routerService = new RouterService(this, mainRoot);
        this.authStore = new AuthStore(this, this.appService);
        this.routerService.setRoutes([
            {
                path: "/",
                component: "home-page",
                layout: "menu-layout",
                middleware: this.isAuth,
            },
            {
                path: "/home",
                component: "home-page",
                layout: "menu-layout",
                middleware: this.isAuth,
            },
            {
                path: "/history",
                component: "history-page",
                layout: "menu-layout",
                middleware: this.isAuth,
            },
            {
                path: "/wallet",
                component: "history-page",
                layout: "menu-layout",
                middleware: this.isAuth,
                children: [
                    {
                        path: "/all",
                        component: "wallet-list",
                        layout: "menu-layout",
                    },
                    {
                        path: "/:walletId",
                        component: "history-page",
                        layout: "menu-layout",
                    },
                ],
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
                path: "/not-found",
                component: "not-found",
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
        this.closeModal();
        this.appMain.addEventListener("routechanged", this.closeModal);

        const _appModal = this.createAppModal();
        const _modalContent = this.createModalContent(element);
        const _modalOverlay = this.createModalOverlay();

        _modalOverlay.appendChild(_modalContent);
        _appModal.appendChild(_modalOverlay);
        this.appendChild(_appModal);
    };

    private createAppModal = () => {
        const _appModal = document.createElement("app-modal");
        _appModal.setAttribute("data-target", "app-main.appModal");
        return _appModal;
    };

    private createModalContent = (element: string) => {
        const _modalElement = document.createElement(element);
        const _divEl = document.createElement("div");
        _modalElement.setAttribute("data-target", "app-modal.modalElement");
        _modalElement.setAttribute(
            "data-action",
            "click:app-main#preventClosing"
        );
        _divEl.setAttribute("data-target", "app-modal.modalContent");
        _divEl.appendChild(_modalElement);
        return _divEl;
    };

    private createModalOverlay = () => {
        const _divOverlay = document.createElement("div");
        _divOverlay.setAttribute("data-target", "app-modal.modalOverlay");
        _divOverlay.setAttribute("data-action", "click:app-main#closeModal");
        return _divOverlay;
    };

    private createMainRoot = () => {
        if (this.mainRoot) this.removeChild(this.mainRoot);
        const _mainRoot = document.createElement("app-root");
        _mainRoot.setAttribute("data-target", "app-main.mainRoot");
        this.appendChild(_mainRoot);
        return _mainRoot;
    };

    preventClosing = (e: Event) => {
        e.stopPropagation();
    };

    closeModal = () => {
        if (this.appModal) this.removeChild(this.appModal);
        this.appMain.removeEventListener("routechanged", this.closeModal);
    };

    isAuth = (): boolean => {
        return this.authStore && !!this.authStore.token;
    };
}

export type { AppMainElement };
