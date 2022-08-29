package com.vikadata.api.component.notification;

import java.io.Serializable;
import java.util.Map;

import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.dto.space.BaseSpaceInfoDto;
import com.vikadata.api.model.vo.player.PlayerBaseVo;

import lombok.Data;

/**
 * <p>
 * 通知渲染需要的字段ID集合
 * </p>
 *
 * @author zoe zheng
 * @date 2020/6/15 4:24 下午
 */
@Data
public class NotificationRenderMap implements Serializable {

    private static final long serialVersionUID = -5568099978608315908L;
    /**
     * 用户
     */
    private Map<Long, PlayerBaseVo> members;
    /**
     * 节点
     */
    private Map<String, NodeBaseInfoDTO> nodes;
    /**
     * space
     */
    private Map<String, BaseSpaceInfoDto> spaces;
    /**
     * fromUser和memberId的对应关系,
     * key为fromUserId + spaceId
     */
    private Map<String, Long> fromUser;
}
