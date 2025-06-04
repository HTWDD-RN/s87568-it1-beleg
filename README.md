# Lernprogramm

, eventuelle Probleme Browsersupport


## Erfüllte Aufgaben
+ Programm funktioniert lt. Anforderung mit internen Mathematikaufgaben
+ funktionsfähige Nutzung des externen Aufgabenservers
+ Kategorie Notenlernen
+ Piano-Keyboard


## Externer Code
+ https://stuartmemo.com/qwerty-hancock/ for web keyboard
+ Fischer-Yates Shuffle: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array for randomizing arrays
+ VexFlow: https://github.com/0xfe/vexflow for rendering music notation


# Probleme
+ Fehlererkennung und -behandlung
+ offline funktioniert Kategorie "allgemein" nicht wirklich, weil keine Pages gecached oder prefetched werden
+ manche workarounds sind nicht optimal, z.B. dass EventListender von Buttons so komplex über eine globale Variable entbunden werden
+ keine allgemeine Statistikfunktion
+ keine Testabdeckung durch Unit-tests
+ im HTML von der generierten Seite sind die Lösungen für Kategorien mathe, noten und web im data-correct attribut der Buttons enthalten, was nicht optimal ist
+ Struktur im Presenter hat zum Teil wiederholenden Code für Kategorien. Zwar müssen manche getrennt behandelt werden, aber es wäre schöner, wenn es eine generelle Lösung gäbe
+ Musik Fragen sind nicht so ausgereift
+ Vielleicht Reihenfolge der Aufgaben in einer Kategorie-Runde auch nach jeder Frage randomizen