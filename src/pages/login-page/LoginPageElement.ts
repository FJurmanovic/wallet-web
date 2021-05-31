import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { AuthService, PingService } from "services/";
import { AppMainElement, InputFieldElement } from "components/";
import { RouterService } from "core/services";

@controller
class LoginPageElement extends HTMLElement {
    @targets inputs: Array<InputFieldElement>;
    @closest appMain: AppMainElement;
    authService: AuthService;
    routerService: RouterService;
    constructor() {
        super();
    }
    @update
    connectedCallback() {
        this.authService = new AuthService(this.appMain.appService);
        this.routerService = this.appMain.routerService;
    }

    get emailInput() {
        for (const i in this.inputs) {
            if (this.inputs[i]?.name == "email") {
                return this.inputs[i];
            }
        }
    }

    get passwordInput() {
        for (const i in this.inputs) {
            if (this.inputs[i]?.name == "password") {
                return this.inputs[i];
            }
        }
    }

    get values(): Object {
        const formObject = {};
        this.inputs.forEach((input: InputFieldElement) => {
            const inputType = input.inp;
            formObject[input.name] = (inputType as HTMLInputElement).value;
        });
        return formObject;
    }

    onSubmit = async () => {
        try {
            if (!this.validate()) {
                return;
            }
            const response = await this.appMain.authStore.userLogin(
                this.values
            );

            if (response?.token) {
                console.log(this.appMain);
                this.routerService.goTo("/");
            }
        } catch (err) {
            if (err?.errorCode == 400103) {
                this.emailInput.error = err?.message;
                this.emailInput.update();
            } else if (err?.errorCode == 400104) {
                this.passwordInput.error = err?.message;
                this.passwordInput.update();
            }
        }
    };

    validate(): boolean {
        let _return = true;
        this.inputs.forEach((input: InputFieldElement) => {
            const valid: boolean = input.validate();
            if (!valid) _return = false;
        });
        return _return;
    }

    render() {
        return html`
            <form>
                <input-field
                    data-type="email"
                    data-name="email"
                    data-label="E-mail"
                    data-targets="login-page.inputs"
                    data-rules="required|isEmail"
                ></input-field>
                <input-field
                    data-type="password"
                    data-name="password"
                    data-label="Password"
                    data-targets="login-page.inputs"
                    data-rules="required"
                >
                </input-field>
                <button type="button" data-action="click:login-page#onSubmit">
                    Login
                </button>
            </form>
            <div>
                <app-link
                    data-to="/register"
                    data-title="Create new account"
                ></app-link>
            </div>
        `;
    }

    update() {
        render(this.render(), this);
    }
}
