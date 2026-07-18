/**
 * UI string catalogues (de/en) plus the BCP-47 mapping for speech recognition.
 * Pure and framework-free so it loads in the prerender pass and the Node test runner.
 * Every language must expose the same key set — enforced by the `Messages` type and
 * a spec that diffs the key lists.
 */

import type { Language, ValidationError } from '../game/types.js';

export type MessageKey =
	| 'appName'
	| 'tagline'
	| 'play'
	| 'language'
	| 'lobbyTitle'
	| 'players'
	| 'addPlayer'
	| 'playerNamePlaceholder'
	| 'playerColor'
	| 'remove'
	| 'settings'
	| 'timeLimit'
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
	| 'typeInstead'
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
	| 'points'
	| 'stats'
	| 'statsTitle'
	| 'wins'
	| 'favoriteLetters'
	| 'bestStreak'
	| 'bestCombo'
	| 'roundsPlayed'
	| 'statsEmpty'
	| 'viewStats'
	| 'resetStats'
	| 'resetStatsConfirm'
	| 'confirm'
	| 'cancel'
	| 'installTitle'
	| 'installAction'
	| 'updateTitle'
	| 'updateAction'
	| 'dismiss';

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
		playerColor: 'Spielerfarbe',
		remove: 'Entfernen',
		settings: 'Einstellungen',
		timeLimit: 'Zeitlimit pro Zug',
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
		typeInstead: 'Lieber tippen',
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
		points: 'Pkt.',
		stats: 'Statistiken',
		statsTitle: 'Statistiken',
		wins: 'Siege',
		favoriteLetters: 'Lieblingsbuchstaben',
		bestStreak: 'Beste Serie',
		bestCombo: 'Beste Kombo',
		roundsPlayed: 'Gespielte Runden',
		statsEmpty: 'Noch keine Runde gespielt. Spiel eine Runde, um Statistiken zu sammeln!',
		viewStats: 'Statistiken',
		resetStats: 'Statistiken zurücksetzen',
		resetStatsConfirm: 'Wirklich alle Statistiken löschen?',
		confirm: 'Ja',
		cancel: 'Nein',
		installTitle: 'Woice als App installieren?',
		installAction: 'Installieren',
		updateTitle: 'Eine neue Version ist verfügbar.',
		updateAction: 'Aktualisieren',
		dismiss: 'Später'
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
		playerColor: 'Player colour',
		remove: 'Remove',
		settings: 'Settings',
		timeLimit: 'Time limit per turn',
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
		typeInstead: 'Type instead',
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
		points: 'pts',
		stats: 'Stats',
		statsTitle: 'Stats',
		wins: 'Wins',
		favoriteLetters: 'Favorite letters',
		bestStreak: 'Best streak',
		bestCombo: 'Best combo',
		roundsPlayed: 'Rounds played',
		statsEmpty: 'No rounds played yet. Play a round to start collecting stats!',
		viewStats: 'Stats',
		resetStats: 'Reset stats',
		resetStatsConfirm: 'Really delete all stats?',
		confirm: 'Yes',
		cancel: 'No',
		installTitle: 'Install Woice as an app?',
		installAction: 'Install',
		updateTitle: 'A new version is available.',
		updateAction: 'Update',
		dismiss: 'Later'
	}
};

/** Message key for a given validation error, so the overlay can look up localised text. */
export const validationMessageKey: Record<ValidationError, MessageKey> = {
	empty: 'errorEmpty',
	'too-short': 'errorTooShort',
	'wrong-start': 'errorWrongStart',
	duplicate: 'errorDuplicate'
};

/** BCP-47 tag the Web Speech API should recognise in for a given app language. */
export function speechLocale(language: Language): string {
	return language === 'de' ? 'de-DE' : 'en-US';
}
