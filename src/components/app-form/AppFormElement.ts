import { TemplateResult, attr, controller, target } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { AppDropdownElement } from 'components/app-dropdown/AppDropdownElement';
import { InputFieldElement } from 'components/input-field/InputFieldElement';
import { findMethod, querys } from 'core/utils';
import { AppFormElementTemplate } from 'components/app-form';

@controller('app-form')
class AppFormElement extends BaseComponentElement {
	@target formElement: HTMLElement;
	@target innerSlot: HTMLElement;
	@querys inputField: NodeListOf<InputFieldElement>;
	@querys appDropdown: NodeListOf<AppDropdownElement>;
	@attr custom: string;
	@attr renderInput: string;
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

	get customRender() {
		return findMethod(this.renderInput, this.appMain);
	}

	public inputChange = (e) => {
		this.validate();
		this.update();
	};

	public onSubmit = (e) => {
		//e.preventDefault();
		if (!this.isValid) {
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
			formObject[input.name] = input._value;
		});
		return formObject;
	}

	set = (data): any => {
		for (let i = 0; i < this.inputField.length; i++) {
			const input = this.inputField[i];
			if (data?.[input.name]) {
				input._value = data[input.name];
				this.update();
			}
		}
		this.appDropdown?.forEach((input: AppDropdownElement) => {
			if (data?.[input.name]) {
				input.setValue(data[input.name]);
				this.update();
			}
		});
	};

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

	elementConnected = (): void => {
		if (this.renderInput) {
			this.update();
		} else {
			const _template = document.createElement('template');
			const _slot = this.innerHTML;
			_template.innerHTML = _slot;
			this.update();
			this.formElement?.replaceChild(_template.content, this.innerSlot);
		}
	};

	render = (): TemplateResult =>
		AppFormElementTemplate({
			renderInput: this.renderInput,
			customRender: this.customRender,
			error: this.error,
			isValid: this.isValid,
			hasCancel: this.hasCancel,
		});
}

export type { AppFormElement };
