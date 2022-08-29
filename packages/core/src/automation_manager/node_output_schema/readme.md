这里是目前 trigger、action 节点的 output schema，以 json 格式存储。与数据库中保持一致。

代码中并不会起作用，以数据库为主，这里是备份。用于前期做修改时同步调试。

## changelog

### 2021-09-16

从 record.fields.fieldId 的多级结构改为扁平结构。数表 3 个 trigger 的 output 相同

```ts
interface IOutput {
  datasheetName: string;
  datasheetId: string;
  recordId: string;
  recordUrl: string;
  [fieldId: string]: any;
}
```

https://www.notion.so/UI-2021-09-13-d1c6e62d1f944baca9f3f623f9a9d447#6345e1cbefa54ec2a497b367e8233e7e
