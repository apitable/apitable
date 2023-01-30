<p align="center">
    <a href="https://apitable.com" target="_blank">
        <img src="docs/static/cover.png" alt="APITable封面圖像" />
    </a>
</p>

<p align="center">
    <!-- Gitpod -->
    <a target="_blank" href="https://gitpod.io/#https://github.com/apitable/apitable">
        <img src="https://img.shields.io/badge/gitpod-devenv-orange" alt="APITable Gitpod 開發環境" />
    </a>
    <!-- NodeJS -->
    <img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript 語言，NestJS 框架" />
    <!-- Java -->
    <img src="https://img.shields.io/badge/Java-ED8B00?logo=spring&logoColor=white" alt="Java 語言，Spring 框架" />
    <!-- hub.docker.com-->
    <a target="_blank" href="#installation">
        <img src="https://img.shields.io/docker/pulls/apitable/init-db" />
    </a>
    <!-- Github Release Latest -->
    <a target="_blank" href="https://github.com/apitable/apitable/releases/latest">
        <img src="https://img.shields.io/github/v/release/apitable/apitable" />
    </a>
    <!-- Render -->
    <a target="_blank" href="https://render.com/deploy?repo=https://github.com/apitable/apitable">
        <img src="https://img.shields.io/badge/render-deploy-5364e9" />
    </a>
    <br />
    <!-- LICENSE -->
    <a target="_blank" href="https://github.com/apitable/apitable/blob/main/LICENSE">
        <img src="https://img.shields.io/badge/LICENSE-AGPL--3.0-ff69b4" alt="APITable License Badge AGPL" />
    </a>
    <!-- Discord -->
    <a target="_blank" href="https://discord.gg/TwNb9nfdBU">
        <img src="https://img.shields.io/discord/1016320471010115666?label=discord&logo=discord&style=social" />
    </a>
    <!-- Twitter -->
    <a target="_blank" href="https://twitter.com/apitable_com">
        <img src="https://img.shields.io/twitter/follow/apitable_com?label=Twitter&style=social" />
    </a>
    <!-- Github Action Build-->
    <a target="_blank" href="https://github.com/apitable/apitable/actions/workflows/build.yaml">
        <img src="https://github.com/apitable/apitable/actions/workflows/build.yaml/badge.svg" />
    </a>
</p>

<p align="center">
  English
  | 
  <a href="docs/readme/fr-FR/README.md">Français</a>
  | 
  <a href="docs/readme/es-ES/README.md">Español</a>
  | 
  <a href="docs/readme/de-DE/README.md">Deutsch</a>
  | 
  <a href="docs/readme/zh-CN/README.md">简体中文</a>
  | 
  <a href="docs/readme/zh-HK/README.md">繁體中文</a>
  | 
  <a href="docs/readme/ja-JP/README.md">日本語</a>
</p>

## ✨ 快速啟動

