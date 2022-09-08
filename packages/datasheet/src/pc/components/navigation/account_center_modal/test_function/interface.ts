// 申请类型
export enum ApplicantType {
  USER_TYPE, // 用户级别生效
  SPACE_TYPE, // 空间站级别生效
}

// 实验性功能类型
export enum FunctionType {
  STATIC = 'static', // 不让用户操作
  REVIEW = 'review', // 用户可以申请
  NORMAL = 'normal', // 用户可以直接开关
  NORMAL_PERSIST = 'normal_persist' // 用户可以直接开关，但数据是需要持久化保存的
}
