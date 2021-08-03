import { controller } from 'core/utils';
import style from 'styles/main.scss';

(function () {
	const _shadow = new WeakMap();

	@controller('app-shadow')
	class AppShadowElement extends HTMLElement {
		constructor() {
			super();
			_shadow.set(this, this.attachShadow({ mode: 'closed' }));
		}

		connectedCallback() {
			const _root = _shadow.get(this);
			const _appMain = document.createElement('app-main');
			const _style = document.createElement('style');
			_style.innerHTML = style;

			_root.appendChild(_style);
			_root.appendChild(_appMain);
		}
	}
})();
