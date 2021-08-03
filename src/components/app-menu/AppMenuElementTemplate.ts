import { html, nothing, TemplateResult } from 'core/utils';

export default (props): TemplateResult => {
	const { isAuth, totalWallets, walletData } = props;

	const regularMenu = (path: string, title: string, action?: string, className?: string): TemplateResult => {
		if (action) {
			return html`
				<menu-item
					class="${className || ''}"
					data-path="${path}"
					data-customaction="${action}"
					data-title="${title}"
				></menu-item>
			`;
		}
		return html`<menu-item class="${className || ''}" data-path="${path}" data-title="${title}"></menu-item>`;
	};
	const menuButton = (title: string, action?: string): TemplateResult => {
		return html` <div class="menu-item --retract" data-target="menu-item.itemEl">
			<button class="btn btn-link" data-target="app-link.main" app-action="${action}">
				${title}<span class="pseudo"></span>
			</button>
		</div>`;
	};
	const authMenu = (path: string, title: string, action?: string, className?: string): TemplateResult => {
		if (isAuth) {
			return regularMenu(path, title, action, className);
		}
		return html``;
	};
	const notAuthMenu = (path: string, title: string, action?: string): TemplateResult => {
		if (!isAuth) {
			return regularMenu(path, title, action);
		}
		return html``;
	};
	const renderWallets = (wallets: Array<any>) => {
		if (isAuth && totalWallets > 0) {
			return html`<div class="menu-item divider"></div>
				${wallets.map((wallet) => regularMenu(`/wallet/${wallet.id}`, wallet.name, '', '--wallet'))}`;
		}
		return nothing;
	};
	const menuHeader = (title) => html`<div class="menu-item menu-header"><span class="link-text">${title}</span></div>`;

	return html`
		<div data-target="app-menu.sidebar">
			<div class="content">
				${menuHeader(__CONFIG__.appName)} ${regularMenu('/', 'Home')}
				${authMenu('/history', 'Transaction History', 'click:app-menu#modalTransaction')}
				${authMenu('/subscriptions', 'Subscriptions', 'click:app-menu#modalSubscription')}
				${authMenu('/wallet/all', 'My Wallets', 'click:app-menu#modalWallet')} ${renderWallets(walletData)}
				<span class="menu-item divider"></span>
				${authMenu('/logout', 'Logout', '', '--logout')} ${notAuthMenu('/login', 'Login')}
				${notAuthMenu('/register', 'Register')}
			</div>
			<div class="footer">${menuButton('Retract', 'click:menu-layout#retractMenu')}</div>
		</div>
	`;
};
