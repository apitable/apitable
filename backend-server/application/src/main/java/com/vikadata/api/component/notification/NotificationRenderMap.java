package com.vikadata.api.component.notification;

import java.io.Serializable;
import java.util.Map;

import lombok.Data;

import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.dto.space.BaseSpaceInfoDto;
import com.vikadata.api.model.vo.player.PlayerBaseVo;

/**
 * <p>
 * notification render map
 * </p>
 *
 * @author zoe zheng
 */
@Data
public class NotificationRenderMap implements Serializable {

    private static final long serialVersionUID = -5568099978608315908L;

    private Map<Long, PlayerBaseVo> members;

    private Map<String, NodeBaseInfoDTO> nodes;

    private Map<String, BaseSpaceInfoDto> spaces;

    private Map<String, Long> fromUser;
}
