/**
 * UI string catalogues (de/en) plus the BCP-47 mapping for speech recognition.
 * Pure and framework-free so it loads in the prerender pass and the Node test runner.
 * Every language must expose the same key set — enforced by the `Messages` type and
 * a spec that diffs the key lists.
 */

import type { Language, Strictness, ValidationError } from '../game/types.js';

export type MessageKey =
	| 'appName'
	| 'tagline'
	| 'play'
	| 'language'
	| 'lobbyTitle'
	| 'players'
	| 'addPlayer'
	| 'playerNamePlaceholder'
	| 'remove'
	| 'settings'
	| 'strictness'
	| 'strictnessLocker'
	| 'strictnessStandard'
	| 'strictnessStreng'
	| 'turnSeconds'
	| 'minLength'
	| 'startLetter'
	| 'startLetterRandom'
	| 'startGame'
	| 'needTwoPlayers'
	| 'nextLetter'
	| 'yourTurn'
	| 'score'
	| 'listen'
	| 'listening'
	| 'wordPlaceholder'
	| 'submit'
	| 'history'
	| 'valid'
	| 'errorEmpty'
	| 'errorTooShort'
	| 'errorWrongStart'
	| 'errorDuplicate'
	| 'summaryTitle'
	| 'winner'
	| 'tie'
	| 'longestWord'
	| 'playAgain'
	| 'backHome'
	| 'points';

export type Messages = Record<MessageKey, string>;

export const messages: Record<Language, Messages> = {
	de: {
		appName: 'Woice',
		tagline: 'Das Wortketten-Spiel für die Gruppe – laut gesprochen, live gewertet.',
		play: 'Spielen',
		language: 'Sprache',
		lobbyTitle: 'Runde vorbereiten',
		players: 'Spieler',
		addPlayer: 'Hinzufügen',
		playerNamePlaceholder: 'Spielername',
		remove: 'Entfernen',
		settings: 'Einstellungen',
		strictness: 'Regelstrenge',
		strictnessLocker: 'Locker',
		strictnessStandard: 'Standard',
		strictnessStreng: 'Streng',
		turnSeconds: 'Zeit pro Zug (Sek.)',
		minLength: 'Mindestlänge',
		startLetter: 'Startbuchstabe',
		startLetterRandom: 'Zufällig',
		startGame: 'Runde starten',
		needTwoPlayers: 'Mindestens zwei Spieler nötig.',
		nextLetter: 'Nächster Buchstabe',
		yourTurn: 'ist am Zug',
		score: 'Punkte',
		listen: 'Sprechen',
		listening: 'Höre zu …',
		wordPlaceholder: 'Wort eingeben',
		submit: 'Absenden',
		history: 'Wortverlauf',
		valid: 'Gültig',
		errorEmpty: 'Kein Wort erkannt.',
		errorTooShort: 'Wort zu kurz.',
		errorWrongStart: 'Falscher Startbuchstabe.',
		errorDuplicate: 'Wort schon genutzt.',
		summaryTitle: 'Rundenergebnis',
		winner: 'Sieger',
		tie: 'Unentschieden',
		longestWord: 'Längstes Wort',
		playAgain: 'Nochmal',
		backHome: 'Zum Start',
		points: 'Pkt.'
	},
	en: {
		appName: 'Woice',
		tagline: 'The word-chain party game — say it out loud, scored live.',
		play: 'Play',
		language: 'Language',
		lobbyTitle: 'Set up the round',
		players: 'Players',
		addPlayer: 'Add',
		playerNamePlaceholder: 'Player name',
		remove: 'Remove',
		settings: 'Settings',
		strictness: 'Rule strictness',
		strictnessLocker: 'Loose',
		strictnessStandard: 'Standard',
		strictnessStreng: 'Strict',
		turnSeconds: 'Time per turn (sec)',
		minLength: 'Minimum length',
		startLetter: 'Start letter',
		startLetterRandom: 'Random',
		startGame: 'Start round',
		needTwoPlayers: 'At least two players required.',
		nextLetter: 'Next letter',
		yourTurn: 'is up',
		score: 'Score',
		listen: 'Speak',
		listening: 'Listening …',
		wordPlaceholder: 'Type a word',
		submit: 'Submit',
		history: 'Word history',
		valid: 'Valid',
		errorEmpty: 'No word detected.',
		errorTooShort: 'Word too short.',
		errorWrongStart: 'Wrong start letter.',
		errorDuplicate: 'Word already used.',
		summaryTitle: 'Round result',
		winner: 'Winner',
		tie: 'Tie',
		longestWord: 'Longest word',
		playAgain: 'Play again',
		backHome: 'Home',
		points: 'pts'
	}
};

/** Message key for a given validation error, so the overlay can look up localised text. */
export const validationMessageKey: Record<ValidationError, MessageKey> = {
	empty: 'errorEmpty',
	'too-short': 'errorTooShort',
	'wrong-start': 'errorWrongStart',
	duplicate: 'errorDuplicate'
};

/** Message key for a strictness value (for the lobby selector labels). */
export const strictnessMessageKey: Record<Strictness, MessageKey> = {
	locker: 'strictnessLocker',
	standard: 'strictnessStandard',
	streng: 'strictnessStreng'
};

/** BCP-47 tag the Web Speech API should recognise in for a given app language. */
export function speechLocale(language: Language): string {
	return language === 'de' ? 'de-DE' : 'en-US';
}
