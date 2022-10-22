# OP事件管理模块

整个模块分为 2 部分。
1. op => event 纯计算。
2. 提供事件监听机制。

## 基础概念

+ Event 符合指定特征的 op，被定义成某类事件
  + 名称
  + 基础类型
    + 原子/组合
    + 真实/虚拟
  + 资源范围（数表、表单、仪表盘、文件夹表述等等）
+ EventType 事件原型：定义事件的类。
  + 事件原型需要提供对事件的定义方法，即测量 ops 是否满足改事件的定义。
+ EventInstance 事件实例：具体的 op 生成的事件，相比于原型会多出上下文，以及事件来源。 json。
+ EventSourceType 事件来源类型，按来源分为：
  + 远程事件
  + 本地事件

+ 事件半文 / 事件全文
  + 事件半文，解析 op 特征生成的事件，这里只能从 op 中获取基础信息。
    + 因为生成这个事件的步骤不能接触到 state，只知道 fieldId，不知道 field 类型。缺少了必要的数据。 无法生成完整事件实例的上下文。
  + 事件全文，事件半文 + state 计算出来的事件全文。
  
+ EventContext 事件上下文（全文）。事件实例带上的上下文信息，例如记录更新了，context 应该包含，是哪个资源的那个记录更了哪些字段。
## OP2Event

用户操作生成的 changeset 中包含 ops，我们需要解析 ops 生成事件。这里涉及到2个概念。
+ 复合事件、原子事件。
  + 原子事件：不可再分的事件、例如单元格更新。
  + 复合事件：由原子事件组合而成的事件，例如同一条记录的字段 A 更新、字段 B 更新。复合为记录更新。
+ 真实事件、虚拟事件。
  + 真实事件：用户操作变更产生的事件
  + 虚拟事件：系统派生的事件，用于统一管理事件。例如：计算字段的依赖字段更新，导致了计算字段的更新。计算字段的更新属于系统演算出来的虚拟事件。
    + 虚拟事件的演算依赖于当前资源的 state。
      + 主要是 fieldMap、recordMap 用户计算字段横向和纵向的依赖关系。



OP2Event 初始化时，接受一个监听的事件列表。针对不同场景（client/server） ，根据业务需求，监听不同的事件。这样在处理 ops 转事件时，会高效一些。

OP2Event 提供 3个基础的计算方法
+ 将 ops 转为「真实原子事件」
+ 由 「真实原子事件」 + 资源 state 演算出 「虚拟原子事件」
+ 将「原子事件」 组合为「复合事件」

```ts
class OP2Event {
  parseOps2Events(resourceOps: { operations: IOperation[], resourceType: ResourceType, resourceId: string }[]): IRealAtomEvent[];
  makeVirtualEvents(events:IRealAtomEvent[], state): IVirtualAtomEvents[]
  makeCombEvents(atomEvents:IAtomEvent[]): ICombEvents[];
  getEventResources(): IEventResource;
}
```

## 事件监听机制

有了事件，我们就可以屏蔽掉用户操作层面的差异，不用关心用户以何种方式操作，最终都会转化为事件。我们可以对事件做一些监听处理。

例如
+ 「当用户创建记录时」，做一些预排序相关的处理逻辑。
+ 「当成员字段更新时」，发送@成员的通知。
+ ...等等

事件监听管理提供对于事件的监听、取消监听。基础概念和浏览器事件类似

初始化事件管理实例的时候，可以定制

+ addEventListener 监听事件
+ removeEventListener 取消对事件的监听
+ dispatchEvent 主动触发事件
+ handleEvents 事件流的入口函数

### 成员单元格变更

op 中没有包含字段的类型信息，因此无法判断字段的类型，需要结合 meta 才能知道，是什么字段更新了。
成员单元格的监听，应该还是监听 cellUpdate 事件，不同的是加上过滤条件。过滤条件可以带上 state。


## 事件再加工

通过 op 生成的信息，因为缺少 state 是没法接触到字段和具体数据的。因此要生成完整的事件上下文，需要结合 state 再处理一遍。

例如: 当我监听 「订单状态 = 发货 & 数量 >3」 的记录。

用户改动数量使记录满足条件，event 中只会包含「数量」的信息，还需要从 state 中获取「订单状态」的信息。需要使用 fill 方法补充事件上下文。


## 定义一个事件

如何定义一个事件，随着业务的扩展，可能会出现不同的事件。你可以按需定义自己的事件，在合适的地方监听事件做出一些处理逻辑。
```
class EventAttachmentUpload {
  test(op){
    return {
      pass:true,
      context: {},
    }
  }
}
```