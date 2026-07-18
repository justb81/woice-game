/**
 * Add-to-home-screen (install) prompt handling. Chromium fires `beforeinstallprompt`
 * when the PWA is installable; we stash the event so the UI can offer an explicit
 * install button (a game in the middle of a round shouldn't get a surprise dialog).
 * Feature-detected and browser-guarded (same pattern as `windowChrome.svelte.ts`):
 * where the API is missing — Firefox, iOS, SSR, prerender — `available` stays false.
 */

import { browser } from '$app/environment';

/** The non-standard event Chromium fires; typed locally since lib.dom omits it. */
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class InstallPrompt {
	/** True when the browser has offered an installable prompt we can replay on demand. */
	available = $state(false);
	/** True when the app is already running as an installed PWA (standalone display). */
	installed = $state(false);

	#deferred: BeforeInstallPromptEvent | null = null;

	constructor() {
		if (!browser) return;
		this.installed = this.#detectInstalled();

		window.addEventListener('beforeinstallprompt', (event) => {
			// Suppress the default mini-infobar so we can surface our own, dismissible prompt.
			event.preventDefault();
			this.#deferred = event as BeforeInstallPromptEvent;
			this.available = true;
		});

		window.addEventListener('appinstalled', () => {
			this.installed = true;
			this.available = false;
			this.#deferred = null;
		});
	}

	#detectInstalled(): boolean {
		return (
			window.matchMedia?.('(display-mode: standalone)').matches ||
			// iOS Safari exposes standalone launches here instead of a display-mode match.
			(navigator as unknown as { standalone?: boolean }).standalone === true
		);
	}

	/** Replay the stored prompt. Resolves once the user has accepted or dismissed it. */
	async install(): Promise<void> {
		const deferred = this.#deferred;
		if (!deferred) return;
		// A prompt can only be used once; drop it either way so the banner doesn't linger.
		this.available = false;
		this.#deferred = null;
		await deferred.prompt();
		await deferred.userChoice;
	}

	/** Hide the install banner without installing (the "later" affordance). */
	dismiss(): void {
		this.available = false;
	}
}

/** App-wide install-prompt singleton. */
export const installPrompt = new InstallPrompt();
