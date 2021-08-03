import { controller } from 'core/utils';
import { AuthService } from 'services/';
import { BasePageElement } from 'common/';

@controller('logout-page')
class LogoutPageElement extends BasePageElement {
	authService: AuthService;
	constructor() {
		super({
			title: 'Logout',
		});
	}
	elementConnected = (): void => {
		this.authService = new AuthService(this.appMain.appService);
		this.appMain?.authStore?.userLogout();
		this.appMain?.routerService.goTo('/login');
	};
}

export type { LogoutPageElement };
