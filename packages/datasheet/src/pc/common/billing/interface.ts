export interface IExtra {
  // 对于用量型的功能而言，需要传入当前使用了多少数量
  usage?: number;
  // 对于超量，是否要阻塞性提示
  alwaysAlert?: boolean;
  // 当前检查的功能，是属于哪个订阅等级才能使用的
  grade?: string;
  // 不使用模板信息，想自定义的时候可以用这个
  message?: string;
}
