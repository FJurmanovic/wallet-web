import { controller } from "@github/catalyst";
import { closest, update } from "core/utils";
import { AuthService } from "services/";
import { AppMainElement } from "components/";

@controller
class LogoutPageElement extends HTMLElement {
    @closest appMain: AppMainElement;
    authService: AuthService;
    constructor() {
        super();
    }
    connectedCallback() {
        this.authService = new AuthService(this.appMain.appService);
        this.appMain?.authStore?.userLogout();
        this.appMain?.routerService.goTo("/login");
    }
}
