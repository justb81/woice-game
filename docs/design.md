# Produktkonzept: Voice-First Wortketten-App

## Überblick
Die Wortketten-App ist ein sprachbasiertes Multiplayer-Spiel für Android und Web/PWA, bei dem Spieler reihum ein Wort sagen müssen, das mit dem letzten Buchstaben des vorherigen Wortes beginnt. Der Produktkern ist nicht nur das bekannte Regelprinzip, sondern die automatische Live-Erkennung, Regelprüfung, Punktevergabe und Visualisierung in Echtzeit.[cite:1][cite:3][cite:13]

Die Marktchance entsteht dadurch, dass vorhandene Word-Chain-Angebote im App-Markt oft Puzzle- oder Association-Games sind, während offene Multiplayer-Wortketten-Projekte technisch eher einfach oder veraltet wirken. Gleichzeitig existieren Open-Source-Bausteine für Web Speech und Android-Spracherkennung, die als technologische Basis für ein modernes Produkt genutzt werden können.[cite:2][cite:13][cite:17][cite:8]

## Produktvision
Das Produkt soll die einfachste und spannendste Möglichkeit werden, Wortketten live in einer Gruppe zu spielen, ohne dass jemand manuell mitschreiben oder Regeln überwachen muss. Die App übernimmt die Rolle von Spielleiter, Schiedsrichter und Scoreboard in einem System.[cite:1][cite:3]

Die langfristige Vision ist eine modulare Plattform für sprachbasierte Wortspiele. Die Wortkette bildet den ersten Spielmodus, auf dessen Regel- und Voice-Engine später weitere Modi wie Kategorienrunden, Teamduelle oder Schul-/Sprachlernvarianten aufbauen können.[cite:13][cite:8]

## Zielgruppen
### Primäre Zielgruppen
- Freundesgruppen und Familien, die ein schnelles, leicht verständliches Partyspiel suchen.
- Kinder und Jugendliche ab etwa 10 Jahren, sofern die Oberfläche klar, visuell und motivierend gestaltet ist.
- Schulische oder sprachnahe Einsatzszenarien, in denen Wörter, Buchstabenfolgen und Reaktionsfähigkeit sichtbar trainiert werden.

### Sekundäre Zielgruppen
- Streamer oder Creator, die ein reaktives Gruppenspiel mit Zuschauerwert suchen.
- Sprachlern-Communities, die Aussprache und Wortschatz spielerisch kombinieren wollen.
- Casual-Gamer, die mobil oder im Browser sofort loslegen möchten.

## Plattformstrategie
Für den Markteinstieg bietet sich eine PWA an, weil Browser-basierte Multiplayer-Wortspiele und Web-Speech-Demos bereits existieren und ein schneller MVP ohne Store-Release möglich ist. Gleichzeitig zeigen Web-Speech-Beispiele, dass Browser-Kompatibilität begrenzt sein kann, was für die Produktstrategie einen späteren Android-Fokus sinnvoll macht.[cite:13][cite:17][cite:55][cite:56]

Die mittelfristige Zielplattform sollte Android sein. Dort gibt es mehrere Open-Source-Projekte rund um Whisper/TFLite und On-Device-Spracherkennung, die eine robustere, kontrollierbare und perspektivisch auch offline-fähige Audioverarbeitung ermöglichen.[cite:8][cite:50][cite:51][cite:52][cite:54]

## Markt- und Wettbewerbsanalyse
### Direkte Konkurrenz
Vorhandene Store-Angebote unter dem Namen „Word Chain“ oder ähnlichen Begriffen nutzen das Thema oft als klassisches Puzzle, Daily Game oder Wortassoziationsspiel statt als live gesprochene Multiplayer-Runde. Dadurch entsteht Namenskonkurrenz, aber keine vollständige Produktgleichheit.[cite:38][cite:39][cite:40][cite:42][cite:43][cite:45][cite:47][cite:48][cite:49]

