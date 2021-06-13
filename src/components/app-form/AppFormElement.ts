import { attr, controller, target } from '@github/catalyst';
import { html, TemplateResult } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { AppDropdownElement } from 'components/app-dropdown/AppDropdownElement';
import { InputFieldElement } from 'components/input-field/InputFieldElement';
import { findMethod, isTrue, querys } from 'core/utils';

@controller
class AppFormElement extends BaseComponentElement {
	@target formElement: HTMLElement;
	@target innerSlot: HTMLElement;
	@querys inputField: NodeListOf<InputFieldElement>;
	@querys appDropdown: NodeListOf<AppDropdownElement>;
	@attr custom: string;
	@attr hasCancel: string;
	slotted: any;
	isValid: boolean = false;
	error: string;
	constructor() {
		super();
	}

	get submitFunc() {
		return findMethod(this.custom, this.appMain);
	}

	public inputChange = (e) => {
		this.validate();
		this.update();
	};

	public onSubmit = (e) => {
		e.preventDefault();
		if (!this.valid) {
			return;
		}
		this.submitFunc?.(this.values);
		return false;
	};

	public validate = () => {
		const validArr = [];
		this.inputField?.forEach((input) => {
			validArr.push(input?.validate());
		});
		this.appDropdown?.forEach((input) => {
			validArr.push(input?.validate());
		});
		this.isValid = !validArr?.includes(false);
	};

	public setError = (error) => {
		this.error = error;
		this.update();
	};

	public goBack = (e) => {
		e.preventDefault();

		if (this.appMain?.appModal) {
			this.appMain?.closeModal?.();
		} else if (this.routerService?.canGoBack) {
			this.routerService?.goBack();
		} else {
			this.routerService?.goTo('/');
		}
	};

	get values(): any {
		const formObject: any = {};
		this.inputField.forEach((input: InputFieldElement) => {
			formObject[input.name] = input._value;
		});
		this.appDropdown?.forEach((input: AppDropdownElement) => {
			if (input.required && input.value) {
				formObject[input.name] = input._value;
			}
		});
		return formObject;
	}

	getInput = (name: string): InputFieldElement | AppDropdownElement => {
		let formObject;
		this.inputField.forEach((input: InputFieldElement) => {
			const inputType = input;
			if (inputType.name === name) formObject = inputType;
		});
		this.appDropdown.forEach((input: AppDropdownElement) => {
			const inputType = input;
			if (inputType.name === name) formObject = inputType;
		});
		return formObject;
	};

	get valid() {
		let _valid = 0;
		this.inputField?.forEach((input) => {
			if (input.required && (input.inp as HTMLSelectElement).value) {
				_valid++;
			}
		});
		return _valid == this.inputField?.length;
	}

	elementConnected = (): void => {
		const _template = document.createElement('template');
		const _slot = this.innerHTML;
		_template.innerHTML = _slot;
		this.innerHTML = null;
		this.update();

		this.formElement.replaceChild(_template.content, this.innerSlot);
	};

	render = (): TemplateResult => {
		const renderSubmit = (valid: boolean) => {
			if (!valid) {
				return html`
					<button class="btn btn-squared btn-primary --submit disabled" type="submit" disabled>Submit</button>
				`;
			}
			return html` <button class="btn btn-squared btn-primary --submit" type="submit">Submit</button> `;
		};
		const renderError = (error: string) => {
			if (error) {
				return html`<span>${error}</span>`;
			}
			return html``;
		};
		const renderCancel = (hasCancel: boolean) => {
			if (hasCancel) {
				return html`<button class="btn btn-squared btn-red --cancel" type="button" app-action="click:app-form#goBack">
					Cancel
				</button>`;
			}
			return html``;
		};

		return html`
			<div class="app-form">
				<form app-action="submit:app-form#onSubmit" data-target="app-form.formElement">
					<slot data-target="app-form.innerSlot"></slot>
					${renderError(this.error)}
					<div class="form-buttons">
						<div class="button-content">${renderSubmit(this.isValid)}${renderCancel(isTrue(this.hasCancel))}</div>
					</div>
				</form>
			</div>
		`;
	};
}

export type { AppFormElement };
