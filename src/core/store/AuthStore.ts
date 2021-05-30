import { AppService } from "core/services";
import { AuthService } from "services/";

class AuthStore {
    private _token;
    private _userDetails;
    private authService: AuthService;
    constructor(private appService: AppService) {
        this.token = localStorage.getItem("token");
        this.authService = new AuthService(this.appService);
    }

    get token() {
        if (this._token == "null") return null;
        if (this._token == "undefined") return undefined;
        return this._token;
    }

    set token(token) {
        this._token = token;
        localStorage.setItem("token", token);
    }

    get user() {
        return this._userDetails;
    }

    set user(userDetails) {
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
}

export default AuthStore;
