import { attr, targets, controller, target } from "@github/catalyst";
import { closest, index, update, isTrue, firstUpper } from "core/utils";
import { html, render, until } from "@github/jtml";
import { PingService } from "services/";
import { AppMainElement } from "components/app-main/AppMainElement";
import { RouterService } from "core/services";
import randomId from "core/utils/random-id";
import validator from "validator";
import { validatorErrors } from "core/constants";

@controller
class InputFieldElement extends HTMLElement {
    @closest appMain: AppMainElement;
    @attr name: string;
    @attr type: string;
    @attr label: string;
    @attr rules: string;
    @target main: HTMLElement;
    @target inp: HTMLElement;
    error: string;
    randId: string;
    routerService: RouterService;
    constructor() {
        super();
    }

    public connectedCallback(): void {
        this.randId = `${name}${randomId()}`;
        this.update();
    }

    get valid(): boolean {
        return !!this.error;
    }

    get required(): boolean {
        return this.rules.includes("required");
    }

    validate(): boolean {
        let _return = true;
        const rules = this.rules?.split("|").filter((a) => a);
        const value = (this.inp as HTMLInputElement)?.value;
        rules
            .slice()
            .reverse()
            .forEach((rule) => {
                let valid = true;
                if (rule == "required") {
                    if (value === "") valid = false;
                } else {
                    if (validator.hasOwnProperty(rule)) {
                        valid = validator?.[rule]?.(value);
                    }
                }
                if (!valid) {
                    const error = validatorErrors[rule]?.replaceAll(
                        "{- name}",
                        firstUpper(this.name?.toString())
                    );
                    _return = false;
                    this.error = error;
                }
            });
        if (_return) {
            this.error = null;
        }
        this.update();
        return _return;
    }

    render = () => {
        return html`<div data-target="input-field.main">
            ${this.label &&
            html`<label for="${this.randId}"
                >${this.label}${this.required ? " (*)" : ""}</label
            >`}
            <input type="${this.type}" data-target="input-field.inp" />
            ${this.error && html`<span>${this.error}</span>`}
        </div>`;
    };

    update = () => {
        render(this.render(), this);
    };
}

export type { InputFieldElement };
