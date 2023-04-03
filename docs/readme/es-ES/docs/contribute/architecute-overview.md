# Comprender APITable - Visión General de la Arquitectura.

APITable está conceptualmente compuesta por dos partes: el banco de trabajo y la hoja de datos.

El banco de trabajo mantiene los nodos, las organizaciones y los datos de los usuarios, proporcionando servicios de SSO, Auditoría, Programador, Permisos, etc.

a hoja de datos proporciona colaboración en tiempo real para que múltiples colaboradores operen las hojas de datos al mismo tiempo. Lo que es notable es que hay una biblioteca de componentes llamada Core que está desarrollada con Redux. La biblioteca central contiene el cálculo OT y se puede utilizar tanto en el front-end como en el back-end.

Se puede ver un diagrama más concreto a continuación:

![Architecture Overview](../static/architecture-overview.png)

- `UI`: proporciona una base de datos extremadamente suave, fácil de usar y súper rápida. <canvas> Motor de Renderizado
- `Servidor Web`: construye sitios web y aplicaciones web estáticas, súper cargadas, amigables con el SEO y extremadamente orientadas al usuario utilizando `Nextjs`
- `Servidor Backend`: maneja solicitudes HTTP sobre nodos, usuarios, organizaciones, etc.
- `Servidor Socket`: establece una conexión larga con los clientes a través del protocolo WebSocket, lo que permite la comunicación bidireccional y la colaboración en tiempo real, notificaciones y otras características.
- `Servidor Room`: maneja las operaciones (OTJSON) de las hojas de datos, se comunica con el Servidor Socket a través de gRPC y también proporciona APIs para desarrolladores.
- `Servidor Nest`: maneja solicitudes HTTP GET sobre hojas de datos, registros, vistas, etc.
- `MySQL`: almacena datos persistentes, como hojas de datos, registros, vistas, etc.
- `Redis`: almacena caché, como sesión de inicio de sesión, datos calientes, etc.
- `S3`: almacena archivos cargados.