import { describe, it, expect } from 'vitest';
import { messages, speechLocale } from './messages.js';

describe('messages', () => {
	it('exposes the same key set for every language', () => {
		const de = Object.keys(messages.de).sort();
		const en = Object.keys(messages.en).sort();
		expect(en).toEqual(de);
	});

	it('has no empty strings', () => {
		for (const lang of ['de', 'en'] as const) {
			for (const [key, value] of Object.entries(messages[lang])) {
				expect(value, `${lang}.${key}`).not.toBe('');
			}
		}
	});
});

describe('speechLocale', () => {
	it('maps app languages to BCP-47 recognition tags', () => {
		expect(speechLocale('de')).toBe('de-DE');
		expect(speechLocale('en')).toBe('en-US');
	});
});
