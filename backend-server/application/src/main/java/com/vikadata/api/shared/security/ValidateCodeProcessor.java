package com.vikadata.api.shared.security;

/**
 * <p>
 * check code processor
 * </p>
 *
 * @author Shawn Deng
 */
public interface ValidateCodeProcessor {

    /**
     * create a verification code and send
     *
     * @param target Send destination, may be mobile phone or email
     * @param scope  captcha scope
     */
    String createAndSend(ValidateTarget target, CodeValidateScope scope);

    /**
     * create a verification code and send
     *
     * @param target Send destination, may be mobile phone or email
     * @param scope  captcha scope
     * @param actual real send
     */
    String createAndSend(ValidateTarget target, CodeValidateScope scope, boolean actual);

    /**
     * verify verification code
     *
     * @param target            Send destination, may be mobile phone or email
     * @param code              verification code
     * @param immediatelyDelete whether to delete immediately
     * @param scope             captcha scope
     */
    void validate(ValidateTarget target, String code, boolean immediatelyDelete, CodeValidateScope scope);

    /**
     * delete verification code
     *
     * @param target Send destination, which can be mobile phone or email
     * @param scope  captcha scope
     */
    void delCode(String target, CodeValidateScope scope);

    /**
     * save the verification record
     *
     * @param target Send destination, may be mobile phone or email
     */
    void savePassRecord(String target);

    /**
     * Verify that the verification code has passed the verification
     *
     * @param target Send destination, may be mobile phone or email
     */
    void verifyIsPass(String target);
}
