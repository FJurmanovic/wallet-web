import { AppFormElement } from 'components/';
import { validatorErrors } from 'core/constants';
import { firstUpper, validator } from 'core/utils';

class Validator {
	public _error: string;
	public _valid: boolean;
	constructor(public input: any, public form: AppFormElement, public rules: string) {}

	get value() {
		return this.input?._value;
	}

	get name() {
		return this.input?.name;
	}

	get error() {
		return this._error;
	}

	set error(error) {
		this._error = error;
	}

	get valid() {
		return this._valid;
	}

	set valid(error) {
		this._valid = error;
	}

	validate = () => {
		const rules = this.rules?.split('|').filter((a) => a);
		const value = this.value;
		const validArr = rules
			.slice()
			.reverse()
			.map((rule) => {
				let args = [];
				if (rule.includes('[') && rule.includes(']')) {
					const begSep = rule.lastIndexOf('[');
					const endSep = rule.lastIndexOf(']');

					args = rule
						.slice(begSep + 1, endSep)
						.split(',')
						.map((arg: string) => {
							if (this.form && arg?.includes?.('field')) {
								const begBr = arg.lastIndexOf('(');
								const endBr = arg.lastIndexOf(')');
								const field = arg.slice(begBr + 1, endBr);

								return this.form?.values[field];
							}
						});
					rule = rule.slice(0, begSep);
				}
				let validRule = validator?.[rule];
				let ruleArray = validRule ? Array.isArray(validRule) : false;
				let valid = true;

				if (validRule) {
					if (ruleArray) {
						valid = validRule?.[0]?.(value, ...args);
					} else {
						valid = validRule?.(value, ...args);
					}
				}
				if (!valid) {
					const error = validatorErrors[rule]?.replaceAll('{- name}', firstUpper(this.name?.toString()));
					this.error = ruleArray ? validRule?.[1]?.replaceAll('{- name}', firstUpper(this.name?.toString())) : error;
				}
				return valid;
			});
		const _return = validArr?.includes(false);
		if (_return) {
			this.error = null;
		}
		this.valid = !_return;
		return !_return;
	};
}

export default Validator;
