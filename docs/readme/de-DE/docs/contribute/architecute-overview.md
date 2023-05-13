# Verstehen Sie APITable - Überblick über die Architektur

APITable besteht konzeptionell aus zwei Teilen: Workbench und Datasheet.

Die Workbench verwaltet die Daten der Knoten, Organisationen und Benutzer und bietet SSO-, Audit-, Scheduler-, Permission-Dienste usw.

Das Datenblatt bietet Echtzeit-Zusammenarbeit für mehrere Mitarbeiter, die gleichzeitig mit den Datenblättern arbeiten können. Bemerkenswert ist, dass es eine Komponentenbibliothek namens Core gibt, die mit Redux entwickelt wurde. Die Core-Bibliothek enthält OT-Berechnungen und kann sowohl im Front-End als auch im Back-End verwendet werden.

Ein konkreteres Diagramm ist unten zu sehen:

![Architektur-Übersicht](../static/architecture-overview.png)

- UI: bietet eine extrem glatte, benutzerfreundliche, superschnelle Datenbank-Tabellenschnittstelle in. <canvas> Rendering Engine
- Web Server: erstellt mit Hilfe von Nextjs superschnelle, SEO-freundliche und extrem benutzerfreundliche statische Websites und Webanwendungen
- Backend Server: verarbeitet HTTP-Anfragen über Knoten, Benutzer, Organisationen, etc.
- Socket Server: stellt eine lange Verbindung mit Clients über das WebSocket-Protokoll her, was eine Zwei-Wege-Kommunikation und Echtzeit-Zusammenarbeit, Benachrichtigungen und andere Funktionen ermöglicht
- Room Server: verarbeitet Operationen (OTJSON) von Datenblättern, kommuniziert mit dem Socket Server über gRPC und bietet außerdem APIs für Entwickler
- Nest Server: bearbeitet HTTP-GET-Anfragen zu Datenblättern, Datensätzen, Ansichten usw.
- MySQL: speichert dauerhafte Daten, wie Datenblätter, Datensätze, Ansichten usw.
- Redis: speichert Zwischenspeicher, z. B. Anmeldesitzungen, aktuelle Daten usw.
- S3: speichert hochgeladene Dateien