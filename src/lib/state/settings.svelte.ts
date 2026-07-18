/**
 * App-wide settings singleton: currently the UI/word-model language. Initialised from
 * the browser's language (falling back to English), overridable in-game, and persisted
 * to localStorage so a returning player keeps their choice. All browser access is guarded
 * so this stays inert during SSR/prerender (see `windowChrome.svelte.ts` for the pattern).
 */

import { browser } from '$app/environment';
import type { Language } from '$lib/game/types.js';
import { messages, type MessageKey } from '$lib/i18n/messages.js';

const STORAGE_KEY = 'woice.language';

/** Pick the best supported language from a BCP-47 tag like "de-AT" → 'de'. */
function detectLanguage(): Language {
	if (!browser) return 'en';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'de' || stored === 'en') return stored;
	return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
}

class Settings {
	language = $state<Language>(detectLanguage());

	setLanguage(language: Language): void {
		this.language = language;
		if (browser) localStorage.setItem(STORAGE_KEY, language);
	}

	/** Translate a message key into the current language. */
	t(key: MessageKey): string {
		return messages[this.language][key];
	}
}

/** App-wide settings singleton. */
export const settings = new Settings();
