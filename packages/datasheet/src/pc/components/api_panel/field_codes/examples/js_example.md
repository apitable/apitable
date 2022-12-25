
## 初始化 SDK [![github]({{ githubIcon }})](https://github.com/vikadata/vika.js)

```js
// 如果不能使用 es6 import，可用 const Vika = require('@vikadata/vika').default; 代替
import { Vika } from "@vikadata/vika";

const vika = new Vika({ token: "{{ apiToken }}", fieldKey: "{{ fieldKey }}" });
// 通过 datasheetId 来指定要从哪张维格表操作数据。
const datasheet = vika.datasheet("{{ datasheetId }}");
```

<!--split-->

## 获取记录

```js

// 获取 {{ viewId }} 视图下的记录, 默认返回第一页。
datasheet.records.query({ viewId: "{{ viewId }}"}).then(response => {
  if (response.success) {
    console.log(response.data);
  } else {
    console.error(response);
  }
});

```

### 示例返回值

```json
{{ response }}
```

### 其他参数或提示
```js
/**
 * 全局参数配置
 */
new Vika({
  /**
   * (必填) string 你的 API Token，用于鉴权
   */
  token: 'YOUR_API_TOKEN',
  /**
   * （选填）全局指定 field 的查询和返回的 key。默认使用列名  'name' 。指定为 'id' 时将以 fieldId 作为查询和返回方式（使用 id 可以避免列名的修改导致代码失效问题）
   */
  fieldKey: 'name', // 默认值
  /**
   * （选填）请求失效时间
   */
  requestTimeout: 60000, // 默认 60000ms (10 秒)
  /**
   * （选填）目标服务器地址
   */
  host: 'https://api.vika.cn/fusion/v1', // 默认值
});

/*******************************/

// 获取记录
datasheet.record.query({
  /**
   * （选填）视图ID。默认为维格表中第一个视图。请求会返回视图中经过视图中筛选/排序后的结果，可以搭配使用fields参数过滤不需要的字段数据
   */
  viewId: 'viewId1',
  /**
   * （选填）对指定维格表的记录进行排序。由多个“排序对象”组成的数组。支持顺序：'asc' 和 逆序：'desc'。注：此参数指定的排序条件将会覆盖视图里的排序条件。
   */
  sort: [{ field: 'field1': order: 'asc' }],
  /**
   * （选填）recordIds 数组。如果附带此参数，则返回参数中指定的records数组。 返回值按照传入数组的顺序排序。此时无视筛选、排序。无分页，每次最多查询 1000 条
   */
  recordIds: ['recordId1', 'recordId2'],
  /**
   * （选填）指定要返回的字段（默认为字段名, 也可以通过 fieldKey 指定为字段 Id）。如果附带此参数，则返回的记录合集将会被过滤，只有指定的字段会返回。
   */
  fields: ['标题', '详情', '引用次数'],
  /**
   * （选填）使用公式作为筛选条件，返回匹配的记录，访问 https://vika.cn/help/tutorial-getting-started-with-formulas/ 了解公式使用方式
   */
  filterByFormula: '{引用次数} >  0',
  /**
   * （选填）限制返回记录的总数量。如果该值小于表中实际的记录总数，则返回的记录总数会被限制为该值。
   */
  maxRecords: 5000,
  /**
   * （选填）单元格值类型，默认为 'json'，指定为 'string' 时所有值都将被自动转换为 string 格式。
   */
  cellFormat: 'json',
  /**
   * （选填）指定 field 的查询和返回的 key。默认使用列名  'name' 。指定为 'id' 时将以 fieldId 作为查询和返回方式（使用 id 可以避免列名的修改导致代码失效问题）
   */
  fieldKey: 'name',
});

/*******************************/

/**
 * 和 query 获取记录参数相同，自动处理分页。直到获取到所有数据为止。
 */
const allRecordsIter = datasheet.records.queryAll()
for await (const eachPageRecords of allRecordsIter) {
  console.log(eachPageRecords)
}
```

<!--split-->

## 新增记录
```js
// add 方法接收一个数组值，可以同时创建多条 record，单次请求可最多创建10条 record
datasheet.records.create({{ records }}).then(response => {
  if (response.success) {
    console.log(response.data);
  } else {
    console.error(response);
  }
})
```

### 示例返回值

```json
{{ response }}
```


### 其他参数或提示

add 接口接收一个数组值，可以同时创建多条 record，单次请求可最多创建10条 record

<!--split-->

## 更新记录
```js
/**
 * update 接收一个数组值，可以同时更新多条 record，单次请求可最多更新10条 record
 * 特别注意： update 只会更新你传入的 fields 下的数据，未传入的不会影响，如果需要清空值，请显式传入 null
 */
datasheet.records.update({{ records }}).then(response => {
  if (response.success) {
    console.log(response.data);
  } else {
    console.error(response);
  }
})
```
### 示例返回值
```json
{{ response }}
```


### 其他参数或提示

update 接口接收一个数组值，可以同时更新多条 record，单次请求可最多更新10条 record
特别注意： update 只会更新你传入的 fields 下的数据，未传入的不会影响，如果需要清空值，请显式传入 null
  
<!--split-->

## 删除记录
```js
// del 方法接收一个数组值，可以同时删除多条 record，单次请求可最多删除10条 record
datasheet.records.delete({{ recordIds }}).then(response => {
  if (response.success) {
    console.log(response.data);
  } else {
    console.error(response);
  }
})
```
### 示例返回值
```json
{
  "code": 200,
  "success": true,
  "message": "请求成功"
}
```
### 其他参数或提示
delete 接口接收一个数组值，可以同时删除多条 record，单次请求可最多删除10条 record

<!--split-->

## 上传文件

```js
/*
 * 从 file input 中获取文件
 * <input id="input" name="file" type="file" accept="*" >
 * 或者在 NodeJs 中使用流读取文件
 * const file = fs.createReadStream(/your/file/path)
 *
 * 下方以浏览器环境作为示例
 */
const input = document.getElementById('input');

input.onchange = function () {
  const file = this.files[0];
  datasheet.upload(file).then(response => {
    /**
     * response 数据包括
     *   success: boolean
     *   code: number
     *   message: string
     *   data: IAttachment
     */
    if (response.success) {
      console.log(response.data);
    } else {
      console.error(response);
    }
  });
};

```
### 示例返回值

*Tips:上传完毕后，请尽快写入data 中的数据到附件单元格里，否则附件链接可能失效*

```json
{
  "code": 200,
  "success": true,
  "message": "请求成功",
  "data": {
    "id": "atcPtxnvqti5M",
    "name": "6.gif",
    "size": 33914,
    "mimeType": "image/gif",
    "token": "space/2020/09/22/01ee7202922d48688f61e34f12da5abc",
    "width": 240,
    "height": 240,
    "url": "https://s1.vika.cn/space/2020/09/22/01ee7202922d48688f61e34f12da5abc"
  }
}
```

### 其他参数或提示
delete 接口接收一个数组值，可以同时删除多条 record，单次请求可最多删除10条 record