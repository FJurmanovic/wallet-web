import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { label, error, randId, required, isOpen, searchPhrase, items, selectedItem, displaykey, valuekey } = props;

	const renderMessage = (label: string) => {
		if (label) {
			return html`<label app-action="click:app-dropdown#openDropdown">${label}${required ? ' (*)' : ''}</label>`;
		}
		return nothing;
	};

	const renderError = (error: string) => {
		if (error) {
			return html`<div class="input-error"><span>${error}</span></div>`;
		}
		return nothing;
	};

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
		return _items?.map((item) => renderItem(item));
	};

	return html`
		<div class="app-dropdown">
			${renderMessage(label)} ${renderError(error)}
			<div class="dropdown-custom">
				<div class="dropdown-custom-top${isOpen ? ' --open' : ''}" app-action="click:app-dropdown#toggleDropdown">
					<span class="dropdown-custom-fieldname">${selectedItem ? selectedItem[displaykey] : 'Select'}</span>
				</div>
				${isOpen
					? html`
							<div class="dropdown-custom-open" data-target="app-dropdown.dropdowncontainer">
								<input
									class="dropdown-custom-search"
									type="text"
									value="${searchPhrase || ''}"
									id="${randId}"
									app-action="input:app-dropdown#phraseChange"
									autofocus
								/>
								<ul class="dropdown-custom-list">
									${renderItems(items)}
								</ul>
							</div>
					  `
					: nothing}
			</div>
		</div>
	`;
};
