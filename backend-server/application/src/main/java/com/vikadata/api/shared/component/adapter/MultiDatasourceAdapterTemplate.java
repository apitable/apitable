package com.vikadata.api.shared.component.adapter;

import java.util.List;

import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.enums.AuditSpaceAction;
import com.vikadata.api.space.model.SpaceAuditPageParam;
import com.vikadata.api.space.model.vo.SpaceAuditPageVO;
import com.vikadata.api.workspace.enums.NodeType;

import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MultiDatasourceAdapterTemplate {

    public PageInfo<SpaceAuditPageVO> getSpaceAuditPage(String spaceId, SpaceAuditPageParam param) {
        DatasourceAdapter adapter = this.getDatasourceAdapter();
        return adapter.getSpaceAuditPage(spaceId, param);
    }

    public void saveSpaceAudit(Long userId, String spaceId, AuditSpaceAction action, JSONObject info) {
        DatasourceAdapter adapter = this.getDatasourceAdapter();
        adapter.createSpaceAuditRecord(userId, spaceId, action, info);
    }

    public List<String> getRecentlyVisitNodeIds(Long memberId, NodeType nodeType) {
        DatasourceAdapter adapter = this.getDatasourceAdapter();
        return adapter.getRecentlyVisitNodeIds(memberId, nodeType);
    }

    public void saveOrUpdateNodeVisitRecord(String spaceId, Long memberId, String nodeId, NodeType nodeType) {
        DatasourceAdapter adapter = this.getDatasourceAdapter();
        adapter.saveOrUpdateNodeVisitRecord(spaceId, memberId, nodeId, nodeType);
    }

    private DatasourceAdapter getDatasourceAdapter() {
        return new MysqlAdapter();
    }

}
