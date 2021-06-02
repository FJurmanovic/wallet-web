import { AppMainElement } from "components/";
import { AppService } from "core/services";
import { AuthService } from "services/";

class AuthStore {
    private _token: string;
    private _userDetails: UserDetails;
    private authService: AuthService;
    private domEvents: any = {
        tokenchange: new Event("tokenchange"),
    };
    constructor(
        private appMain: AppMainElement,
        private appService: AppService
    ) {
        this.token = localStorage.getItem("token");
        this.authService = new AuthService(this.appService);
    }

    get token(): string {
        if (this._token == "null") return null;
        if (this._token == "undefined") return undefined;
        return this._token;
    }

    set token(token: string) {
        const { _token } = this;
        const _changed = token != _token;
        if (_changed) {
            this._token = token;
            localStorage.setItem("token", token);
            this.appMain.dispatchEvent(this.domEvents.tokenchange);
        }
    }

    get user(): UserDetails {
        return this._userDetails;
    }

    set user(userDetails: UserDetails) {
        this._userDetails = userDetails;
    }

    userLogin = async (formObject) => {
        try {
            const response = await this.authService.login(formObject);
            if (response?.token) {
                this.token = response.token;
            } else {
                this.token = null;
                localStorage.removeItem("token");
            }
            return response;
        } catch (err) {
            throw err;
        }
    };

    userRegister = async (formObject) => {
        try {
            const response = await this.authService.register(formObject);
            return response;
        } catch (err) {
            throw err;
        }
    };

    userLogout = (): void => {
        this.token = null;
        localStorage.removeItem("token");
    };
}

export default AuthStore;

export type UserDetails = {
    id: string;
    username: string;
    email: string;
    dateCreated: string;
    dateUpdated: string;
};