### Open-Source-Referenzen
| Projekt | Plattform | Relevanz | Erkenntnis |
|---|---|---|---|
| sonnylazuardi/wordchain | Web | Multiplayer-Wortkette [cite:1] | Zeigt, dass Echtzeit-Wordchain mit Firebase möglich ist, aber auf älterem Stack basiert.[cite:1] |
| silverwolfceh/wordchain | Web | Realtime mit Socket.io [cite:3] | Enthält bereits Duplikat-, Timeout- und Chain-Erkennung als Kernfunktionen.[cite:3] |
| tommylusun/word-chain | Web | Multiplayer-Lernprojekt [cite:2] | Validiert Mehrspieler-Ansatz, aber eher als technisches Demo-Projekt.[cite:2] |
| plutov/games | Web | Voice-Games [cite:13] | Zeigt Machbarkeit von sprachbasierten Browser-Spielen und weist auf Chrome-Limitierung hin.[cite:13] |
| whisper_android | Android | Speech Engine [cite:8] | Geeignete Referenz für robustere mobile Spracherkennung.[cite:8] |

### Differenzierung
Das Produkt sollte sich über fünf Merkmale absetzen:
- Live-Spracherkennung mit sofortigem Feedback.
- Automatische Regelprüfung und Streitvermeidung.
- Sichtbares Letter-Tracking und taktisches Punktesystem.
- Social-First UX für gemeinsame Runden an einem Gerät oder in einem Raum.
- Thematisierbare Spielwelt auf derselben Regel-Engine.

## Wertversprechen
Die App macht aus einem analogen Sprachspiel ein digitales, aber trotzdem sehr soziales Erlebnis. Der Mehrwert liegt in der Entlastung der Gruppe: Niemand muss Wörter notieren, Startbuchstaben merken, Zeit stoppen oder Punkte zählen.[cite:1][cite:3]

Gleichzeitig entsteht durch die Visualisierung ein neues Spielgefühl, weil Endbuchstaben, Kombo-Serien, Wortlängen und Risiko-Züge sichtbar gemacht werden können. Damit wird aus einem einfachen Gesellschaftsspiel ein modernes Casual-Game mit Progression.[cite:43]

## Kernspiel
### Grundregel
Ein Spieler sagt ein Wort. Der nächste Spieler muss ein neues Wort sagen, das mit dem letzten Buchstaben des vorigen Wortes beginnt. Bereits verwendete Wörter sind ungültig, ebenso Wörter mit falschem Startbuchstaben oder Wörter außerhalb der aktuellen Kategorie, falls ein Kategorienmodus aktiv ist.[cite:3][cite:43]

### Rundenfluss
1. Lobby erstellen.
2. Spieler hinzufügen.
3. Startwort oder Startbuchstabe festlegen.
4. Aktiven Spieler hervorheben.
5. Sprachaufnahme während des Zugfensters aktivieren.
6. Wort transkribieren und validieren.
7. Punkte berechnen.
8. Nächsten Spieler aktivieren.
9. Runde bei Fehlerlimit, Timer-Ende oder Zielpunktzahl beenden.

### Spielmodi
- Lokaler Party-Modus: ein Gerät liegt in der Mitte, alle spielen abwechselnd.
- Pass-and-Play-Modus: Gerät wird an den aktiven Spieler weitergereicht.
- Online-Raum: Spieler joinen per Link oder Code.
- Team-Modus: zwei Teams mit gemeinsamem Punktekonto.
- Kategorienmodus: nur Tiere, Länder, Essen, Filme oder frei definierte Themen.
- Zeitdruckmodus: kurze Timer für hohe Dynamik.
- Lernmodus: vereinfachte Validierung, Hilfen und größere Visualisierung.

## Punktesystem
Das Scoring muss sofort verständlich, aber tief genug für Taktik sein.

