import { attr, controller, target } from "@github/catalyst";
import { findMethod, firstUpper } from "core/utils";
import { html, TemplateResult } from "@github/jtml";
import { RouterService } from "core/services";
import randomId from "core/utils/random-id";
import validator from "validator";
import { validatorErrors } from "core/constants";
import { BaseComponentElement } from "common/";

@controller
class AppDropdownElement extends BaseComponentElement {
    @attr name: string;
    @attr label: string;
    @attr rules: string;
    @target main: HTMLElement;
    @target inp: HTMLElement;
    @attr displaykey: string;
    @attr valuekey: string;
    @attr fetch: string;
    fetchFunc: any;
    error: string;
    randId: string;

    items: Array<any>;
    totalItems: number;
    page: number = 1;
    rpp: number = 30;

    constructor() {
        super();
    }
    getItems = async (options?: any): Promise<void> => {
        if (typeof this.fetchFunc !== "function") return;
        try {
            const response = await this.fetchFunc(options);
            this.setItems(response);
        } catch (err) {
            this.update();
        }
    };

    setItems = (response): void => {
        if (response) {
            let items = [];
            if (Array.isArray(response)) {
                items = response;
            } else if (Array.isArray(response.items)) {
                items = response.items;
                this.totalItems = response?.totalRecords;
            } else {
                items = [];
            }
            this.items = items;
            this.renderOptions(items);
            this.renderOptions(items);
        }
    };

    private renderOptions = (items) => {
        const displayKey = this.displaykey || "name";
        const valueKey = this.valuekey || "id";

        const options = items?.map((item) => {
            const val = { name: item[displayKey], value: item[valueKey] };
            if (
                this.optionValues.some((value) => {
                    if (value.name == val.name && value.value == val.value) {
                        return true;
                    }
                    return false;
                })
            )
                return;
            const _option = document.createElement("option");
            _option.setAttribute("value", val.value);
            _option.innerText = val.name;
            this.inp?.appendChild(_option);
        });
    };

    get optionValues() {
        let values = [];
        this.inp.childNodes.forEach((item: HTMLElement) => {
            const value = item.getAttribute("value");
            const name = item.innerText;
            values.push({ name, value });
        });
        return values;
    }

    onChange = () => {
        this.renderOptions(this.items);
    };

    public elementConnected = (): void => {
        this.randId = `${name}${randomId()}`;
        this.fetchFunc = findMethod(this.fetch, this.appMain);
        this.update();

        const options = {
            rpp: this.rpp,
            page: this.page,
        };
        this.getItems(options);
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
        const value = (this.inp as HTMLSelectElement)?.value;
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
        return html`<div class="input-main" data-target="app-dropdown.main">
            <select
                data-target="app-dropdown.inp"
                data-action="change:app-dropdown#onChange"
            ></select>
        </div>`;
    };
}

export type { AppDropdownElement };
