执行 automation 调度服务的计算逻辑


AutomationRobotRunner => InputParser => MagicVariableParser => SysFunctions

+ AutomationRuntimeContext automation 运行时的全局上下文。
+ AutomationRobotRunner 依赖 InputParser 将 node input 转化为静态值
  + InputParser 依赖 MagicVariableParser 解析 value 中的表达式
    + MagicVariableParser 依赖 SysFunctions 执行表达式中具体操作符