| Komponente | Logik | Zweck |
|---|---|---|
| Basispunkte | Gültiges Wort gibt feste Punkte | Einstieg einfach halten |
| Längenbonus | Mehr Buchstaben, mehr Punkte | Kreative und längere Wörter belohnen |
| Endbuchstabenwert | Seltene oder schwierige Endbuchstaben geben Bonus | Taktische Entscheidungen fördern |
| Tempo-Bonus | Frühe Antwort im Timer bringt Zusatzpunkte | Spiel beschleunigen |
| Combo | Mehrere gültige Züge ohne Fehler | Flow und Spannung erhöhen |
| Kategorienbonus | Wort passt exakt in die aktuelle Kategorie | Varianten stärken |
| Wiederholungs-Malus | Bereits genutztes Wort kostet Punkte oder Zug | Spam verhindern |
| Challenge-Bonus | Spezielle Tages- oder Eventregeln | Live-Ops und Wiederspielwert |

### Seltenheitsmodell für Buchstaben
Das Produkt sollte Sprache pro Sprache ein konfigurierbares Letter-Value-Modell haben. Für Deutsch können Buchstaben wie Q, X, Y oder seltene Endungen höhere Werte liefern, während häufige Endbuchstaben wie E oder N weniger Punkte geben. Die konkrete Gewichtung sollte datenbasiert kalibriert werden und als Konfigurationsdatei vorliegen.[cite:43]

## Produktstruktur
### Module
- Voice Engine: Mikrofon, Erkennung, Segmentierung, Transkription.
- Rule Engine: Start-/Endbuchstaben, Duplikate, Kategorien, Timer, Zugwechsel.
- Score Engine: Punkte, Boni, Serien, Strafen.
- Session Engine: Lobby, Spielerreihenfolge, Status.
- UI Layer: Visualisierung, Feedback, Animationen.
- Content Layer: Kategorien, Themes, Events, Lokalisierung.
- Analytics Layer: Spielmetriken, Abbruchpunkte, Regelkonflikte.

### Themes
Die zugrunde liegende Logik sollte themenfähig sein. Auf dieselbe Regel-Engine können visuelle Pakete gesetzt werden, etwa:
- Classic Letters.
- Animals Adventure.
- Space Chain.
- Magic Academy.
- Tech Hacker.

Damit kann dieselbe Mechanik für Familien, Jugendliche oder erwachsene Casual-Spieler unterschiedlich inszeniert werden, ohne das Kernsystem neu zu bauen.

## UX- und Screen-Konzept
### Hauptscreens
| Screen | Zweck | Kerninhalte |
|---|---|---|
| Home | Einstieg | Play, Modi, Profil, Daily Challenge |
| Lobby | Runde vorbereiten | Spieler, Reihenfolge, Regeln, Thema |
| In-Game | Aktive Runde | Großes Startzeichen, Wortverlauf, Timer, Punkte |
| Validation Overlay | Feedback | Korrekt, falsch, doppelt, unverständlich |
| Round Summary | Rundenergebnis | Scoreboard, Highlights, längstes Wort |
| Stats | Langzeitbindung | Siege, Lieblingsbuchstaben, Serien |
| Settings | Anpassung | Sprache, Mikrofon, Accessibility, Jugendschutz |

### In-Game-Designprinzipien
- Der nächste Startbuchstabe muss das dominanteste visuelle Element sein.
- Der aktive Spieler muss jederzeit eindeutig markiert sein.
- Die letzten 5 bis 10 Wörter müssen sofort lesbar bleiben.
- Validierungsfeedback muss in unter 500 Millisekunden erscheinen, sofern die Plattform dies hergibt.
- Fehler müssen freundlich behandelt werden, etwa mit Vorschlägen oder Retry-Option im Casual-Modus.

### Accessibility
- Große Kontraste und große Letter-Darstellung.
- Optionale Farbcodierung nicht als einziges Signal.
- Untertitel bzw. Live-Text für gehörlose oder lärmintensive Umgebungen.
- Vereinfachter Kinder-Modus mit weniger UI-Dichte.

## Technische Architektur
### Zielarchitektur für den MVP
Eine clientzentrierte Web/PWA-Architektur ist für den ersten Release geeignet:
- Frontend: React oder alternatives leichtgewichtiges Web-Framework.
- Realtime: WebSocket oder Firebase/Supabase Realtime.
- Speech: Web Speech API im Browser für den ersten Testbetrieb.[cite:1][cite:13][cite:17][cite:56]
- Wörterbuch/Validierung: zunächst lokales Lexikon plus optionale Serverprüfung.
- Hosting: statisches Frontend plus kleiner Session-Service.

