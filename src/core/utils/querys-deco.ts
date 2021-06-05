import { toKebabCase } from "core/utils";

export default function querys(proto: Object, key: string): any {
    const kebab: string = toKebabCase(key);
    return Object.defineProperty(proto, key, {
        configurable: true,
        get() {
            return findQuerys(this, kebab);
        },
    });
}

function findQuerys(
    element: HTMLElement,
    key: string
): NodeListOf<HTMLElement> {
    return element.querySelectorAll(key);
}
