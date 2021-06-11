import { AppMainElement } from 'components/';

export default function findMethod(actionString: string, appMain: AppMainElement): Function {
	if (actionString) {
		const methodSep = actionString.lastIndexOf('#');
		const tag = actionString.slice(0, methodSep);
		const method = actionString.slice(methodSep + 1);

		const element = appMain.querySelector(tag);
		if (element) {
			return element?.[method];
		}
	}
	return () => {};
}