> APITable 目前是 `正在進行中的工作`。
> 
> We will publish the first release in late February 2023.
> 
> 加入 [Discord](https://discord.gg/TwNb9nfdBU) 或 [Twitter](https://twitter.com/apitable_com) 保持聯繫。<!-- If you just want try out APITable\[^info], using our hosted version at [apitable.com\](https://apitable.com). -->如果您只是想嘗試APITable[^info], 點擊這裡 [⚡️Gitpod 在線 Demo](https://gitpod.io/#https://github.com/apitable/apitable).

如果您想要在本地或雲端計算環境中安裝 APITable ，請參閱 [💾 安裝](#installation)

如果你想要設置你的本地開發環境，請閱讀我們的 [🧑stiptop_compute: 開發者指南](./docs/contribute/developer-guide.md)

## 🔥 功能特性

<table>
  
  <tr>
    <th>
      <a href="#">實時協同</a>
    </th>
    <th>
      <a href="#">Automatic Form</a>
    </th>

  </tr>

   <tr>
    <td width="50%">
      <a href="#">
        <img src="docs/static/feature-realtime.gif" />
      </a>
    </td>
    <td width="50%">
        <a href="#">
            <img src="docs/static/feature-form.gif" />
        </a>
    </td>
  </tr>

  <tr>
    <th>
      <a href="#">API-第一面板</a>
    </th>
    <th>
      <a href="#">無限跨表關聯</a>
    </th>
</tr>

 <tr>
    <td width="50%">
        <a href="#">
            <img src="docs/static/feature-api-first-panel.gif" />
        </a>
    </td>
    <td width="50%">
      <a href="#">
        <img src="docs/static/feature-unlimited-cross-table-links.gif" />
      </a>
    </td>
 </tr>

 <tr>
    <th>
      <a href="#">強大的行/列權限</a>
    </th>
    <th>
      <a href="#">Embed</a>
    </th>
  </tr>

 <tr>
    <td width="50%">
        <a href="#">
            <img src="docs/static/feature-permissions.gif" />
        </a>
    </td>
    <td width="50%">
        <a href="#">
            <img src="docs/static/feature-embed.gif" />
        </a>
    </td>
  </tr>

</table>

APITable 提供了一系列令人驚奇的功能，從個人到企業。

- Advanced technology stack and open-source
  - `實時合作` 允許多個用戶實時或與 `操作轉換(OT)` 算法同時進行編輯。
  - 在 `中極其順暢、方便用戶、超快的數據庫電子表格接口<canvas> 渲染引擎`
  - Database native architecture: Changeset / Operation / Action / Snapshot and so on.
  - **100k+** 數據行與實時合作。
  - Full-stack API access, from `Data` to `Metadata`.
  - 單向/雙向錶鏈接和 `無限交叉鏈接`
  - 社區友好的編程語言和框架，TypeScript ([下一步JS](https://nextjs.org/) + [NestJS](https://nestjs.com/)) 和 Java ([Spring 啟動](https://spring.io/projects/spring-boot))
- 美觀和齊全的多維表格UI界面
  - `CRUD`: 創建、閱讀、更新、刪除表、列和行
  - `字段操作`: 排序、過濾、分組、隱藏/取消隱藏、高度設置。
  - `基於`的空格：使用分開的工作區取代基於App/Base-的結構，使無限制的表格鏈接成為可能。
  - `可用的暗色模式` 和主題定製.
  - `7 種視圖類型`: 網格視圖(Dataseet) / 圖庫視圖/ Mindmap 視圖/ Kanban 視圖/全功能網格視圖/日曆視圖
  - 單擊API面板
- Batteries included
  - 內置的 10 + 官方模板。
  - 機器人自動化和自定義可用.
  - BI 儀表板
  - One-click auto-generated form
  - 可共享和嵌入的頁面。
  - 多語言支持
  - 與 n8n.io / Zapier / Appsmith... 及更多。
- 卓越的擴展性
  - 可擴展的 `部件系統` 有超過 20 個官員開源部件。
  - Customizable Graph & Chart & Dashboard
  - 可自定義數據列類型
  - Customizable Formulas
  - 可自定義自動機器人操作。
- 企業級權限
  - `鏡像`, 將視圖變成鏡像以實現行權限。
  - 通過非常簡單的操作激活 `列權限`。
  - 文件夾/子文件夾/文件權限
  - 樹結構文件夾和可自定義的節點(文件)；
  - 團隊管理 & 組織結構
- Enterprise features:
  - SAML
  - 單點登錄（SSO）
  - 審計
  - 數據庫自動備份
  - Data Exporter
  - 水標
- ....

使用可擴展的部件和插件，您可以添加更多功能。

## 💥 Use Cases

為什麼你必須知道APITable並作為你的下一個軟件？

- 作為超級管理軟件
  - Flexible Project Management & Tasks / Issues Management.
  - Marketing Lead Management.
  - 最靈活和可連接的CRM。
  - Flexible Business Intelligence (BI).
  - 有利於人民的形式和調查
  - Flexible ERP.
  - Low-code and no-code platform.
  - ...及更多, APITable 將 1000 個軟件放入您的口袋中。
- As a visual database infrastructure
  - **嵌入** 個應用到您自己的軟件界面。
  - Visual Database with REST API.
  - 管理儀表板
  - 中央配置管理。
  - **連接您所有的** 個軟件的全部企業數據庫。
  - ...及更多, APITable 連接到一切。
- 此外，它是開源和可擴展的

## 💞 API-oriented

#### API 面板

點擊右角的 `API` 按鈕將顯示 API 面板

#### SQL式查詢

APITable 將提供一個數據表查詢語言(DQL)來查詢您的數據庫電子表格內容。

## 💝 Embed-friendly

#### 分享和嵌入

分享您的數據表或文件夾。 通過複製和粘貼HTML腳本嵌入它們。

#### 企業準備嵌入

[APITable.com](https://apitable.com) 為證券提供更多準備好企業嵌入功能。

## 安裝

請確保您已在本地安裝 `docker` & `curl` 。

如果您的計算機安裝了 Docker ，打開您的終端並這樣運行：

```
curl https://apitable.github.io/install.sh | bash
```

然後在您的瀏覽器中打開 [https://localhost:80](https://localhost:80) 訪問它。 (默認用戶名 `admin@apitable.com` 和密碼 `Apitable2022`)

如果你想要設置你的本地開發環境，請閱讀我們的 [🧑‍💻 開發者指南 ](./docs/contribute/developer-guide.md)

## 🧑‍💻 Contributing

歡迎並感謝您有興趣為APITable作出貢獻！

除了編寫代碼，您還有許多方法可以做出貢獻。

你可以閱讀這個倉庫的 [貢獻指南](./CONTRIBUTING.md) 來學習如何貢獻.

這是一個快速指南來幫助您為API做出貢獻。

### 發展環境

在我們的 [開發者指南](./docs/contribute/developer-guide.md) 中學習如何設置您的本地環境。

### Git 工作流基礎

Here's a general APITable git workflow:

1. 創建一個問題並描述您想要的功能 -> [APITable 問題](https://github.com/apitable/apitable/issues)
2. 派生此項目 -> [Fork APIable 項目](https://github.com/apitable/apitable/fork)
3. 創建您的功能分支(`git 結帳-b 我-新功能`)
4. 提交您的更改(`git commit-am '添加一些功能'`)
5. 發佈分支 (`git 推送源自我的新功能`)
6. 創建新的拉取請求 -> [跨叉創建拉取請求](https://github.com/apitable/apitable/compare)

### 工作公約

APITable use these common conventions:

- 我們的 Git 分支模型是什麼？ [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/)
- 如何在派生項目上進行合作？ [Github Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- 如何寫入好的提交消息？ [常規承諾](https://www.conventionalcommits.org/)
- 我們的更新日誌格式是什麼？ [保留更新日誌](https://keepachangelog.com/en/1.0.0/)
- 如何進行版本控制和標記？ [語義版](https://semver.org/)
- Java 編碼準則是什麼？ [Java 編碼準則](https://github.com/alibaba/Alibaba-Java-Coding-Guidelines) | [Intellij IDEA 插件](https://plugins.jetbrains.com/plugin/10046-alibaba-java-coding-guidelines)
- 什麼是 TypeScript 編碼準則？ -> [TypeScript 樣式指南](https://google.github.io/styleguide/tsguide.html) | [ESLint](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)

### 文件

- [幫助中心](https://help.apitable.com/)
- [👩‍💻 開發者中心](https://developers.apitable.com/)
  - [🪡 REST API Docs](https://developers.apitable.com/api/introduction/)
  - 小部件 SDK (即將到來...)
  - Scripting (Coming soon...)

## 🛣 Roadmap

### 未來的功能

- 重代碼接口構建器
- 可嵌入第三方文件部分
- SQL類域特定語言
- IdP
- Web 3 功能
- ...

### 託管版本和企業版本提供高級功能

- IdP；
- SAML
- Single-Sign-On
- 審計
- 數據庫備份
- 水標

欲瞭解更多信息，請通過 <support@apitable.com> 聯繫我們。

## 👫 獲得參與

### :glube_showing_Asia-Australia：我們為什麼要創建 APITable 和 open-source？

- 我們認為 `數據庫是所有軟件` 的基石。
- We believe that making a `Visual Database with rich and easy user interface for everyone` can reduce the difficulty of software industry and increase the world's digitalization adoption.
- 我們認為開放源碼 `APITable` 工作可以 `將人類推向前進`

### 我們正在遠程僱用！

我們總是為APITable尋找優秀人才：

- **前端開發者**: 你有React, NextJS, TypeScript, WebPack的體驗。 你想要寫高質量的代碼，帶有清晰的文檔和單元測試。
- **後端開發者**: 你有經驗使用 NestJS, TypeScript, Spring Boot, Java, SQL, Kubernetes, Terraform. 你想要寫高質量的代碼，帶有清晰的文檔和單元測試。 And you like to write high quality code with clear documentation and unit tests.
- **Front-end developer**: You have experience with React, NextJS, TypeScript, WebPack. And you like to write high quality code with clear documentation and unit tests.

無論時間和條件如何，如果你想要加入APITable團隊， 請毫不猶豫地將您的 CV 發送到 [talent@apitable。 om](mailto:talent@apitable.com)。

## 📺 截圖

<p align="center">
    <img src="docs/static/screenshot-realtime.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-auto-form.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-api-panel.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-permissions.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-extensible.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-automation.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-marketing.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-hr.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-it.png" alt="APITable Screenshot Image" />
</p>
<p align="center">
    <img src="docs/static/screenshot-sales.png" alt="APITable Screenshot Image" />
</p>

## 🥰 許可協議

> 此倉庫包含在 AGPL 下發布的 Open Source 版本的 APITable源代碼。
> 
> 如果你想運行你自己的 APITable 副本或對發展作出貢獻，那就是你的地方。
> 
> 詳情請參閱 [LICENSING](./LICENSING.md)
> 
> 如果您想要在線使用 APITable ，那麼您不需要運行此代碼。 我們在 [APITable 上提供一個託管的應用版本。 om](https://apitable.com) 適合全局加速器。

<br/>

[^info]: 使用AGPL-3.0授權。 由 [APITable Ltd](https://apitable.com)設計。
