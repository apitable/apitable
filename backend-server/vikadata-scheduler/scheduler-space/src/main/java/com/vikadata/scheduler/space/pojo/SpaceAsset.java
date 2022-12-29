package com.vikadata.scheduler.space.pojo;

import lombok.Data;

@Data
public class SpaceAsset {

    private Long id;

    /**
     * 空间ID(关联#vika_space#space_id)
     */
    private String spaceId;

    /**
     * 数表节点Id(关联#vika_node#node_id)
     */
    private String nodeId;

    /**
     * 资源ID(关联#vika_asset#id)
     */
    private Long assetId;

    /**
     * [冗余]md5摘要
     */
    private String assetChecksum;

    /**
     * 引用次数
     */
    private Integer cite;

    /**
     * 类型 (0:用户头像1:空间logo2:数表附件3:缩略图4:节点描述图)
     */
    private Integer type;

    /**
     * 源文件名，本次上传的文件名
     */
    private String sourceName;

    /**
     * [冗余]文件大小(单位:byte)
     */
    private Integer fileSize;

    /**
     * [Redundant] Whether it is a template attachment (0: No, 1: Yes)
     */
    private Boolean isTemplate;

    /**
     * 图片高度
     */
    private Integer height;

    /**
     * 图片宽度
     */
    private Integer width;
}
