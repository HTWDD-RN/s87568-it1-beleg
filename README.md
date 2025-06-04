# Lernprogramm

## Erfüllte Aufgaben
+ Programm funktioniert, Anforderung mit internen Mathematikaufgaben und Katex parsing
+ funktionsfähige Nutzung des externen Aufgabenservers
+ Kategorie Notenlernen (einfach gehalten)
+ Piano-Keyboard auch als Antwortmöglichkeit
+ Kategorie "Allgemein" erlaubt Mehrfachauswahl
+ Progress tracking für die Aufgaben einer gewählten Kategorie
+ Offline PWA-Umsetzung (manifest und service worker)

## Nichterfüllte Aufgaben
+ Statistik anzeigen

## Browser Support
+ Chromium, Safari, Firefox

## Geborgter Code
+ https://stuartmemo.com/qwerty-hancock/ for web keyboard
+ Fischer-Yates Shuffle: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array for randomizing arrays
+ VexFlow: https://github.com/0xfe/vexflow for rendering music notation

# Probleme
+ keine Audio bei Iphone 
+ Keyboard auf dem Handy zu empfindlich
+ Aufgabenserver bzw. "allgemein"-Kategorie braucht eduVpn
+ offline funktioniert Kategorie "allgemein" nicht wirklich, weil keine Pages gecached oder prefetched werden
+ manche Workarounds sind nicht optimal, z.B. dass EventListender von Buttons über eine globale Variable entkoppelt werden
+ keine Testabdeckung durch Unit-tests
+ im HTML von der generierten Seite sind die Lösungen für Kategorien mathe, noten und web im data-correct attribut der Buttons enthalten, was nicht optimal ist
+ Struktur im Presenter hat zum Teil wiederholenden Code für Kategorien. Zwar müssen manche getrennt behandelt werden, aber es wäre schöner, wenn es eine generelle Lösung gäbe
+ Musik Fragen sind nicht so ausgereift
+ Vielleicht Reihenfolge der Aufgaben in einer Kategorie-Runde auch nach jeder Frage dem Zufall überlassen