package com.vikadata.api.shared.component.adapter;

import java.util.List;

import cn.hutool.json.JSONObject;

import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.enums.AuditSpaceAction;
import com.vikadata.api.space.model.SpaceAuditPageParam;
import com.vikadata.api.space.model.vo.SpaceAuditPageVO;
import com.vikadata.api.workspace.enums.NodeType;


public interface DatasourceAdapter {

    PageInfo<SpaceAuditPageVO> getSpaceAuditPage(String spaceId, SpaceAuditPageParam param);

    void createSpaceAuditRecord(Long userId, String spaceId, AuditSpaceAction action, JSONObject info);

    List<String> getRecentlyVisitNodeIds(Long memberId, NodeType nodeType);

    void saveOrUpdateNodeVisitRecord(String spaceId, Long memberId, String nodeId, NodeType nodeType);
}
