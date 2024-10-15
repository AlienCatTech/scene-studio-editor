import type { LoginStore, SceneStudioSchema } from './types';
import { loginStore } from './store';

export const sortPreset = (p: SceneStudioSchema): SceneStudioSchema => {
	const sortedKeys = Object.keys(p).sort();
	const sortedObj: SceneStudioSchema = {} as SceneStudioSchema;

	sortedKeys.forEach((key) => {
		sortedObj[key] = p[key];
	});

	return sortedObj;
};

export function parseTimeString(timeString: string): [number, number, number] {
	const [hours, minutes, seconds] = timeString.split(':').map(Number);

	if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
		throw new Error('Invalid time string format');
	}

	return [hours, minutes, seconds];
}

export const validTime = (hour: number, min: number, sec: number) => {
	if (
		hour == null ||
		min == null ||
		sec == null ||
		isNaN(hour) ||
		isNaN(min) ||
		isNaN(sec) ||
		hour < 0 ||
		hour > 23 ||
		min < 0 ||
		min > 59 ||
		sec < 0 ||
		sec > 59
	) {
		return false;
	}
	return true;
};

export const numToString = (hour: number, min: number, sec: number) => {
	const formattedHour = hour.toString().padStart(2, '0');
	const formattedMin = min.toString().padStart(2, '0');
	const formattedSec = sec.toString().padStart(2, '0');
	return `${formattedHour}:${formattedMin}:${formattedSec}`;
};

export const addToDict = (key: string, p: Record<string, unknown>) => {
	if (key in p) {
		return p;
	}
	return {
		...p,
		...{
			[key]: []
		}
	};
};

export const changeItemInDict = (
	oldKey: string,
	newKey: string,
	p: Record<string, unknown>
): Record<string, unknown> => {
	if (oldKey in p) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [oldKey]: _, ...rest } = p;
		return { ...rest, [newKey]: p[oldKey] };
	}
	return p;
};

export const removeItemFromDict = (time: string, p: Record<string, unknown>) => {
	if (time in p) {
		const removeKey = <T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [key]: _, ...rest } = obj;
			return rest;
		};

		return removeKey(p, time);
	}
	return p;
};

export const setLogin = (login: LoginStore) => {
	localStorage.setItem('login', JSON.stringify(login));
	loginStore.set(login);
};

export const getFullFileName = (name: string) => name + '.json';
export const getOnlyFileName = (name: string) => name.substring(0, name.length - 5);

export const changeItemInArray = <T>(array: T[], index: number, newItem: T): T[] => {
	const newArray = [...array];
	newArray[index] = newItem;
	return newArray;
};
export const removeItemFromArray = <T>(array: T[], index: number): T[] => {
	return [...array.slice(0, index), ...array.slice(index + 1)];
};

export function convertToOutputObject<T extends Record<string, unknown>>(
	inputArray: T[]
): { [K in keyof T]: T[K] } {
	const outputObject: { [K in keyof T]: T[K] } = {} as { [K in keyof T]: T[K] };

	for (const obj of inputArray) {
		for (const key in obj) {
			if (Object.hasOwn(obj, key)) {
				outputObject[key] = obj[key];
			}
		}
	}

	return outputObject;
}
