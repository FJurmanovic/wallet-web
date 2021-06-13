import { attr, controller, target } from '@github/catalyst';
import { closest, firstUpper } from 'core/utils';
import { html, TemplateResult } from 'core/utils';
import randomId from 'core/utils/random-id';
import { validatorErrors } from 'core/constants';
import { BaseComponentElement, Validator } from 'common/';
import { AppFormElement } from 'components/app-form/AppFormElement';
import { validator } from 'core/utils';

@controller
class InputFieldElement extends BaseComponentElement {
	@attr name: string;
	@attr type: string;
	@attr label: string;
	@attr rules: string;
	@target main: HTMLElement;
	@target inp: HTMLElement;
	@closest appForm: AppFormElement;
	valid: boolean;
	displayError: boolean;
	randId: string;

	validator: Validator;

	constructor() {
		super();
	}

	public elementConnected = (): void => {
		this.validator = new Validator(this, this.appForm, this.rules);
		this.randId = `${name}${randomId()}`;
		this.update();
		this.validate();
	};

	setError = (error) => {
		this.validator.error = error;
	};

	get error(): string {
		return this.validator.error;
	}

	get isValid(): boolean {
		return this.validator.valid;
	}

	get required(): boolean {
		return this.rules.includes('required');
	}

	get _value() {
		return (this.inp as HTMLInputElement)?.value;
	}

	validate = (): boolean => {
		return this.validator.validate();
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
				return html`<label for="${this.randId}">${this.label}${this.required ? ' (*)' : ''}</label>`;
			}
			return html``;
		};

		const renderError = (error: string) => {
			if (error) {
				return html`<div class="input-error"><span>${error}</span></div>`;
			}
			return html``;
		};

		const renderInput = (type) => {
			return html` <input
				type="${this.type}"
				data-target="input-field.inp"
				id="${this.randId}"
				app-action="
                    input:input-field#inputChange
                    blur:input-field#validateDisplay
                "
			/>`;
		};

		return html`<div class="input-main" data-target="input-field.main">
			${renderMessage(this.label)}${renderError(this.error)} ${renderInput(this.type)}
		</div>`;
	};
}

export type { InputFieldElement };
