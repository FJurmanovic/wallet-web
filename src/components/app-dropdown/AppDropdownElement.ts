import { attr, controller, target } from "@github/catalyst";
import { firstUpper } from "core/utils";
import { html, TemplateResult } from "@github/jtml";
import { RouterService } from "core/services";
import randomId from "core/utils/random-id";
import validator from "validator";
import { validatorErrors } from "core/constants";
import { BaseComponentElement } from "common/";

@controller
class AppDropdownElement extends BaseComponentElement {
    @attr name: string;
    @attr type: string;
    @attr label: string;
    @attr rules: string;
    @target main: HTMLElement;
    @target inp: HTMLElement;
    error: string;
    randId: string;
    constructor() {
        super();
    }

    public elementConnected = (): void => {
        this.randId = `${name}${randomId()}`;
        this.update();
    };

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

    render = (): TemplateResult => {
        return html``;
    };
}

export type { AppDropdownElement };
