import { attr, controller, target } from "@github/catalyst";
import { closest, firstUpper } from "core/utils";
import { html, TemplateResult } from "lit-html";
import { RouterService } from "core/services";
import randomId from "core/utils/random-id";
import validator from "validator";
import { validatorErrors } from "core/constants";
import { BaseComponentElement } from "common/";
import { AppFormElement } from "components/app-form/AppFormElement";

@controller
class InputFieldElement extends BaseComponentElement {
    @attr name: string;
    @attr type: string;
    @attr label: string;
    @attr rules: string;
    @target main: HTMLElement;
    @target inp: HTMLElement;
    @closest appForm: AppFormElement;
    error: string;
    displayError: boolean;
    randId: string;
    constructor() {
        super();
    }

    public elementConnected = (): void => {
        this.randId = `${name}${randomId()}`;
        this.update();
        this.validate();
    };

    get valid(): boolean {
        return !!this.error;
    }

    get required(): boolean {
        return this.rules.includes("required");
    }

    get _value() {
        return (this.inp as HTMLInputElement)?.value;
    }

    validate = (): boolean => {
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
        return _return;
    };

    validateDisplay = () => {
        if (!this.validate()) {
            this.displayError = true;
        } else {
            this.displayError = false;
        }
        this.update();
    };

    inputChange = (e) => {
        this.validate();
        this.appForm?.inputChange(e);
    };

    render = (): TemplateResult => {
        const renderMessage = (label: string) => {
            if (this.label) {
                return html`<label for="${this.randId}"
                    >${this.label}${this.required ? " (*)" : ""}</label
                >`;
            }
            return html``;
        };

        const renderError = (displayError: boolean, error: string) => {
            if (displayError) {
                return html`<span>${error}</span>`;
            }
            return html``;
        };

        const renderInput = (type) => {
            return html` <input
                type="${this.type}"
                data-target="input-field.inp"
                app-action="
                    input:input-field#inputChange
                    blur:input-field#validateDisplay
                "
            />`;
        };

        return html`<div class="input-main" data-target="input-field.main">
            ${renderMessage(this.label)} ${renderInput(this.type)}
            ${renderError(this.displayError, this.error)}
        </div>`;
    };
}

export type { InputFieldElement };
