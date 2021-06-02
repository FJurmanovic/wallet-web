import { controller, target } from "@github/catalyst";
import { closest } from "core/utils";
import { AppService, HttpClient, RouterService } from "core/services";
import { AuthStore } from "core/store";
import { BaseComponentElement } from "common/";

@controller
class AppMainElement extends BaseComponentElement {
    public routerService: RouterService;
    public authStore: AuthStore;
    private httpClient: HttpClient;
    public appService: AppService;
    @target appModal;
    @target mainRoot;

    constructor() {
        super();
    }
    elementConnected = () => {
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
                path: "/register",
                component: "register-page",
                layout: "menu-layout",
                middleware: this.isAuth,
            },
            {
                path: "/login",
                component: "login-page",
                layout: "menu-layout",
                middleware: this.isAuth,
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
    };

    middleAuth = () => {
        if (!this.isAuth) {
            this.routerService.goTo("/unauthorized");
            return true;
        }
    };

    createModal = (element: string) => {
        this.closeModal();

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
    };

    isAuth = (): boolean => {
        return this.authStore && this.authStore.token;
    };
}

export type { AppMainElement };
