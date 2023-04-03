# APITable'ı Anlayın - Mimariye Genel Bakış

APITable kavramsal olarak iki bölümden oluşur: çalışma tezgahı ve veri sayfası.

Çalışma tezgahı, SSO, Denetim, Zamanlayıcı, İzin hizmetleri vb. sağlayarak düğümleri, kuruluşları ve kullanıcıların verilerini korur.

Veri sayfası, birden fazla işbirlikçinin veri sayfalarını aynı anda çalıştırması için gerçek zamanlı işbirliği sağlar. Dikkat çekici olan, Redux ile geliştirilen Core adlı bir bileşen kütüphanesinin bulunmasıdır. Core kütüphanesi OT hesaplamasını içeriyor ve hem ön uçta hem de arka uçta kullanılabiliyor.

Daha somut bir diyagram aşağıda görülebilir:

![Architecture Overview](../static/architecture-overview.png)

- `UI`: son derece akıcı, kullanıcı dostu, süper hızlı veritabanı-spreadsheet arayüzü sağlar.  <canvas> Sunum Aracı
- `Web Server`: Nextjs kullanarak süper şarjlı, SEO dostu ve son derece kullanıcıya dönük statik web sitesi ve web uygulaması oluşturun.
- `Backend Server`: düğümler, kullanıcılar, kuruluşlar vb. hakkındaki HTTP isteklerini işler.
- `Socket Server`: WebSocket protokolü aracılığıyla istemcilerle uzun bir bağlantı kurarak iki yönlü iletişim ve gerçek zamanlı işbirliği, bildirimler ve diğer özelliklere olanak sağlar
- `Room Server`: veri sayfalarının işlemlerini (OTJSON) gerçekleştirir, gRPC aracılığıyla Socket Server ile iletişim kurar ve ayrıca geliştiriciler için API'ler sağlar.
- `Nest Server`: veri sayfaları, kayıtlar, görünümler vb. hakkındaki HTTP GET isteklerini işler.
- `MySQL`: veri sayfaları, kayıtlar, görünümler vb. gibi kalıcı verileri depolar.
- `Redis`: oturum açma oturumu, sıcak veriler vb. gibi önbelleği depolar.
- `S3`: yüklenen dosyaları depolar.