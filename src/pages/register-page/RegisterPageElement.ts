import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue } from "core/utils";
import { html, render, until } from "@github/jtml";
import { AuthService, PingService } from "services/";
import { AppMainElement, InputFieldElement } from "components/";

@controller
class RegisterPageElement extends HTMLElement {
    @targets inputs: Array<InputFieldElement>;
    @closest appMain: AppMainElement;
    authService: AuthService;
    constructor() {
        super();
    }
    @update
    connectedCallback() {
        this.authService = new AuthService(this.appMain.appService);
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
            const response = await this.appMain.authStore.userRegister(
                this.values
            );

            if (response?.id) {
                this.appMain.routerService.goTo("/login");
            }
        } catch (err) {}
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
                    data-type="text"
                    data-name="username"
                    data-label="Username"
                    data-targets="register-page.inputs"
                    data-rules="required"
                ></input-field>
                <input-field
                    data-type="email"
                    data-name="email"
                    data-label="E-mail"
                    data-targets="register-page.inputs"
                    data-rules="required|isEmail"
                ></input-field>
                <input-field
                    data-type="password"
                    data-name="password"
                    data-label="Password"
                    data-targets="register-page.inputs"
                    data-rules="required"
                >
                </input-field>
                <button
                    type="button"
                    data-action="click:register-page#onSubmit"
                >
                    Register
                </button>
            </form>
        `;
    }

    update() {
        render(this.render(), this);
    }
}