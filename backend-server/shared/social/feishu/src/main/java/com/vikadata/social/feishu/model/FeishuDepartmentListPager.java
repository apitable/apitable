package com.vikadata.social.feishu.model;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.feishu.api.DepartmentOperations;

/**
 *
 * @author Shawn Deng
 * @date 2021-05-13 13:41:38
 */
public class FeishuDepartmentListPager implements Iterator<List<FeishuDepartmentInfo>> {

    private final Logger logger = LoggerFactory.getLogger(FeishuDepartmentListPager.class);

    private boolean hasMore;

    private String pageToken;

    private List<FeishuDepartmentInfo> currentItems;

    private DepartmentOperations operations;

    private String tenantKey;

    private String departmentId;

    private int itemsPerPage;

    private boolean fetchChild;

    public FeishuDepartmentListPager(DepartmentOperations operations, String tenantKey, String departmentId, int itemsPerPage, boolean fetchChild) {
        this.operations = operations;
        this.tenantKey = tenantKey;
        this.departmentId = departmentId;
        this.itemsPerPage = itemsPerPage;
        this.fetchChild = fetchChild;
        FeishuDepartmentListRequest request = new FeishuDepartmentListRequest();
        request.setDepartmentId(departmentId);
        request.setPageSize(itemsPerPage);
        request.setFetchChild(fetchChild);
        FeishuDepartmentListResponse response = operations.getSubDepartments(tenantKey, request);
        logger.info("Request Child Dept List, has_more: {}, page_token: {}, record_number: {}",
            response.getData().isHasMore(), response.getData().getPageToken(), CollUtil.size(response.getData().getDepartmentInfos()));
        if (CollUtil.isNotEmpty(response.getData().getDepartmentInfos())) {
            this.currentItems = response.getData().getDepartmentInfos();
        }
        this.hasMore = response.getData().isHasMore();
        this.pageToken = response.getData().getPageToken();
    }

    @Override
    public boolean hasNext() {
        return this.hasMore;
    }

    @Override
    public List<FeishuDepartmentInfo> next() {
        return page();
    }

    public List<FeishuDepartmentInfo> page() {
        FeishuDepartmentListRequest request = new FeishuDepartmentListRequest();
        request.setDepartmentId(departmentId);
        request.setPageToken(pageToken);
        request.setPageSize(itemsPerPage);
        request.setFetchChild(fetchChild);
        FeishuDepartmentListResponse response = operations.getSubDepartments(tenantKey, request);
        logger.info("Request Child Dept List, has_more: {}, page_token: {}, record_number: {}",
            response.getData().isHasMore(), response.getData().getPageToken(), CollUtil.size(response.getData().getDepartmentInfos()));
        if (CollUtil.isNotEmpty(response.getData().getDepartmentInfos())) {
            this.currentItems = response.getData().getDepartmentInfos();
        }
        else {
            this.currentItems.clear();
        }
        this.hasMore = response.getData().isHasMore();
        this.pageToken = response.getData().getPageToken();
        return this.currentItems;
    }

    public List<FeishuDepartmentInfo> all() {

        List<FeishuDepartmentInfo> allItems = CollUtil.isEmpty(this.currentItems) ? new ArrayList<>() : new ArrayList<>(this.currentItems);

        while (hasNext()) {
            allItems.addAll(next());
        }

        return allItems;
    }
}
