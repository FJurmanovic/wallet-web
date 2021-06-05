import { attr, controller, target } from "@github/catalyst";
import { html, TemplateResult, unsafeHTML } from "@github/jtml";
import { BaseComponentElement } from "common/";
import { InputFieldElement } from "components/input-field/InputFieldElement";
import { querys } from "core/utils";

@controller
class AppFormElement extends BaseComponentElement {
    @target formElement: HTMLElement;
    @target innerSlot: HTMLElement;
    @querys inputField: NodeListOf<InputFieldElement>;
    @attr custom: string;
    slotted: any;
    isValid: boolean = false;
    error: string;
    constructor() {
        super();
    }

    public inputChange = (e) => {
        this.validate();
        this.update();
    };

    public keyUp = (e) => {
        if (e.keyCode === 13) {
            this.onSubmit(e);
        }
    };

    public onSubmit = (e) => {
        e.preventDefault();
        if (!this.valid) {
            return;
        }
        const actionString = this.custom;
        if (actionString) {
            const methodSep = actionString.lastIndexOf("#");
            const tag = actionString.slice(0, methodSep);
            const method = actionString.slice(methodSep + 1);

            const element = this.appMain.querySelector(tag);
            if (element) {
                element?.[method]?.(e);
            }
        }
        return false;
    };

    public validate = () => {
        this.isValid = true;
        this.inputField?.forEach((input) => {
            if (input?.error) {
                this.isValid = false;
            }
        });
    };

    public setError = (error) => {
        this.error = error;
        this.update();
    };

    public goBack = (e) => {
        e.preventDefault();
        this.routerService?.goBack();
    };

    get valid() {
        let _valid = 0;
        this.inputField?.forEach((input) => {
            if (input.required && (input.inp as HTMLInputElement).value) {
                _valid++;
            }
        });
        return _valid == this.inputField?.length;
    }

    elementConnected = (): void => {
        const _template = document.createElement("template");
        const _slot = this.innerHTML;
        _template.innerHTML = _slot;
        this.innerHTML = null;
        this.update();

        this.formElement.replaceChild(_template.content, this.innerSlot);
    };

    render = (): TemplateResult => {
        const renderSubmit = (valid: boolean) => {
            if (!valid) {
                return html` <button type="submit" disabled>Submit</button> `;
            }
            return html` <button type="submit">Submit</button> `;
        };
        const renderError = (error: string) => {
            if (error) {
                return html`<span>${error}</span>`;
            }
            return html``;
        };
        const renderCancel = () => {
            return html`<button
                type="button"
                data-action="click:app-form#goBack"
            >
                Cancel
            </button>`;
        };

        return html`<form
            data-action="submit:app-form#onSubmit"
            data-target="app-form.formElement"
        >
            <slot data-target="app-form.innerSlot"></slot>
            ${renderError(this.error)}${renderSubmit(
                this.isValid
            )}${renderCancel()}
        </form>`;
    };
}

export type { AppFormElement };
