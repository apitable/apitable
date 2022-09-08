
# init-db 数据库初始化容器

vika-init主要用于
- MySQL数据库结构初始化
- ....（其它更多）

## 自动执行
线上环境，init-db这个docker，跟docker-compose、k8s脚本、Helm脚本已经绑定在一起。

线上部署，init容器就会自动执行，无需操心。

## 手工执行

如果你想在其它环境，手工执行一些“初始化工作”，可以按下面方法执行。


### 第一步：配置.env文件


首先你的电脑上要安装好1password-cli命令和docker命令。

1Password的安装，请参考[1Password CLI Install](https://developer.1password.com/docs/cli/get-started#install)
如果你是Ubuntu/Debian操作系统，可直接执行[scripts/install_utils.sh](./scripts/install_utils.sh)


之后，从1Password抓取秘钥，生成本地的.env文件，有两个环境变量：
- ENV:  通常是dev或env ，开发人员通常使用dev，其实对应了1Password的秘钥库(Vault)
- DB: DB类型，像mysql_development，对应了具体的数据库和1Password秘钥项(Item)

```bash
ENV=ops DB=mysql_integration make env
```

以上情形，通常适合在云端环境执行。

如果你是在本地电脑执行的话，你是无法连接云端数据库的，你需要先建立一个「云端数据库的网络隧道」。

详情请查看：[如何访问云端的开发数据库？](https://vikadata.feishu.cn/wiki/wikcnSHFTNJxFoI5mPvwFYu7Dge)


当隧道建立好之后，手工修改`.env`文件：
```bash
DB_HOST=host.docker.internal
DB_PORT=30666
...
```
> 是不是奇怪，为什么DB_HOST是host.docker.internal？
> 因为这个命令，是在容器中执行的，如果DB_HOST是127.0.0.1，它指向了容器内部，但是，数据库网络隧道，并不在容器内，而是在你的电脑上
> 而host.docker.interal，是macOS Docker的一个特殊域名，参考：https://docs.docker.com/desktop/mac/networking/#use-cases-and-workarounds

### 第二步: docker运行plan计划
dry_update，指的是，只输出计划结果，不实际执行。
第一步的环境配置完成后，只需要运行：

```bash
make plan
```

你接着看到输出一大堆SQL语句，即正常运行。

### 第三步: docker运行apply应用

经历了上一步，你已经大概了解数据库结构将会发生什么实际的变更了。
确保没问题后，执行apply进行实际更新。
```bash
make apply
```

接着你就看到`Running Changeset: xxxx...`，正实际执行数据库操作。

> 尽量不要对integration数据库和prouduction数据库手工执行apply，如因手工apply发生异常，后果自负。