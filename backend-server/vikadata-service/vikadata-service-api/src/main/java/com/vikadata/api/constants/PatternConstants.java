package com.vikadata.api.constants;

/**
 * <p>
 * 常用正则表达式
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/11 10:30
 */
public class PatternConstants {

    /**
     * 邮箱验证
     * 参考：http://emailregex.com/
     */
    public final static String EMAIL = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)])";

    /**
     * url验证
     * 拷贝 hutool - PatternPool.URL_HTTP
     */
    public final static String URL_HTTP = "(https://|http://)?([\\w-]+\\.)+[\\w-]+(:\\d+)*(/[\\w- ./?%&=]*)?";

    /**
     * 域名验证
     */
    public final static String DOMAIN = "^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$";

    public final static String PURE_NUMBER = "\\d+";

    /**
     * 组件包Id验证
     */
    public final static String PACKAGE_ID = "^wpk[a-zA-Z\\d]{10}$";

}