### Zielarchitektur für Android
- App: Kotlin oder plattformübergreifender Stack mit nativer Speech-Brücke.
- Speech: Whisper/TFLite oder ähnliche On-Device-ASR-Implementierung.[cite:8][cite:50][cite:51][cite:52]
- Session: WebSocket/Firebase/Supabase.
- Lokale Persistenz: Room oder einfache lokale Datenbank.
- Audio Pipeline: Voice Activity Detection, Chunking, Transkriptionsfenster.

### Open-Source-Strategie
Eine modulare GitHub-Struktur ist sinnvoll:

```text
wordchain-app/
├── apps/
│   ├── pwa/
│   └── android/
├── packages/
│   ├── rule-engine/
│   ├── score-engine/
│   ├── content-core/
│   ├── ui-kit/
│   └── speech-adapters/
├── docs/
├── assets/
└── examples/
```

Diese Struktur erlaubt, die eigentliche Regel-Engine unabhängig von Frontend und Speech-Implementierung zu pflegen. Das erhöht Wiederverwendbarkeit und Community-Beiträge.

## Datenmodell
### Zentrale Entitäten
- User: Profil, Name, Statistiken, Präferenzen.
- PlayerSession: Zuordnung Spieler zu einer Runde.
- GameRoom: Status, Regeln, Sprache, Thema, Modus.
- Turn: Spieler, Wort, Startbuchstabe, Endbuchstabe, Timestamp, Dauer.
- ScoreEvent: Punkteänderung mit Grund.
- DictionaryEntry: Wort, Sprache, Kategorie, Gültigkeit.
- Challenge: Tagesregeln, Eventparameter, Belohnung.

### Beispiel für Turn-Datensatz
```json
{
  "turnId": "t_104",
  "playerId": "p_2",
  "spokenWord": "Tiger",
  "normalizedWord": "tiger",
  "requiredStart": "t",
  "actualStart": "t",
  "endLetter": "r",
  "isDuplicate": false,
  "isValid": true,
  "durationMs": 4210,
  "scoreDelta": 14,
  "reasons": ["base", "length_bonus", "tempo_bonus"]
}
```

## Validierung und Spielregeln
### Prüfpfad pro Zug
1. Audio empfangen.
2. Text normalisieren, etwa Kleinschreibung und Sonderzeichenbehandlung.
3. Kandidatenwort extrahieren.
4. Startbuchstabe gegen Soll-Buchstaben prüfen.
5. Wortlänge und Blacklist prüfen.
6. Duplikate in Session prüfen.
7. Optional Wörterbuch- oder Kategorienprüfung durchführen.
8. Ergebnis und Punkte an UI senden.

### Edge Cases
- Mehrdeutige Spracherkennung.
- Namen, Marken oder Dialektwörter.
- Umlaute und sprachspezifische Normalisierung.
- Letzter Buchstabe ist phonetisch schwierig oder Sonderzeichen.
- Mehrere Spieler sprechen gleichzeitig.
- Lärm in der Umgebung.

Dafür sollte das Produkt drei Validierungsstufen bieten: locker, standard und streng. So bleibt das Spiel im Casual-Bereich nicht frustrierend.

## Content- und Progressionssystem
### Kurzfristige Motivation
- Sofortiger Score und Sounds.
- Tages-Challenges.
- Serien und Streaks.
- Schnell teilbare Ergebnis-Screens.

### Langfristige Motivation
- Freischaltbare Themes.
- Erfolge wie „10 perfekte Züge“ oder „Q-Meister“.
- Saisonale Events.
- Bestenlisten für private Gruppen und globale Modi.

### Bildungs- und Family-Layer
- Altersgerechte Wortlisten.
- Sichere Kategorien.
- Optionale Erklärung unbekannter Wörter.
- Eltern- oder Lehrkraftmodus.

