import { Timer } from '..';

export const delay = (ms, callback?, value?) =>
	new Promise((resolve, reject) => {
		const args = typeof callback == 'function' ? [resolve, reject, value] : [value];
		const timer = new Timer(typeof callback == 'function' ? callback : resolve, ms, ...args);
		return timer;
	});
