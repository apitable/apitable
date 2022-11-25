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
 * Department List Pager
 */
public class FeishuV3DeptsPager implements Iterator<List<FeishuDeptObject>> {

    private final Logger logger = LoggerFactory.getLogger(FeishuV3DeptsPager.class);

    private boolean hasMore;

    private String pageToken;

    private List<FeishuDeptObject> items;

    private String tenantKey;

    private DeptIdType deptIdType;

    private DepartmentOperations operations;

    private int currentPage;

    public FeishuV3DeptsPager(DepartmentOperations operations, String tenantKey, DeptIdType deptIdType) {
        this.operations = operations;
        this.tenantKey = tenantKey;
        this.deptIdType = deptIdType;
        FeishuV3DeptsRequest request = new FeishuV3DeptsRequest();
        request.setDepartmentIdType(deptIdType.type());
        request.setParentDepartmentId(deptIdType.value());
        request.setFetchChild(true);
        FeishuV3DeptsResponse response = operations.getDepts(tenantKey, request);
        logger.info("Request Sub Department List, has_more: {}, page_token: {}, record_number: {}",
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
        FeishuV3DeptsRequest request = new FeishuV3DeptsRequest();
        request.setDepartmentIdType(deptIdType.type());
        request.setParentDepartmentId(deptIdType.value());
        request.setPageToken(pageToken);
        request.setFetchChild(true);
        FeishuV3DeptsResponse response = operations.getDepts(tenantKey, request);
        logger.info("Request Sub Dept List, has_more: {}, page_token: {}, record_number: {}",
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
