# APITable CHANGELOG




## [v0.17.0-rc.2](https://github.com/apitable/apitable/releases/tag/v0.17.0-rc.2) (2023-01-31)


### Breaking Change

The minio docker image upgrade contains compatibility issue with old one:
```text
apitable-minio-1  | ERROR Unable to use the drive /data: Drive /data: found backend type fs, expected xl or xl-single - to migrate to a supported backend visit https://min.io/docs/minio/linux/operations/install-deploy-manage/migrate-fs-gateway.html: Invalid arguments specified
```
Use the following commands to fix that issue if you are not interested in historical attachments:
```bash
docker compose down -v --remove-orphans
rm -fr .data/minio
docker compose up -d
```

### Features and enhancements

* feat(backend-server): init-db-apitable initializer & multiple edition cloud mail template & update-api-deletescript & questionnaire and billing ([#237](https://github.com/apitable/apitable/pull/237)) @mr-kelly 

### Bug fixes

* fix: robot trigger official service slug ([#235](https://github.com/apitable/apitable/pull/235)) @wuyitaoBoomboommm

### What's more

* chore: readme l10n init ([#225](https://github.com/apitable/apitable/pull/225)) @mr-kelly
* chore(deps): bump cookiejar from 2.1.2 to 2.1.4 ([#227](https://github.com/apitable/apitable/pull/227)) @dependabot[bot] 
* refactor: enable strict type check ([#161](https://github.com/apitable/apitable/pull/161)) @arucil 
* chore(deps): bump ua-parser-js from 0.7.32 to 0.7.33 ([#232](https://github.com/apitable/apitable/pull/232)) @dependabot[bot] 
* Create FUNDING.yml ([#240](https://github.com/apitable/apitable/pull/240)) @mr-kelly 
* chore: remove some deprecated  property and class ([#236](https://github.com/apitable/apitable/pull/236)) @ChambersChan 
* test: dashboard module unit test ([#241](https://github.com/apitable/apitable/pull/241)) @yort-feng 
* Update Crowdin configuration file @mr-kelly 
* l10n: New Crowdin updates ([#228](https://github.com/apitable/apitable/pull/228)) @mr-kelly 
* l10n: New Crowdin updates ([#251](https://github.com/apitable/apitable/pull/251)) @mr-kelly 
* chore: remove oss temporary auto configuration class and deprecated api ([#250](https://github.com/apitable/apitable/pull/250)) @ChambersChan 
* New Crowdin updates ([#252](https://github.com/apitable/apitable/pull/252)) @mr-kelly 
* chore: bump dependent images ([#254](https://github.com/apitable/apitable/pull/254)) @networkhermit 


## [v0.17.0-rc](https://github.com/apitable/apitable/releases/tag/v0.17.0-rc) (2023-01-23)


### Bug fixes

* fix: make minor semver conflict @mr-kelly 
* fix: replace wrong email logo @xukecheng 
* fix: wrong variable @xukecheng 
* fix: replace wrong email templates ([#190](https://github.com/apitable/apitable/pull/190)) @xukecheng 
* fix: unable to operate members and teams ([#214](https://github.com/apitable/apitable/pull/214)) @MrWangQAQ 
* fix: the default value of the percent field cannot be reset ([#215](https://github.com/apitable/apitable/pull/215)) @alolonghun 
* fix: fusion api param validation decorators & qr code download failed & unable to operate members and teams ([#217](https://github.com/apitable/apitable/pull/217)) @mr-kelly 
* fix: the page crashes when the option field configures the color ([#219](https://github.com/apitable/apitable/pull/219)) @alolonghun 
* fix: expand record comment emoji reply ([#218](https://github.com/apitable/apitable/pull/218)) @MrWangQAQ 
* fix: color match ([#220](https://github.com/apitable/apitable/pull/220)) @alolonghun 
* fix: sync hosted version & fusion api param validation error  & login page QR code cannot be displayed  & wrong email folder name ([#223](https://github.com/apitable/apitable/pull/223)) @mr-kelly 

### What's more

* Merge branch 'develop' into release/0.17.0 @mr-kelly 
* chore: init changelog.md @mr-kelly 
* Chore/merge new feature ([#203](https://github.com/apitable/apitable/pull/203)) @laboonly 
* docs: change log @laboonly 
* docs: change log ([#204](https://github.com/apitable/apitable/pull/204)) @laboonly 
* Merge branch 'develop' into fix/wrong-email-logo @xukecheng 
* chore: disable eslint validate of super linter ([#211](https://github.com/apitable/apitable/pull/211)) @yort-feng 
* test: user module unit test ([#191](https://github.com/apitable/apitable/pull/191)) @yort-feng 
* chore: README show latest release tag ([#209](https://github.com/apitable/apitable/pull/209)) @mr-kelly 
* l10n: translation init ([#137](https://github.com/apitable/apitable/pull/137)) @mr-kelly 
## [v0.17.0-beta](https://github.com/apitable/apitable/releases/tag/v0.17.0-beta) (2023-01-16)


### Features and enhancements

* feat: hosted version update, event manager refactor, mobile date-picker i18n, new env config ([#148](https://github.com/apitable/apitable/pull/148)) @mr-kelly 
* feat: github issues templates of docs and question ([#175](https://github.com/apitable/apitable/pull/175)) @mr-kelly 
* feat: clear a bad smell code  ([#179](https://github.com/apitable/apitable/pull/179)) @zhou-yg 
* feat: enable super-lint ([#194](https://github.com/apitable/apitable/pull/194)) @mr-kelly 
* feat: timezone environment variables support ([#187](https://github.com/apitable/apitable/pull/187)) @shawndenggh 

### Bug fixes

* fix: stop satackey/action-docker-layer-caching for building success ([#149](https://github.com/apitable/apitable/pull/149)) @mr-kelly 
* fix: share crash @wangkailang 
* fix: share crash ([#151](https://github.com/apitable/apitable/pull/151)) @JaneSu 
* fix: web-server local start axios base url ([#155](https://github.com/apitable/apitable/pull/155)) @wangkailang 
* fix: copy cell menu item is hidden in gallery and kanban view ([#158](https://github.com/apitable/apitable/pull/158)) @alolonghun 
* fix: import-double-quotes-to-single-quotes ([#163](https://github.com/apitable/apitable/pull/163)) @wuyitaoBoomboommm 
* fix: eslint error and ass scripts ([#164](https://github.com/apitable/apitable/pull/164)) @wangkailang 
* fix: template usage crash @wangkailang 
* fix: add pre-action releaseLocks before init-db run ([#165](https://github.com/apitable/apitable/pull/165)) @shawndenggh 
* fix: template usage crash ([#166](https://github.com/apitable/apitable/pull/166)) @JaneSu 
* fix: the content is missing after the mobile form is submitted ([#168](https://github.com/apitable/apitable/pull/168)) @alolonghun 
* fix: add main widget message listener ([#169](https://github.com/apitable/apitable/pull/169)) @MrWangQAQ 
* fix: avtar color is covered when edit user nickName @LiuZijingBron 
* fix: avtar color is covered when edit user nickName ([#170](https://github.com/apitable/apitable/pull/170)) @LiuZijingBron 
* fix: replace billing field ([#172](https://github.com/apitable/apitable/pull/172)) @shawndenggh 
* fix: eslint error ([#182](https://github.com/apitable/apitable/pull/182)) @wangkailang 
* fix: modify spring mail config ([#186](https://github.com/apitable/apitable/pull/186)) @LiuZijingBron 
* fix: register user default avatar may be null @LiuZijingBron 
* fix: register user default avatar may be null ([#189](https://github.com/apitable/apitable/pull/189)) @LiuZijingBron 
* fix: eslint fix &  super-linter ready ([#181](https://github.com/apitable/apitable/pull/181)) @mr-kelly 
* fix: register user default avatar may be null & avatar renderer ([#193](https://github.com/apitable/apitable/pull/193)) @mr-kelly 
* fix: super-linter jscpg ignore test files ([#202](https://github.com/apitable/apitable/pull/202)) @mr-kelly 

### What's more

* release: v0.17.0-alpha ([#146](https://github.com/apitable/apitable/pull/146)) @mr-kelly 
* chore: fix devenv & integrate appdata ([#154](https://github.com/apitable/apitable/pull/154)) @networkhermit 
* refactor: split database module to submodules ([#152](https://github.com/apitable/apitable/pull/152)) @yort-feng 
* chore: performance profiling tools ([#159](https://github.com/apitable/apitable/pull/159)) @arucil 
* Merge branch 'develop' into fix/template-usage-crash @JaneSu 
* Merge branch 'develop' into fix/template-usage-crash @wangkailang 
* chore: hosted sync @mr-kelly 
* chore: optimise email verify html ([#184](https://github.com/apitable/apitable/pull/184)) @xukecheng 
* chore(deps): bump class-validator from 0.12.2 to 0.14.0 ([#183](https://github.com/apitable/apitable/pull/183)) @dependabot[bot] 
* chore(deps): bump json5 from 1.0.1 to 1.0.2 ([#132](https://github.com/apitable/apitable/pull/132)) @dependabot[bot] 
* test: developer module unit test ([#171](https://github.com/apitable/apitable/pull/171)) @yort-feng 
## [v0.17.0-alpha](https://github.com/vikadata/vikadata/releases/tag/v0.17.0-alpha) (2023-01-05)

First release of APITable.
