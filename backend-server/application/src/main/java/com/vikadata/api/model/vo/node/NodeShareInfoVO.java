package com.vikadata.api.model.vo.node;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 节点分享信息视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 14:00
 */
@Data
@ApiModel("节点分享信息视图")
public class NodeShareInfoVO {

    @ApiModelProperty(value = "分享唯一标识", example = "shrKsX1map5RfYO", position = 1)
    private String shareId;

    @ApiModelProperty(value = "空间ID", example = "spceDumyiMKU2", position = 2)
    private String spaceId;

    @ApiModelProperty(value = "空间名称", example = "维格智数空间", position = 3)
    private String spaceName;

    @ApiModelProperty(value = "分享的节点树", position = 4)
    private NodeShareTree shareNodeTree;

    @Deprecated
    @ApiModelProperty(value = "分享节点ID", example = "nod10", position = 4)
    private String shareNodeId;

    @Deprecated
    @ApiModelProperty(value = "分享节点类型", example = "1", position = 4)
    private Integer shareNodeType;

    @Deprecated
    @ApiModelProperty(value = "分享节点名称", example = "这是一个节点", position = 5)
    private String shareNodeName;

    @Deprecated
    @ApiModelProperty(value = "分享节点图标", example = ":smile", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String shareNodeIcon;

    @ApiModelProperty(value = "是否允许他人转存", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowSaved;

    @ApiModelProperty(value = "是否允许他人编辑", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowEdit;

    @ApiModelProperty(value = "是否允许他人申请加入空间", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowApply;

    @ApiModelProperty(value = "是否允许他人复制数据至站外", example = "true", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowCopyDataToExternal;

    @ApiModelProperty(value = "是否允许他人下载附件", example = "true", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowDownloadAttachment;

    @Deprecated
    @ApiModelProperty(value = "是否文件夹", example = "false", position = 10)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isFolder;

    @Deprecated
    @ApiModelProperty(value = "子节点树，如果分享的是文件夹，里面是子节点树，如果分享是数表，则没有", position = 11)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<NodeShareTree> nodeTree;

    @ApiModelProperty(value = "最后修改者", example = "张三", position = 12)
    private String lastModifiedBy;

    @ApiModelProperty(value = "头像地址", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 13)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String lastModifiedAvatar;

    @ApiModelProperty(value = "是否在登录", example = "false", position = 14)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasLogin;

    @ApiModelProperty(value = "是否开启「视图手动保存」实验功能", example = "true", position = 15)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean featureViewManualSave;

    @ApiModelProperty(value = "is deleted", example = "true", position = 16)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isDeleted;
}
