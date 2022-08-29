export default class Enum {
  private readonly props;
  constructor(props = []) {
    this.props = {};
    if (props.length) {
      props.forEach(element => {
        if (element.key && element.value) {
          this[element.key] = element.value;
          this.props[element.value] = element;
        }
      });
    }
  }

  /**
   * 根据value获取对象值
   * @param {string|number} value 状态值
   */
  get(value) {
    return this.props[value];
  }

  /**
   * 获取枚举数组
   */
  getArray() {
    const arr = [];
    for (const key in this.props) {
      if (Object.prototype.hasOwnProperty.call(this.props, key)) {
        arr.push(this.props[key]);
      }
    }
    return arr;
  }
}
