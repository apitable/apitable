# APITable - 아키텍처 개요 이해하기

APITable은 개념적으로 workbench와 datasheet 두 부분으로 구성됩니다.

workbench는 노드, 조직, 사용자 데이터를 유지 관리하며 SSO, 감사, 스케줄러, 권한 서비스 등을 제공합니다.

datasheet는 다중 협업을 위해 실시간으로 여러 협력자가 동시에 datasheet를 조작할 수 있도록 제공합니다. 주목할 만한 점은 Redux로 개발된 Core라는 구성 요소 라이브러리가 있으며. 핵심 라이브러리에는 OT 계산이 포함되어 있으며 프론트 엔드 및 백엔드 모두에서 사용할 수 있습니다.

구체적인 다이어그램은 아래에서 볼 수 있습니다:

![아키텍처 개요 이해하기](../static/architecture-overview.png)

- UI: Web Server에서 Nextjs를 사용하여 초고속, 사용자 친화적이고 매우 빠른 데이터베이스 스프레드시트 인터페이스를 제공합니다. <canvas> 렌더링 엔진
- Web Server: Nextjs를 사용하여 초고속, SEO 친화적이고 매우 사용자 친화적인 정적 웹 사이트 및 웹 애플리케이션을 구축합니다.
- Backend Server: 노드, 사용자, 조직 등에 대한 HTTP 요청 처리.
- Socket Server: WebSocket 프로토콜을 통해 클라이언트와 장기간 연결을 설정하여 양방향 통신과 실시간 협업, 알림 등 기능을 제공합니다.
- Room Server: datasheets의 작업(OTJSON)을 처리하며, gRPC를 통해 Socket Server와 통신하며 개발자를 위한 API도 제공합니다.
- Nest Server: datasheets, records, views 등에 대한 HTTP GET 요청 처리.
- MySQL: datasheets, records, views 등과 같은 지속적인 데이터를 저장합니다.
- Redis: 로그인 세션, 핫 데이터 등 캐시를 저장합니다.
- `S3`: stores uploaded files