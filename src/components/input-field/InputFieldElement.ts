import { closest, attr, controller, target, html, TemplateResult } from 'core/utils';
import randomId from 'core/utils/random-id';
import { BaseComponentElement, Validator } from 'common/';
import { AppFormElement } from 'components/app-form/AppFormElement';
import { InputFieldElementTemplate } from 'components/input-field';

@controller('input-field')
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
	@attr disabled: string;
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
	};

	attributeChangedCallback() {
		this.update();
	}

	setError = (error) => {
		this.validator.error = error;
	};

	get error(): string {
		return this.validator?.error;
	}

	get isValid(): boolean {
		return this.validator.valid;
	}

	get required(): boolean {
		return this.rules?.includes('required');
	}

	get _value() {
		if (this.type == 'checkbox') {
			return (this.inp as HTMLInputElement)?.checked;
		}
		return (this.inp as HTMLInputElement)?.value;
	}

	get _disabled() {
		return this.disabled == 'true';
	}

	set _value(value) {
		if (this.type == 'checkbox') {
			(this.inp as HTMLInputElement).checked = value as boolean;
		} else {
			(this.inp as HTMLInputElement).value = value as string;
		}
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
		this.appForm?.inputChange(e);
	};

	render = (): TemplateResult =>
		InputFieldElementTemplate({
			randId: this.randId,
			required: this.required,
			pattern: this.pattern,
			_disabled: this._disabled,
			customAction: this.customAction,
			type: this.type,
			error: this.error,
			label: this.label,
		});
}

export type { InputFieldElement };
