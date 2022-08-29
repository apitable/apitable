interface ITextWidgetProps {
  registry: any;
  id: string;
  value: string | number;
}

function TextWidget(props: ITextWidgetProps) {
  const { BaseInput } = props.registry.widgets;
  return <BaseInput {...props} />;
}

export default TextWidget;

// 文本输入组件会被动态参数输入组件替换