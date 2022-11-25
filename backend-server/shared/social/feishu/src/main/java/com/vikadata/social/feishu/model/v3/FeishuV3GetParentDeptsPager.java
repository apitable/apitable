package com.vikadata.social.feishu.model.v3;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.feishu.api.DepartmentOperations;
import com.vikadata.social.feishu.model.builder.DeptIdType;

/**
 * Parent Department List Pager
 */
public class FeishuV3GetParentDeptsPager implements Iterator<List<FeishuDeptObject>> {

    private final Logger logger = LoggerFactory.getLogger(FeishuV3GetParentDeptsPager.class);

    private boolean hasMore;

    private String pageToken;

    private List<FeishuDeptObject> items;

    private String tenantKey;

    private DeptIdType deptIdType;

    private DepartmentOperations operations;

    private int currentPage;

    public FeishuV3GetParentDeptsPager(DepartmentOperations operations, String tenantKey, DeptIdType deptIdType) {
        this.operations = operations;
        this.tenantKey = tenantKey;
        this.deptIdType = deptIdType;
        FeishuV3GetParentDeptsRequest request = new FeishuV3GetParentDeptsRequest();
        request.setDepartmentIdType(deptIdType.type());
        request.setDepartmentId(deptIdType.value());
        FeishuV3GetParentDeptsResponse response = operations.getParentDepts(tenantKey, request);
        logger.info("Request Parent Dept List, has_more: {}, page_token: {}, record_number: {}",
                response.getData().isHasMore(), response.getData().getPageToken(), CollUtil.size(response.getData().getItems()));
        this.items = CollUtil.emptyIfNull(response.getData().getItems());
        this.hasMore = response.getData().isHasMore();
        this.pageToken = response.getData().getPageToken();
    }

    @Override
    public boolean hasNext() {
        return this.currentPage == 0 || this.hasMore;
    }

    @Override
    public List<FeishuDeptObject> next() {
        if (this.currentPage == 0) {
            this.currentPage = 1;
            return this.items;
        }
        return nextPage();
    }

    private List<FeishuDeptObject> nextPage() {
        FeishuV3GetParentDeptsRequest request = new FeishuV3GetParentDeptsRequest();
        request.setDepartmentIdType(deptIdType.type());
        request.setDepartmentId(deptIdType.value());
        request.setPageToken(pageToken);
        FeishuV3GetParentDeptsResponse response = operations.getParentDepts(tenantKey, request);
        logger.info("Request Dept User Detail List, has_more: {}, page_token: {}, record_number: {}",
                response.getData().isHasMore(), response.getData().getPageToken(), CollUtil.size(response.getData().getItems()));

        this.items = CollUtil.emptyIfNull(response.getData().getItems());
        this.hasMore = response.getData().isHasMore();
        this.pageToken = response.getData().getPageToken();
        this.currentPage++;
        return this.items;
    }

    public List<FeishuDeptObject> all() {

        List<FeishuDeptObject> allItems = new ArrayList<>();

        while (hasNext()) {
            allItems.addAll(next());
        }

        return allItems;
    }
}
