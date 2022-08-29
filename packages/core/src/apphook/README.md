# apphook - Hook Engine 伊娃事件钩子引擎

计算机软件是一套「秩序」，我们根据业务的需求，制造出对应的软件。

然而，真实世界的用户行为却是「无序而混沌」的，你永远搞不清楚用户会怎么使用你的软件，和想对你的软件做哪些定制和变更。

因此，除了秩序化的系统，我们还需要准备一种「无序而混沌」的系统，取应对变化和各种需求。

我们把真实世界的用户行为，抽象成hook引擎，全部都是基于「Event-Driven 事件驱动」，可以捕捉用户行为，沿着用户的行为，去扩充我们的系统功能。

## 原理

在代码中，我们预设好我们所需要的「AppHook应用钩子」，并在适当的地方埋进，触发事件。

比如，用户点击了某个按钮A，我们就触发一个事件「点击按钮A」。

我们触发事件的方式，有两种：

Trigger，触发器形式。触发器主要用于，当事件发生后，进行额外的一些行为操作，它不会改变原程序代码的执行路径。

Filter，过滤器形式。过滤器主要用于，当事件发生后，执行过滤器方法，对某个变量进行

~~Interceptor，拦截器形式。阻止某些事件发生。~~


## 应用场景

- 数据埋点：数据埋点都是基于事件的，无需再业务代码中进行hard code，只需订阅事件引擎；
- 新手入门：Onboarding系统，全部都是围绕事件、条件、命令而展开的；
- 帮助引导：触发某些事件后，如第10次点击了某个按钮，弹出提示框；
- 用户任务：用户可以一个一个地完成某些任务，可以是纯客户端、也可以是从服务端做任务；
- 市场活动：当触发某些特定事件、符合某些条件后，才弹出某种活动；
- 用户召回：如未登录30天，定时任务生效；
- 功能付费：当点击某个按钮，发现没有付费，立刻触发付费窗，原状态拦截，支付完成后，继续执行；
- 第三方插件：第三方定制插件，也可以基于我们的action或filter进行更多的定制内容，如[Wordpress的Hook机制](https://www.wpdaxue.com/wordpress-hook.html)；
- ......

## 功能

- 自由通过字符串进行事件的创建和订阅 （binding: addTrigger, addFilter)
- ~~支持性一次性事件（once）~~
- Hook发生可根据情况传入状态 (hookState)
- 支持trigger模式(无返回值)和filter模式(有返回值)
- 支持规则引擎（rule/condition)
- ~~简单的消息队列(messageQueue)~~
- ~~拦截器（interceptor)~~
- ~~有限状态机（FSM）~~

## 名词概念

- hook钩子：
    - hookState 钩子状态：
    - hookArgs 钩子发生参数：
- binding 订阅：
    - add_trigger：
    - remove_trigger：
    - add_filter：
    - remove_filter：
- trigger 触发器：具体的执行行为；
    - triggerCommand:
    - triggerCommandArg 执行参数：any
- filter 过滤器：
    - filterCommand:
    - filterCommandArg:
- rule 规则
    - condition
    - conditionArgs
- action:
    - trigger action: 触发器动作
        - trigger command: 触发器命令
        - arg: 参数
    - filter action: 过滤器动作
        - filter command: 过滤器命令
        - arg: 参数
- listener 监听器：
    - trigger Listner：触发型
    - filter Listner：过滤型
    - ~~job listner：定时任务型~~
    - ~~interceptor: 拦截器~~




## 应用举例

### 利用Trigger，进行数据埋点

```typescript
// Window.tsx
// ...
onClickLoginButton: () => {
    // ...
    apphook.doTrigger('user:click_login_button');

}
// ...
```

```typescript
//  EventTracking.ts  独立的埋点代码文件
apphook.addTrigger('user:click_login_button', (args) => {

    // 数据埋点代码 Event Tracking Code
    EventTracking.track('user:click_login_button', {...});

    // 如，使用神策埋点
    tracker.track('user:click_login_button', {...});
    tracker.setProfile({email:'xxx@xxx.com'});
});
```


### 利用Filter，让通讯录中，企业显示「工号」，普通团队显示「编号」

```typescript
apphook.addFilter('get_form_name', (defaultValue, args) => {
    let user = args[0];
    if (user.is_vika_cloud) {
        return "工号";
    } else if (user.is_vika_data) {
        return "团队编号";
    }
    return defaultValue;
});
```

```typescript
// UI.tsx
<Form name="{apphook.applyFilters('get_form_name', '编号')}" />  // 最终获得字符串  "编号" 或 "工号" 或 "团队编号"
```

## 配合Config配置表，配置各种新手功能

[Airtable Config: Playbook业务配置表](https://airtable.com/tblCM2O5JSueduXoM/viwcENkne3ryzeKrZ?blocks=hide)


## 新手弹窗引导配置举例

假设有一个这样的功能：

> 当一个女性用户第10次进入维格表时，弹出「恭喜你已经使用了10次维格表」。

分解：

- trigger: 用户第10次进入维格表弹窗提示
    - hook: 进入维格表(application:start)
    - hookState: 第10次(10)
    - rule: 女性
        - condition: 性别为女 (gender == femail)
    - action: 
        - command: 弹窗提示
        - command: “恭喜你已经使用了10次维格表”
        

涉及的代码包括：
```typescript
// 事件触发
apphook.doTrigger('application:start', [],  10) // 第10次进入维格表

// 添加触发器
apphook.addTrigger('application:start', (args, hookState) => {
    if (hookState == 10) {
        showWindow('恭喜你已经使用了10次维格表');
    }
}, {
    doCheck: (args) => {
            return user.gender === 'female';
}});
```

    
