package com.vikadata.api.security;

/**
 * <p>
 * verification code access interface
 * </p>
 *
 * @author Shawn Deng
 */
public interface ValidateCodeRepository {

    /**
     * save verification code
     *
     * @param type          verification code type
     * @param code          verification code information
     * @param target        verification object mobile phone or email
     * @param effectiveTime valid time(unit: minutes)
     */
    void save(String type, ValidateCode code, String target, int effectiveTime);

    /**
     * get verification code
     *
     * @param type   verification code type
     * @param target verification object mobile phone or email
     * @param scope  verification code scope
     * @return ValidateCode
     */
    ValidateCode get(String target, ValidateCodeType type, String scope);

    /**
     * remove verification code
     *
     * @param type   verification code type
     * @param target verification object mobile phone or email
     * @param scope  verification code scope
     */
    void remove(String target, ValidateCodeType type, String scope);
}
