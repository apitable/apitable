# Zrozumieć APITable - przegląd architektury

APITable składa się koncepcyjnie z dwóch części: workbencha i datasheet.

Workbench utrzymuje węzły, organizacje i dane użytkowników, zapewniając usługi SSO, Audit, Scheduler, Permission itp.

Datasheet zapewnia współpracę w czasie rzeczywistym dla wielu współpracowników, którzy mogą obsługiwać arkusze danych w tym samym czasie. Co jest godne uwagi, istnieje biblioteka komponentów o nazwie Core, która jest rozwijana za pomocą Redux. Biblioteka core zawiera obliczenia OT i może być używana zarówno we front-endzie jak i back-endzie.

Bardziej konkretny schemat można zobaczyć poniżej:

![Architecture Overview](../static/architecture-overview.png)

- `UI`: zapewnia niezwykle płynny, przyjazny dla użytkownika, superszybki interfejs baza danych-arkusz w. <canvas> Renderowanie
- `Web Server`: buduje superdoładowane, przyjazne dla SEO i niezwykle przyjazne dla użytkownika statyczne strony i aplikacje internetowe przy użyciu Nextjs
- `Backend Server`: obsługuje żądania HTTP dotyczące węzłów, użytkowników, organizacji itp.
- `Socket Server`: nawiązuje długie połączenie z klientami poprzez protokół WebSocket, umożliwiając dwukierunkową komunikację i współpracę w czasie rzeczywistym, powiadomienia i inne funkcje.
- `Room Server`: obsługuje operacje (OTJSON) arkuszy danych, komunikuje się z Socket Serverem poprzez gRPC, a także udostępnia API dla deweloperów.
- `Nest Server`: obsługuje żądania HTTP GET dotyczące arkuszy danych, rekordów, widoków itp.
- `MySQL`: przechowuje trwałe dane, takie jak arkusze danych, rekordy, widoki, itp.
- `Redis`: przechowuje cache, taki jak sesja logowania, gorące dane, itp.
- `S3`: przechowuje przesłane pliki.