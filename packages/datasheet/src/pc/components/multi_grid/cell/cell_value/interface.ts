import { ICellValue, IField } from '@vikadata/core';

export interface ICellComponentProps {
  // 当前的列属性
  field: IField;

  /**
   * 注意这里的 readonly 检查的不仅仅是有没有当前数表的权限，例如：
   * 对于计算字段，有表的编辑权限，但是没有单元格的编辑全新啊
   * 对于关联字段，有可能有本表的权限，但是没有对方表的权限
   * 所以这里的 readonly 是综合判断的结果，而不仅仅是本表权限的问题
   */
  readonly?: boolean;

  // 当前单元格的值
  cellValue: ICellValue;

  // 表示当前单元格是否为 activeCell
  isActive?: boolean;

  // 单元格内的样式需要给与调用者修改的机会。需要允许传入 className 并设置到组件外层的包裹元素上
  className?: string;

  /**
   * 提供组件内部对单元格的只进行编辑的能力。
   * 当单元格内容发生改变的时候，调用 onChange 回调函数，传入改变后的 value，由外部组件处理 command 执行事项。
   */
  onChange?: (value: ICellValue) => void;

  /**
   * 组件内部自己控制如何启动编辑。
   * 调用后，单元格对应的 Editor 组件会接收到 editing 的变化参数。
   */
  toggleEdit?: () => void;

  showAlarm?: boolean;

  recordId?: string;

  /**
   * 为什么没有 recordId？
   * 单元格组件渲染的时候，应当只关注渲染的内容。和单元格具体位置以及 id 无关。
   * 如果编写单元格渲染组件的时候用到了 recordId/fieldId 这说明逻辑设计有问题
   */
}
