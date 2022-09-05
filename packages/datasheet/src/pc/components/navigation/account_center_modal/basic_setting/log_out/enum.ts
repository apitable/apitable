export enum StepStatus {
  None = -1,
  Reading = 0,
  ChooseAccountType = 1,
  VerifyAccount = 2,
  ConfirmAgain = 3,
  Done = 4,
}

export enum AccountType {
  EMAIL = 1,
  MOBILE = 0,
}
