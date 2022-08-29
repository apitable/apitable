package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.LimitProperties.PREFIX_LIMIT;


/**
 * <p>
 * 限制相关配置信息
 * </p>
 *
 * @author Chambers
 * @date 2020/8/10
 */
@Data
@ConfigurationProperties(prefix = PREFIX_LIMIT)
public class LimitProperties {

    public static final String PREFIX_LIMIT = "vikadata.limit";

    /**
     * 是否允许超量使用
     */
    private Boolean isAllowOverLimit = Boolean.FALSE;

    /**
     * 回收舱的最大保留天数（超量使用状态下）
     */
    private Integer rubbishMaxRetainDay = 365;

    /**
     * 用户的空间数量上限
     */
    private Integer spaceMaxCount = 10;

    /**
     * 导入数表的文件大小上限
     */
    private Integer maxFileSize = 20 * 1024 * 1024;

    /**
     * 数表最大列数
     */
    private Integer maxColumnCount = 200;

    /**
     * 视图数量上限
     */
    @Deprecated
    private Integer viewMaxCount = 100;

    /**
     * 模版数量上限
     */
    private Integer templateMaxCount = 20;

    /**
     * 成员字段，下拉框最大加载数量
     */
    private Integer memberFieldMaxLoadCount = 10;

    /**
     * 数表最大行数
     */
    @Deprecated
    private Integer maxRowCount = 50000;

    /**
     * 附件空间上限1G
     */
    @Deprecated
    private Long spaceMemoryMaxSize = 1024 * 1024 * 1024L;

    /**
     * 文件节点数量上限
     */
    @Deprecated
    private Integer nodeMaxCount = 1000;

    /**
     * 回收站
     */
    @Deprecated
    private Integer rubbishRetainDay = 7;

    /**
     * 成员总数
     */
    @Deprecated
    private Integer memberMaxCount = 100;

    /**
     * 管理员总数
     */
    @Deprecated
    private Integer adminMaxCount = 20;

    /**
     * API用量每月次数
     */
    @Deprecated
    private Integer apiUsageMaxCount = 10000;

    /**
     * 仪表盘组件数量上限
     */
    @Deprecated
    private Integer dsbWidgetMaxCount = 15;

    /**
     * 单表机器人数量上限
     */
    @Deprecated
    private Integer dstRobotMaxCount = 30;
}
