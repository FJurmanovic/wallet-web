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
	@attr pattern: string;
	@attr customAction: string;
	@target main: HTMLElement;
	@target inp: HTMLElement;
	@closest appForm: AppFormElement;
	valid: boolean;
	displayError: boolean;
	randId: string;
	changed: boolean = false;

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
		const valid = this.validator.validate();
		if (valid && this.displayError) {
			this.displayError = false;
			this.update();
		} else if (this.changed && !valid) {
			this.displayError = true;
			this.update();
		}
		return valid;
	};

	validateDisplay = () => {
		const active = this.appMain.activeElement;
		if (active.closest('app-link') || active.closest('a') || active.closest('button')) return;
		if (!this.validate()) {
			this.displayError = true;
		} else {
			this.displayError = false;
		}
		this.update();
	};

	inputChange = (e) => {
		if (!this.changed && e?.target?.value) {
			this.changed = true;
		}
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
			if (this.pattern) {
				return html` <input
					type="${this.type}"
					pattern="${this.pattern}"
					step="0.01"
					data-target="input-field.inp"
					id="${this.randId}"
					app-action="
                    input:input-field#inputChange
                    blur:input-field#validateDisplay
					${this.customAction ? this.customAction : ''}
                "
				/>`;
			}
			return html` <input
				type="${this.type}"
				data-target="input-field.inp"
				id="${this.randId}"
				app-action="
                    input:input-field#inputChange
                    blur:input-field#validateDisplay
					${this.customAction ? this.customAction : ''}
                "
			/>`;
		};

		return html`<div class="input-main" data-target="input-field.main">
			${renderMessage(this.label)}${renderError(this.error)} ${renderInput(this.type)}
		</div>`;
	};
}

export type { InputFieldElement };
