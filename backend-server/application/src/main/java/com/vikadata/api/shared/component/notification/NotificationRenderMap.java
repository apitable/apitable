package com.vikadata.api.shared.component.notification;

import java.io.Serializable;
import java.util.Map;

import lombok.Data;

import com.vikadata.api.workspace.dto.NodeBaseInfoDTO;
import com.vikadata.api.space.dto.BaseSpaceInfoDTO;
import com.vikadata.api.player.vo.PlayerBaseVo;

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

    private Map<String, BaseSpaceInfoDTO> spaces;

    private Map<String, Long> fromUser;
}
