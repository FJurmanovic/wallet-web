import { isPrimitive, directive } from 'core/utils';

interface AsyncState {
	lastRenderedIndex: number;

	values: unknown[];
}

const _state = new WeakMap<any, AsyncState>();
const _infinity = 0x7fffffff;

export const until = directive((...args: unknown[]) => (part: any) => {
	let state = _state.get(part)!;
	if (state === undefined) {
		state = {
			lastRenderedIndex: _infinity,
			values: [],
		};
		_state.set(part, state);
	}
	const previousValues = state.values;
	let previousLength = previousValues.length;
	state.values = args;

	for (let i = 0; i < args.length; i++) {
		// If we've rendered a higher-priority value already, stop.
		if (i > state.lastRenderedIndex) {
			break;
		}

		const value = args[i];

		// Render non-Promise values immediately
		if (isPrimitive(value) || typeof (value as { then?: unknown }).then !== 'function') {
			part.setValue(value);
			state.lastRenderedIndex = i;
			// Since a lower-priority value will never overwrite a higher-priority
			// synchronous value, we can stop processing now.
			break;
		}

		// If this is a Promise we've already handled, skip it.
		if (i < previousLength && value === previousValues[i]) {
			continue;
		}

		// We have a Promise that we haven't seen before, so priorities may have
		// changed. Forget what we rendered before.
		state.lastRenderedIndex = _infinity;
		previousLength = 0;

		Promise.resolve(value).then((resolvedValue: unknown) => {
			const index = state.values.indexOf(value);
			// If state.values doesn't contain the value, we've re-rendered without
			// the value, so don't render it. Then, only render if the value is
			// higher-priority than what's already been rendered.
			if (index > -1 && index < state.lastRenderedIndex) {
				state.lastRenderedIndex = index;
				part.setValue(resolvedValue);
				part.commit();
			}
		});
	}
});
