
<!--split-->

## 获取记录

```shell
curl "{{ apiBase }}/fusion/v1/datasheets/{{ datasheetId }}/records?viewId={{ viewId }}&fieldKey={{ fieldKey }}" \
  -H "Authorization: Bearer {{ apiToken }}"

```

### 示例返回值

```json

{{ response }}

```

### 其他参数或提示
```js
/**
 * 注意：每张维格表获取数据最大并发量限制为 1 秒钟 5 次
 * 全部可配置的参数，可通过 URL Query Params 发送，
 */
{
  /**
   * （选填）视图ID。默认为维格表中第一个视图。请求会返回视图中经过视图中筛选/排序后的结果，可以搭配使用fields参数过滤不需要的字段数据
   */
  viewId: 'viewId1',
  /**
   * （选填）指定分页的页码，默认为 1，与参数pageSize配合使用。
   */
  pageNum: 1,
  /**
   * （选填）指定每页返回的记录总数，默认为100。此参数只接受1-1000的整数。
   */
  pageSize: 100,
  /**
   * （选填）对指定维格表的记录进行排序。由多个“排序对象”组成的数组。支持顺序：'asc' 和 逆序：'desc'。注：此参数指定的排序条件将会覆盖视图里的排序条件。
   */
  sort: [{ field: 'field1', order: 'asc' }],
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
}
```

<!--split-->

## 新增记录
```shell
curl -X POST "{{ apiBase }}/fusion/v1/datasheets/{{ datasheetId }}/records?viewId={{ viewId }}&fieldKey={{ fieldKey }}"  \
  -H "Authorization: Bearer {{ apiToken }}" \
  -H "Content-Type: application/json" \
  --data '{
  "records": {{ records }},
  "fieldKey": "{{ fieldKey }}"
}'

```

### 示例返回值

```json
{{ response }}
```

### 其他参数或提示

add 接口接收一个数组值，可以同时创建多条 record，单次请求可最多创建10条 record

<!--split-->

## 更新记录
```shell
curl -X PATCH "{{ apiBase }}/fusion/v1/datasheets/{{ datasheetId }}/records?viewId={{ viewId }}&fieldKey={{ fieldKey }}" \
  -H "Authorization: Bearer {{ apiToken }}" \
  -H "Content-Type: application/json" \
  --data '{
  "records": {{ records }},
  "fieldKey": "{{ fieldKey }}"
}'
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
```shell
curl -X DELETE "{{ apiBase }}/fusion/v1/datasheets/{{ datasheetId }}/records?{{ deleteParams }}" \
  -H "Authorization: Bearer {{ apiToken }}"

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

```shell
curl -X POST "{{ apiBase }}/fusion/v1/datasheets/{{ datasheetId }}/attachments" \
  -H "Authorization: Bearer {{ apiToken }}" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@{你的 文件路径};"
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