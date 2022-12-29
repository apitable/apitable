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
   * get object from value
   * @param {string|number} value status
   */
  get(value) {
    return this.props[value];
  }

  /**
   * get array from enum
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
