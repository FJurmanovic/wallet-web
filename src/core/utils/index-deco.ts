export default function index(proto: Object, key: string): Object {
	return Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			return Array.from(this.parentNode.children).indexOf(this);
		},
	});
}
