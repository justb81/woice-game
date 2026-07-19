/**
 * Voice-input adapter over the Web Speech API. Feature-detected and browser-guarded
 * (same pattern as `windowChrome.svelte.ts`): if the API is missing — Firefox, SSR,
 * prerender — `supported` stays false and the UI silently falls back to text input.
 * Recognition language follows the round's game language (`config.language`), which the
 * lobby lets the group set independently of the UI language.
 */

import { browser } from '$app/environment';
import { gameSession } from './game.svelte.js';
import { speechLocale } from '$lib/i18n/messages.js';

class SpeechInput {
	supported = $state(false);
	listening = $state(false);
	/** Live (non-final) transcript, shown while the player is still speaking. */
	interim = $state('');

	#Ctor: SpeechRecognitionConstructor | undefined;
	#recognition: SpeechRecognition | undefined;

	constructor() {
		if (!browser) return;
		this.#Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
		this.supported = this.#Ctor !== undefined;
	}

	/**
	 * Start listening. Calls `onFinal` once with the recognised word, then stops.
	 * No-op when speech isn't supported so callers don't need to branch.
	 */
	start(onFinal: (transcript: string) => void): void {
		if (!this.#Ctor || this.listening) return;

		const recognition = new this.#Ctor();
		recognition.lang = speechLocale(gameSession.config.language);
		recognition.interimResults = true;
		recognition.continuous = false;
		recognition.maxAlternatives = 1;

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			let interim = '';
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const result = event.results[i];
				const transcript = result[0].transcript;
				if (result.isFinal) {
					this.stop();
					onFinal(transcript);
					return;
				}
				interim += transcript;
			}
			this.interim = interim;
		};
		recognition.onerror = () => this.stop();
		recognition.onend = () => {
			this.listening = false;
			this.interim = '';
		};

		this.#recognition = recognition;
		this.listening = true;
		this.interim = '';
		recognition.start();
	}

	stop(): void {
		this.#recognition?.stop();
		this.listening = false;
		this.interim = '';
	}
}

/** App-wide voice-input singleton. */
export const speechInput = new SpeechInput();
