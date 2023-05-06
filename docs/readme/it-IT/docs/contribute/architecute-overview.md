# Capire APITable - Panoramica dell'architettura

APITable è concettualmente composto da due parti: workbench e datasheet.

Il workbench gestisce i nodi, le organizzazioni e i dati degli utenti, fornendo servizi di SSO, Audit, Scheduler, Permessi, ecc.

Il datasheet fornisce una collaborazione in tempo reale per consentire a più collaboratori di operare contemporaneamente sui datasheet. L'aspetto degno di nota è che esiste una libreria di componenti chiamata Core, sviluppata con Redux. La libreria Core contiene calcoli OT e può essere utilizzata sia nel front-end che nel back-end.

Di seguito è riportato un diagramma più concreto:

![Architecture Overview](../static/architecture-overview.png)

- UI: fornisce un'interfaccia database-foglio di calcolo estremamente fluida, facile da usare e superveloce. <canvas> Rendering Engine
- Web Server: costruisce siti web statici e applicazioni web estremamente efficaci, SEO-friendly ed estremamente orientate all'utente, utilizzando Nextjs.
- Backend Server: gestisce le richieste HTTP su nodi, utenti, organizzazioni, ecc.
- Socket Server: stabilisce una lunga connessione con i client attraverso il protocollo WebSocket, consentendo una comunicazione bidirezionale e una collaborazione in tempo reale, notifiche e altre funzionalità.
- Room Server: gestisce le operazioni (OTJSON) delle schede tecniche, comunica con Socket Server tramite gRPC e fornisce anche API per gli sviluppatori.
- Nest Server: gestisce le richieste HTTP GET relative a schede dati, record, viste, ecc.
- MySQL: memorizza dati persistenti, come schede tecniche, record, viste, ecc.
- Redis: memorizza la cache, come la sessione di accesso, i dati caldi, ecc.
- S3: memorizza i file caricati