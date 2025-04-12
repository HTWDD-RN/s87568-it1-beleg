# Weg zum Beleg Webprogrammierung 1

## Übersicht schaffen und erste Schritte
+ Aufgabenstellung durchgelesen und nötige Anforderungen sowie Konzepte in Relation gesetzt
+ Ein grundsätzliches Vorgehen wird beschrieben, an das ich mich circa halten will
+ Hinweise zum eigenen Github Repo befolgen
    + Wie mache ich ein neues Repo in einem Github Team?
    + Wie ändere ich das remote Repo? 
    + Ich sollte ja nicht ständig durch git push automatisch auf das Ausgangsrepo pushen!
+ Übersicht über Inhalte des repos machen
    + Bsp. Service worker
    + demo mpv architektur
+ Was ist ein "Manifest"
    + enthält infos über die App, wenn diese als offline App zur Verfügung stehen soll

> 2h Arbeit bis hier

## HTML - Grundgerüst
+ Hauptteil ist schon im Praktikum entstanden
+ es folgt jetzt eine Überarbeitung nachdem die Aufgabenstellung klar ist
+ nutzen von aria labels
+ Nutze nav-bar für das Aussuchen der Lernkategorie
+ verteile class="clickable", um dann in css cursor: pointer; zu setzten
    + sprich sinvoller einen Stilklassennamen zu finden für eine UI-Eigenschaft, als diese für jedes zutreffende Element einzeln im css zu setzen
+ sich Gedanken machen über passende containerh
+ man kann erstmal alles in div's modellieren und entsprechende id's verteilen und dann nach sinvollen existierenden HTML tags suchen um diese zu einzusetzen

> 3h bis hier

## CSS - Erst-styling, root-variablen, Layout
+ ul in nav eher als display flex, um die li besser zu verwalten (Layout)
+ viel herumgespielt mit margins
+ prozentuale Zuweisung von height und width führt in manchen Fällen zum herausragen aus dem umgebenden Container
+ immer relative maße wie em, vh benutzen
+ schöne Farbkombinationen nutzen via Farbpalette aus Tailwindcss
+ user-select: none; , um text eines Elements nicht interagierbar zu machen
+ klares Layout, Farbpalette geschaffen, sinvolle Klassen und id's eingeführt
+ Styling kann sehr kleinteilig werden. Man darf sich nicht im Tunnelblick verlieren => erstmal weitermachen mit Funktionalität und dann evtl. weiter stylen
+ Schriftgröße abhängig machen von Fensterbreite ist super

> 4.5h bis hier

## erste Funktionalitäten mit js, Model-View-Presenter Architektur nutzen
+ aufteilen in mehrere Module
+ mehr input zu js durch die VL gewinnen

> 7h bis hier

+ es erscheint sinnvoll zu Modellieren, welche Methoden gebraucht werden, bevor sich an eine Implementierung der erstbesten gewagt wird:
    - Model: 
        + JSON Datei mit statischen Fragen. Wie wird in  Javascript auf eine JSON Datei zugegriffen?
        + JSON zusätzliche Kommata verboten

+ import in js sucht relativ von aufrufendem skript, während fetch relativ vom aufrufenden .html file sucht
+ ist es möglich aus JSON Datei nur einen Teil in RAM zu laden und nicht alles? => nein es wird immer die ganze Datei geladen

> 8h bis hier

+ Reihenfolge für innitialisierung der Klassen und laden der Html seite wichtig
+ besser ist es die Variablen zu initialisieren, sonst kommt manchmal ein undefined dazu
+ wenn ein Eventlistener eine Funktion aufruft, weil diese als Parameter mitgegeben wurde,dann ist der this-Kontext dieser FUnktion das event!
+ nutze den Fisher-Yates Algorithmus um die Ordung eines Arrays dem Zufall zu überlassen (https://medium.com/@khaledhassan45/how-to-shuffle-an-array-in-javascript-6ca30d53f772)
+ button Funktionalitäten ergänzt

> 11.5h bis hier
+ midi virtual keyboard eingebaut. https://stuartmemo.com/qwerty-hancock/
+ latex sollte selbst in die Aufgaben geschrieben werden!!!!