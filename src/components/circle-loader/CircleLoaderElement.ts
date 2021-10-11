import { attr, controller, TemplateResult } from 'core/utils';
import { BaseComponentElement } from 'common/';
import { CircleLoaderElementTemplate } from 'components/circle-loader';

@controller('circle-loader')
class CircleLoaderElement extends BaseComponentElement {
	@attr size: string;
	constructor() {
		super();
	}

	elementConnected = (): void => {
		this.update();
	};

	render = (): TemplateResult => CircleLoaderElementTemplate({ size: this.size });
}

export type { CircleLoaderElement };
