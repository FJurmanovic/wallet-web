import { closest, findMethod, attr, controller, target } from 'core/utils';
import randomId from 'core/utils/random-id';
import { BaseComponentElement, Validator } from 'common/';
import { AppFormElement } from 'components/app-form/AppFormElement';
import { AppDropdownElementTemplate } from 'components/app-dropdown';

@controller('app-dropdown')
class AppDropdownElement extends BaseComponentElement {
	@attr name: string;
	@attr label: string;
	@attr rules: string;
	@target main: HTMLElement;
	@target inp: HTMLElement;
	@target dropdowncontainer: HTMLElement;
	@attr displaykey: string = 'name';
	@attr valuekey: string = 'id';
	@attr fetch: string;
	@closest appForm: AppFormElement;

	errorMessage: string;

	searchPhrase: string;

	randId: string;
	value: string;

	@attr isOpen: boolean = false;

	items: Array<any>;
	totalItems: number;
	page: number = 1;
	rpp: number = 30;
	validator: Validator;
	itemValue: any = null;

	constructor() {
		super();
	}

	updateCallback = () => {
		this.dropdowncontainer?.scrollIntoView();
	};

	public elementConnected = (): void => {
		this.validator = new Validator(this, this.appForm, this.rules);
		this.randId = `${name}${randomId()}`;
		this.update();
		this.appMain?.addEventListener('click', this.outsideClick);
		this.elementDisconnectCallbacks.push((appMain) => {
			appMain.removeEventListener('click', this.outsideClick);
		});

		const options = {
			rpp: this.rpp,
			page: this.page,
		};
		this.getItems(options);
	};

	elementDisconnected = (): void => {};

	outsideClick = (e) => {
		this.closeDropdown(e);
	};

	attributeChangedCallback(): void {
		this.update();
	}

	setError = (error) => {
		this.validator.error = error;
	};

	get error(): string {
		return this.validator?.error;
	}

	get isValid(): boolean {
		return this.validator?.valid;
	}

	get required(): boolean {
		return this.rules?.includes('required');
	}

	get _value() {
		return this.value;
	}

	validate = (change = false): boolean => {
		return this.validator.validate();
	};

	getItems = async (options?: any): Promise<void> => {
		if (typeof this.fetchFunc !== 'function') return;
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
			this.update();
		}
	};

	get selectedItem() {
		const { value, valuekey, items, itemValue } = this;
		if (itemValue) {
			return itemValue;
		}
		const item = items?.find((item) => {
			return value == item[valuekey];
		});

		return item;
	}

	get optionValues() {
		let values = [];
		this.inp.childNodes.forEach((item: HTMLElement) => {
			const value = item.getAttribute('value');
			const name = item.innerText;
			values.push({ name, value });
		});
		return values;
	}

	get fetchFunc() {
		return findMethod(this.fetch, this.appMain);
	}

	setOpen = (isOpen) => {
		this.isOpen = isOpen;
		if (!isOpen) {
			const active = this.appMain.activeElement;
			if (active.closest('app-link') || active.closest('a') || active.closest('button')) return;
			this.validate();
			this.update();
		}
	};

	openDropdown = (e?) => {
		if (e?.target?.closest('app-dropdown > .dropdown-custom')?.randId == this.randId) return;
		this.setOpen(true);
	};

	closeDropdown = (e?) => {
		if (e?.target?.closest('app-dropdown')?.randId == this.randId) return;
		if (!this.isOpen) return;
		this.setOpen(false);
	};

	stopPropagation = (e) => {
		e.stopPropagation();
	};

	toggleDropdown = () => {
		const isOpen = this.isOpen;
		this.setOpen(!isOpen);
	};

	itemSelected = (e) => {
		const value = (e.target as HTMLSpanElement).getAttribute('data-value');
		this.itemValue = null;
		this.setValue(value);
		this.setOpen(false);
		this.appForm?.inputChange(e);
	};

	setValue = (value) => {
		this.value = value;
		this.update();
	};

	setItemValue = (itemValue) => {
		this.itemValue = itemValue;
		this.update();
	};

	render = () =>
		AppDropdownElementTemplate({
			label: this.label,
			error: this.error,
			randId: this.randId,
			required: this.required,
			isOpen: this.isOpen,
			searchPhrase: this.searchPhrase,
			items: this.items,
			selectedItem: this.selectedItem,
			displaykey: this.displaykey,
			valuekey: this.valuekey,
		});
}

export type { AppDropdownElement };
