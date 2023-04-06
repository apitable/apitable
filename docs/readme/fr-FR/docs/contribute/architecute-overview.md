# Comprendre APITable - Aperçu de l'architecture

APITable est conceptuellement composé de deux parties : l'atelier et la feuille de données.

L'atelier maintient les nœuds, les organisations et les données des utilisateurs, fournissant des services SSO, d'audit, de planification, de permission, etc.

La feuille de données fournit une collaboration en temps réel permettant à plusieurs collaborateurs d'utiliser les feuilles de données en même temps. Il convient de noter qu'il existe une bibliothèque de composants appelée Core qui est développée avec Redux. La bibliothèque Core contient des calculs OT et peut être utilisée à la fois dans le front-end et le back-end.

Un diagramme plus concret est présenté ci-dessous:

![Architecture Overview](../static/architecture-overview.png)

- UI: fournit une interface de base de données et de feuilles de calcul extrêmement fluide, conviviale et ultra-rapide. <canvas> Moteur de rendu
- `Web Server`: construit un site Web statique et une application Web superchargés, conviviaux pour le référencement et extrêmement orientés vers l'utilisateur en utilisant Nextjs.
- `Backend Server`: gère les requêtes HTTP concernant les nœuds, les utilisateurs, les organisations, etc.
- `Socket Server`: établit une longue connexion avec les clients par le biais du protocole WebSocket, permettant une communication bidirectionnelle et une collaboration en temps réel, des notifications et d'autres fonctionnalités.
- `Room Server`: gère les opérations (OTJSON) des fiches de données, communique avec Socket Server via gRPC et fournit également des API pour les développeurs.
- `Nest Server`: gère les demandes HTTP GET concernant les fiches de données, les enregistrements, les vues, etc.
- `MySQL`: stocke les données persistantes, telles que les fiches de données, les enregistrements, les vues, etc.
- `Redis`: stocke le cache, comme la session de connexion, les données chaudes, etc.
- `S3`: stocke les fichiers téléchargés.