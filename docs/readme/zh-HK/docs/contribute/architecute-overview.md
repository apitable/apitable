# 了解APITable——架構視圖

APITable 在概念上由兩部分組成：工作台和數據表。

The workbench maintains the nodes, organizations, and users' data, providing SSO, Audit, Scheduler, Permission services, etc.

datasheet提供實時協作，讓多個協作者同時操作datasheet。 值得注意的是，有一個名為Core的組件庫是用Redux開發的。 核心庫包含OT計算，前後端均可使用。

更具體的示意圖如下：

![Architecture Overview](../static/architecture-overview.png)

- UI：提供極其流暢、用戶友好、超快速的數據庫電子表格界面 <canvas> Rendering Engine
- Web 服務器：使用 Nextjs 構建強大的、SEO 友好的、非常面向用戶的靜態網站和 Web 應用程序
- `Backend Server`: handles HTTP requests about nodes, users, organizations, etc.
- Socket Server：通過WebSocket協議與客戶端建立長連接，實現雙向通信和實時協作、通知等功能
- Room Server：處理數據表的操作（OTJSON），通過gRPC與Socket Server通信，也為開發者提供API
- `Nest Server`: handles HTTP GET requests about datasheets, records, views, etc.
- MySQL：存儲持久化數據，如數據表、記錄、視圖等。
- Redis：存放緩存，比如登錄session，熱點數據等。
- `S3`: stores uploaded files