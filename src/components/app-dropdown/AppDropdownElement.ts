import { attr, controller, target } from '@github/catalyst';
import { findMethod, firstUpper } from 'core/utils';
import { html } from 'lit-html';
import randomId from 'core/utils/random-id';
import validator from 'validator';
import { validatorErrors } from 'core/constants';
import { BaseComponentElement } from 'common/';

@controller
class AppDropdownElement extends BaseComponentElement {
	@attr name: string;
	@attr label: string;
	@attr rules: string;
	@target main: HTMLElement;
	@target inp: HTMLElement;
	@attr displaykey: string = 'name';
	@attr valuekey: string = 'id';
	@attr fetch: string;
	fetchFunc: any;

	error: boolean;
	errorMessage: string;

	searchPhrase: string;

	randId: string;
	value: string;

	@attr isOpen: boolean = false;

	items: Array<any>;
	totalItems: number;
	page: number = 1;
	rpp: number = 30;

	constructor() {
		super();
	}
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
		const { value, valuekey, items } = this;
		const item = items?.find((item) => {
			return value == item[valuekey];
		});

		console.log(item, value, valuekey);

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

	attributeChangedCallback(): void {
		this.update();
	}

	get valid(): boolean {
		return !!this.error;
	}

	get required(): boolean {
		return this.rules.includes('required');
	}

	validate(): boolean {
		let _return = true;
		const rules = this.rules?.split('|').filter((a) => a);
		const value = (this.inp as HTMLSelectElement)?.value;
		rules
			.slice()
			.reverse()
			.forEach((rule) => {
				let valid = true;
				if (rule == 'required') {
					if (value === '') valid = false;
				} else {
					if (validator.hasOwnProperty(rule)) {
						valid = validator?.[rule]?.(value);
					}
				}
				if (!valid) {
					const error = validatorErrors[rule]?.replaceAll('{- name}', firstUpper(this.name?.toString()));
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

	openDropdown = () => {
		this.isOpen = true;
	};

	stopPropagation = (e) => {
		e.stopPropagation();
	};

	toggleDropdown = () => {
		const isOpen = this.isOpen;
		this.isOpen = !isOpen;
	};

	itemSelected = (e) => {
		const value = (e.target as HTMLSpanElement).getAttribute('data-value');
		this.value = value;
		this.isOpen = false;
	};

	get _value() {
		return this.value;
	}

	render = () => {
		const { label, error, errorMessage, isOpen, searchPhrase, items, selectedItem, displaykey, valuekey } = this;

		console.log(isOpen);

		const renderItem = (item) => {
			return html` <li
				class="dropdown-custom-listitem ${selectedItem?.[valuekey] == item[valuekey] ? '--selected' : ''}"
				app-action="click:app-dropdown#itemSelected"
				data-value="${item[valuekey]}"
			>
				${item[displaykey]}
			</li>`;
		};

		const renderItems = (_items) => {
			return _items.map((item) => renderItem(item));
		};

		return html`
			<div>
				<label app-action="click:app-dropdown#openDropdown">
					${label ? html`<div>${label}</div>` : html``}
					<div class="dropdown-custom" app-action="click:app-dropdown#stopPropagation">
						<div class="dropdown-custom-top" app-action="click:app-dropdown#toggleDropdown">
							<span class="dropdown-custom-fieldname">${selectedItem ? selectedItem[displaykey] : 'Select'}</span>
						</div>
						${isOpen
							? html`
									<div class="dropdown-custom-open">
										<input
											class="dropdown-custom-search"
											type="text"
											value="${searchPhrase}"
											app-action="input:app-dropdown#phraseChange"
											autofocus
										/>
										<ul class="dropdown-custom-list">
											${renderItems(items)}
										</ul>
									</div>
							  `
							: html``}
					</div>
					${error ? html` <div class="h5 text-red">${errorMessage}</div>` : html``}
				</label>
			</div>
		`;
	};
}

export type { AppDropdownElement };
