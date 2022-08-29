package com.vikadata.api.constants;

/**
 * <p>
 * 公共图片常量
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/03/23 19:07
 */
public class AssetsPublicConstants {

    /**
     * 占位图，用于处理违规图片的替换
     */
    public static final String ASSETS_PUBLIC_PLACEHOLDER = "/public/vika_placeholder.png";

    /**
     * 空间默认logo
     */
    public static final String DEFAULT_SPACE_LOGO = "/default/logo.png";

    /**
     * 空间附件token 前缀
     */
    public static final String SPACE_PREFIX = "space";

    /**
     * 开发者附件token 前缀
     *
     * 标记为弃用，后续改造完前端直传移除
     */
    @Deprecated
    public static final String DEVELOP_PREFIX = "develop";

    /**
     * 小程序附件token 前缀（公开桶）
     */
    public static final String WIDGET_PREFIX = "widget";

    /**
     * 公共附件token 前缀
     */
    public static final String PUBLIC_PREFIX = "public";

    public static final Long CAPACITY_HEX = 1024 * 1024 * 1024L;
}
