# Migrating a self-hosted APITable deployment to MySQL 8.4

The repository's Docker Compose default and unit-test database use MySQL 8.4.13. The all-in-one image installs from the MySQL 8.4 Community repository. This changes project defaults; it does **not** upgrade an existing database or prove that every deployment schema and migration is compatible.

## Choose a supported upgrade route

1. Record the exact source server version and review MySQL's [upgrade paths](https://dev.mysql.com/doc/refman/8.4/en/upgrade-paths.html) and [upgrade prerequisites](https://dev.mysql.com/doc/refman/8.4/en/upgrade-prerequisites.html). Do not assume every MySQL 8.0 patch can move directly to 8.4; follow any required intermediate upgrade.
2. Choose either MySQL's documented [in-place upgrade](https://dev.mysql.com/doc/refman/8.4/en/upgrade-binary-package.html#upgrade-procedure-inplace) or a [logical upgrade to a new instance](https://dev.mysql.com/doc/refman/8.4/en/upgrade-binary-package.html#upgrade-procedure-logical). A logical migration is often easier to stage and roll back. Do not point an 8.4 server at an 8.0 data directory without first following the supported in-place procedure.
3. Make and verify a restorable backup before changing the source or target. Test the restore on a separate, empty MySQL 8.4 instance and keep the original 8.0 instance/data directory untouched until the new deployment is verified. Never put database dumps or credentials in this repository.

## Authentication changes

MySQL 8.4 disables `mysql_native_password` by default. APITable no longer passes the removed `--default-authentication-plugin=mysql_native_password` option; new accounts use the server's default authentication plugin. Changing that default does not convert existing MySQL accounts. If an existing APITable account uses `mysql_native_password`, review MySQL's [authentication-plugin documentation](https://dev.mysql.com/doc/refman/8.4/en/native-pluggable-authentication.html) and migrate that account to a supported plugin, or follow MySQL's documented temporary compatibility procedure. Do not put passwords in command lines, issue reports, or source control.

For an existing Docker Compose deployment, update its local `IMAGE_MYSQL` setting to `mysql:8.4.13` (or another deliberately selected 8.4 patch) and follow the selected MySQL upgrade path for the data. Preserve any deployment-specific overrides and keep secrets in the deployment's existing secret mechanism; do not commit them.

## Verify before cutover

Use a staging copy, not production data, to restore the database and start APITable against MySQL 8.4. Confirm the database health check, application startup, and representative read/write workflows, and review application/server errors. Complete the project's normal migration and regression checks for the exact release being deployed. The small compatibility smoke test for Connector/J and Liquibase does not replace these application-level checks.

Keep the original instance and a verified backup available through the cutover. If validation fails, stop writes to the candidate, restore service against the untouched original instance or restore the backup using MySQL's documented recovery process; do not attempt to downgrade an 8.4 data directory in place.
