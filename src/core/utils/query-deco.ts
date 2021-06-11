import { toKebabCase } from 'core/utils';

export default function query(proto: Object, key: string): any {
	const kebab: string = toKebabCase(key);
	return Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			return findQuery(this, kebab);
		},
	});
}

function findQuery(element: HTMLElement, key: string): HTMLElement {
	return element.querySelector(key);
}
