import { targets, controller } from "@github/catalyst";
import { html, TemplateResult } from "@github/jtml";
import { AuthService } from "services/";
import { InputFieldElement } from "components/";
import { RouterService } from "core/services";
import { BasePageElement } from "common/";

@controller
class LoginPageElement extends BasePageElement {
    @targets inputs: Array<InputFieldElement>;
    authService: AuthService;
    errorMessage: string;
    constructor() {
        super();
    }
    elementConnected = (): void => {
        this.authService = new AuthService(this.appMain.appService);
        this.update();
    };

    get emailInput(): InputFieldElement {
        for (const i in this.inputs) {
            if (this.inputs[i]?.name == "email") {
                return this.inputs[i];
            }
        }
    }

    get passwordInput(): InputFieldElement {
        for (const i in this.inputs) {
            if (this.inputs[i]?.name == "password") {
                return this.inputs[i];
            }
        }
    }

    get values(): Object {
        const formObject: any = {};
        this.inputs.forEach((input: InputFieldElement) => {
            const inputType = input.inp;
            formObject[input.name] = (inputType as HTMLInputElement).value;
        });
        return formObject;
    }

    onSubmit = async (): Promise<void> => {
        try {
            if (!this.validate()) {
                return;
            }
            const response = await this.appMain.authStore.userLogin(
                this.values
            );

            if (response?.token) {
                this.routerService.goTo("/");
            }
        } catch (err) {
            if (err?.errorCode == 400103) {
                this.emailInput.error = err?.message;
                this.emailInput.update();
            } else if (err?.errorCode == 400104) {
                this.passwordInput.error = err?.message;
                this.passwordInput.update();
            } else {
                this.errorMessage = "Unable to log in!";
                this.update();
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

    render = (): TemplateResult => {
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
                ${this.errorMessage && html`<div>${this.errorMessage}</div>`}
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
    };
}

export type { LoginPageElement };
