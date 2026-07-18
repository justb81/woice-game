// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Window Controls Overlay isn't in TypeScript's lib.dom.d.ts yet (Chromium-only, experimental).
	// Used by `$lib/state/windowChrome.svelte.ts` to let an installed desktop PWA draw into the titlebar.
	interface WindowControlsOverlayGeometryChangeEvent extends Event {
		readonly titlebarAreaRect: DOMRect;
		readonly visible: boolean;
	}

	interface WindowControlsOverlay extends EventTarget {
		readonly visible: boolean;
		getTitlebarAreaRect(): DOMRect;
		addEventListener(
			type: 'geometrychange',
			listener: (event: WindowControlsOverlayGeometryChangeEvent) => void
		): void;
		removeEventListener(
			type: 'geometrychange',
			listener: (event: WindowControlsOverlayGeometryChangeEvent) => void
		): void;
	}

	interface Navigator {
		readonly windowControlsOverlay?: WindowControlsOverlay;
	}

	// Web Speech API (SpeechRecognition) isn't in TypeScript's lib.dom.d.ts. Used by
	// `$lib/state/speech.svelte.ts` for live voice input; feature-detected at runtime, so
	// these are declared optional on Window. Only the fields Woice actually reads are typed.
	interface SpeechRecognitionAlternative {
		readonly transcript: string;
		readonly confidence: number;
	}

	interface SpeechRecognitionResult {
		readonly isFinal: boolean;
		readonly length: number;
		item(index: number): SpeechRecognitionAlternative;
		[index: number]: SpeechRecognitionAlternative;
	}

	interface SpeechRecognitionResultList {
		readonly length: number;
		item(index: number): SpeechRecognitionResult;
		[index: number]: SpeechRecognitionResult;
	}

	interface SpeechRecognitionEvent extends Event {
		readonly resultIndex: number;
		readonly results: SpeechRecognitionResultList;
	}

	interface SpeechRecognitionErrorEvent extends Event {
		readonly error: string;
		readonly message: string;
	}

	interface SpeechRecognition extends EventTarget {
		lang: string;
		continuous: boolean;
		interimResults: boolean;
		maxAlternatives: number;
		start(): void;
		stop(): void;
		abort(): void;
		onresult: ((event: SpeechRecognitionEvent) => void) | null;
		onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
		onend: ((event: Event) => void) | null;
	}

	type SpeechRecognitionConstructor = new () => SpeechRecognition;

	interface Window {
		SpeechRecognition?: SpeechRecognitionConstructor;
		webkitSpeechRecognition?: SpeechRecognitionConstructor;
	}
}

export {};
