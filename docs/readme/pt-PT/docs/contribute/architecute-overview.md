# Compreender APITable - Visão Geral da Arquitectura

APITable é conceptualmente composto por duas partes: bancada de trabalho e ficha de dados.

A bancada de trabalho mantém os nós, organizações e dados dos utilizadores, fornecendo SSO, Auditoria, Agendador, Serviços de Permissões, etc.

A folha de dados fornece colaboração em tempo real para múltiplos colaboradores para operar as folhas de dados ao mesmo tempo. O que é digno de nota é que existe uma biblioteca de componentes chamada Core que é desenvolvida com Redux. A biblioteca de núcleo contém cálculo OT e pode ser utilizada tanto no front-end como no back-end.

Um diagrama mais concreto pode ser visto abaixo:

![Architecture Overview](../static/architecture-overview.png)

- `UI`: fornece uma interface de base de dados extremamente suave, de fácil utilização e super-rápida em. <canvas> Motor de renderização
- `Web Server`: construir website e aplicação web super carregada, SEO-friendly, e extremamente voltada para o utilizador, utilizando o Nextjs.
- `Backend Server`: trata de pedidos HTTP sobre nós, utilizadores, organizações, etc.
- `Socket Server`: estabelece uma longa ligação com clientes através do protocolo WebSocket, permitindo comunicação bidireccional e colaboração em tempo real, notificações, e outras características
- `Room Server`: gere operações (OTJSON) de folhas de dados, comunica com o Socket Server através do gRPC, e também fornece APIs para programadores.
- `Nest Server`: trata de pedidos HTTP GET sobre folhas de dados, registos, vistas, etc.
- `MySQL`: armazena dados persistentes, tais como folhas de dados, registos, visualizações, etc.
- `Redis`: armazena cache, tais como sessão de login, dados quentes, etc.
- `S3`: armazena ficheiros carregados.