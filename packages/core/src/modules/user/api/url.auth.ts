
// login signin, register
export const SIGN_IN_OR_SIGN_UP = '/signIn';

// logout, sign out
export const SIGN_OUT = '/signOut';

/**
 * login, sign in, deprecated
 * 
 * @deprecate
 */
export const SIGN_IN = '/auth/signIn';

/**
  * register, sign up, deprecated
  * 
  * @deprecate
  */
export const SIGN_UP = '/auth/signUp';

// ================ Authorization======================

// ================ Public stuffs ======================

/**
 * Send SMS verify code
 */
export const SEND_SMS_CODE = '/base/action/sms/code';

/**
  * Send email verify code
  */
export const SEND_EMAIL_CODE = '/base/action/mail/code';
 
/**
  * Validate SMS verify code
  */
export const VALIDATE_SMS_CODE = '/base/action/sms/code/validate';
 
/**
  * 
  * Validate email verify code.
  * 
  * When to use: 
  *   change email or space main admin when no phone number.
  * 
  */
export const VALIDATE_EMAIL_CODE = '/base/action/email/code/validate';
 
/**
  * Space - invite verify code validate
  */
export const INVITE_EMAIL_VERIFY = '/base/action/invite/valid';
