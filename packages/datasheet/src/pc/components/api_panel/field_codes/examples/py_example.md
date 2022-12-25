## 初始化 SDK [![github]({{ githubIcon }})](https://github.com/vikadata/vika.py)

```python
from vika import Vika
vika = Vika("{{ apiToken }}")
# 通过 datasheetId 来指定要从哪张维格表操作数据。
datasheet = vika.datasheet("{{ datasheetId }}", field_key="{{ fieldKey }}")
```

{{ fieldNameTips }}
<!--split-->

## 获取记录

```python
# 返回所有记录的集合
records = datasheet.records.all()
for record in records:
  print(record.json())

# 指定视图id，只返回该视图的记录
records_via_view = datasheet.records.all(viewId="{{ viewId }}")
# 查找并返回一条记录（如果存在多条，则返回第一条），一般通过唯一标识获取单条记录。
one_record = datasheet.records.get({{ pyGetParams }})
# 查询并返回符合条件的记录数组，不加条件效果和 all 相同
records = datasheet.records.filter({{ pyGetParams }})
```
<!--split-->

## 新增记录
```python
# 创建单条记录
row = datasheet.records.create({{ addParams }})
# 创建多条记录
records = datasheet.records.bulk_create({{  bulkAddParams }})

```
<!--split-->

## 更新记录
```python
row = datasheet.records.get({{ pyGetParams }})

# 更新单个字段
row.{{ oneFieldKey }} = {{ oneFieldValue }}
## row.save()

# 更新多个字段
row.update({{ updateParams }})

```
<!--split-->

## 删除记录
```python
record = datasheet.records.get({{ pyGetParams }})
# 删除单条记录
record.delete()
# 删除符合查询条件的一批记录
datasheet.records.filter({{ pyGetParams }}).delete()
# 通过 recordId 删除记录
datasheet.delete_records({{ recordIds }})
```
<!--split-->

## 上传文件

```python
_file = datasheet.upload_file(<本地/网络文件路径>)
record.{{ attachFieldName }} = [_file]
```