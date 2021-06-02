import { controller } from "@github/catalyst";
import { closest, update } from "core/utils";
import { AuthService } from "services/";
import { AppMainElement } from "components/";
import { BasePageElement } from "common/";

@controller
class LogoutPageElement extends BasePageElement {
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
