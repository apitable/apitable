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

// The text input component will be replaced by the dynamic parameter input component