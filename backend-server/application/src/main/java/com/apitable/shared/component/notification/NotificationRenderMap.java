/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.component.notification;

import com.apitable.player.vo.PlayerBaseVo;
import com.apitable.space.dto.BaseSpaceInfoDTO;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import java.io.Serializable;
import java.util.Map;
import lombok.Data;

/**
 * <p>
 * notification render map.
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
