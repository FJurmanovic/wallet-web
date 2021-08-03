import { controller } from 'core/utils';
import { BaseComponentElement } from 'common/';
import AppLoaderElementTemplate from './AppLoaderElementTemplate';

@controller('app-loader')
class AppLoaderElement extends BaseComponentElement {
	private finished: boolean = true;
	private _loading: number = 0;

	constructor() {
		super();
	}

	public start = () => {
		this.finished = false;
		this._loading++;
		this.update();
	};

	public stop = () => {
		if (this._loading > 0) {
			this._loading--;
		}
		if (this._loading == 0) {
			this.finishInitiate();
		}
		this.update();
	};

	public get loading() {
		return this._loading > 0;
	}

	private finishInitiate = () => {
		setTimeout(() => {
			this.finished = true;
			this.update();
		}, 300);
	};

	elementConnected = (): void => {
		this.update();
	};

	render = () => AppLoaderElementTemplate({ finished: this.finished, loading: this.loading });
}

export type { AppLoaderElement };
