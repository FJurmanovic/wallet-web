import { toKebabCase } from "core/utils";

export default function closest(proto, key) {
    const kebab: string = toKebabCase(key);
    return Object.defineProperty(proto, key, {
        configurable: true,
        get() {
            return findClosest(this, kebab);
        },
    });
}

function findClosest(element: HTMLElement, key: string) {
    return element.closest(key);
}