## Geschäftsmodell
### Empfohlener Start
Für den Open-Source-Ansatz ist ein Freemium-Modell am passendsten:
- Basis-Spiel kostenlos.
- Premium-Themes oder Event-Pakete kostenpflichtig.
- Erweiterte Statistiken oder Klassenraum-Funktionen als Plus-Paket.
- White-Label- oder Education-Variante als B2B-Option.

### Alternativen
- Einmalzahlung ohne Ads.
- Sponsoring oder Partner-Themes.
- Community-getriebene Open-Core-Strategie.

Ein rein werbefinanziertes Modell passt schlechter, weil die Runde durch Werbeunterbrechungen schnell zerstört würde.

## Risiken
| Risiko | Beschreibung | Gegenmaßnahme |
|---|---|---|
| Speech-Fehler | Falsche Transkription erzeugt Frust | Confirm-UI, Retry, Android-Fokus, Qualitätsmetriken |
| Browser-Limitierung | Web Speech funktioniert nicht überall gleich gut | PWA nur als MVP, später native Android-Variante [cite:13][cite:56] |
| Wörterbuchstreit | Was gilt als korrektes Wort | Flexible Regelprofile, Community-Wortlisten |
| Naming-Kollision | Viele Store-Apps nutzen ähnliche Namen | Stärkeres Branding, etwa VoiceChain oder LetterLoop |
| Moderationsbedarf | Online-Räume können missbraucht werden | Private Rooms, Reports, Filter |
| Technische Latenz | Live-Feedback dauert zu lange | Kleine Audiofenster, optimierte Validierung |

## Roadmap
### Phase 1: Discovery
- Regelwerk finalisieren.
- Letter-Value-Modell für Deutsch definieren.
- 20 bis 30 Testspiele analog oder als Klickdummy begleiten.
- Naming- und Branding-Test durchführen.

### Phase 2: MVP PWA
- Lokale Mehrspieler-Runde.
- Basis-Voice-Erkennung im Browser.[cite:17][cite:56]
- Validierung, Scoreboard, Wortverlauf.
- Kategorien und Kinder-Modus in einfachster Form.

### Phase 3: Beta
- Online-Lobbies.
- Benutzerkonten.
- Statistiken und Challenges.
- Theme-System.
- Analytics und Crash-/Voice-Debugging.

### Phase 4: Android
- On-Device-Spracherkennung mit Whisper/TFLite oder ähnlichem Stack.[cite:8][cite:50][cite:51][cite:52]
- Bessere Audiosegmentierung.
- Offline- oder Low-Connectivity-Modus.
- Performanceoptimierung auf Mittelklassegeräten.

## Erfolgsmetriken
### Produktmetriken
- Runde gestartet pro Besucher.
- Runde abgeschlossen pro gestarteter Runde.
- Durchschnittliche Rundendauer.
- Züge pro Runde.
- Anteil validierter vs. verworfener Wörter.
- Wiederkehrquote nach 1, 7 und 30 Tagen.

### Speech-Metriken
- Transkriptionsfehlerquote.
- Durchschnittliche Validierungszeit.
- Retry-Rate pro Zug.
- Anteil manueller Korrekturen.

### Community-Metriken
- Erstellte private Räume.
- Einladungen pro Nutzer.
- Nutzung von Themes und Challenges.
- GitHub-Stars, Issues und Community-Beiträge bei Open Source.

## Empfehlung
Das Produkt sollte als Open-Source-PWA mit klar abgegrenzter Rule-Engine starten und möglichst schnell in echten Gruppen getestet werden. Der eigentliche Wert entsteht nicht durch ein neuartiges Regelprinzip, sondern durch reibungslose Voice-Moderation, fair wahrgenommene Validierung und eine starke Gruppenerfahrung.[cite:1][cite:3][cite:13]

Sobald die Kernmechanik und UX sitzen, ist eine Android-Version mit stärker kontrollierter Speech-Pipeline der sinnvollste nächste Schritt. Genau dort liegt die realistische Chance, sich von bestehenden Wortketten- und Puzzle-Angeboten sichtbar abzuheben.[cite:8][cite:50][cite:51]
