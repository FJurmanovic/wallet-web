import isEmail from 'validator/lib/isEmail';
import isDate from 'validator/lib/isDate';
import isNumeric from 'validator/lib/isNumeric';
import isAfter from 'validator/lib/isAfter';
import matches from 'validator/lib/matches';

const validator = {
	is_email: [isEmail, '{- name} needs to be email format.'],
	is_date: isDate,
	is_numeric: isNumeric,
	matches: matches,
	is_same: [isSame, '{- name} needs to be same to {- field}.'],
	required: [required, '{- name} is required.'],
	is_after: [isAfter, '{- name} needs to be after {- field}.'],
};

function required(str: string): boolean {
	if (!str || str == '') return false;
	return true;
}

function isSame(str: string, field: string): boolean {
	if (str === field) return true;
	return false;
}

export default validator;
