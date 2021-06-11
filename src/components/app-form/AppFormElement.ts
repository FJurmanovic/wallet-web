import { attr, controller, target } from '@github/catalyst';
import { html, TemplateResult, unsafeHTML } from 'lit-html';
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

	public inputChange = (e) => {
		this.validate();
		this.update();
	};

	public onSubmit = (e) => {
		e.preventDefault();
		if (!this.valid) {
			return;
		}
		const actionString = this.custom;
		const submitFunc = findMethod(actionString, this.appMain);
		submitFunc?.(this.values);
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
		const renderCancel = (hasCancel: boolean) => {
			if (hasCancel) {
				return html`<button type="button" app-action="click:app-form#goBack">Cancel</button>`;
			}
			return html``;
		};

		return html`<form app-action="submit:app-form#onSubmit" data-target="app-form.formElement">
			<slot data-target="app-form.innerSlot"></slot>
			${renderError(this.error)}${renderSubmit(this.isValid)}${renderCancel(isTrue(this.hasCancel))}
		</form>`;
	};
}

export type { AppFormElement };
