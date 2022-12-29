export enum ApplicantType {
  USER_TYPE, // User level in effect
  SPACE_TYPE, // Space level in effect
}

export enum FunctionType {
  STATIC = 'static', // Do not let users operate
  REVIEW = 'review', // Users can apply for
  NORMAL = 'normal', // Users can switch directly
  NORMAL_PERSIST = 'normal_persist' // Users can switch directly, but the data is required to be stored persistently
}
