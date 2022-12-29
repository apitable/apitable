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
public class FeishuUserDetailListPager implements Iterator<List<FeishuUserDetail>> {

    private final Logger logger = LoggerFactory.getLogger(FeishuUserDetailListPager.class);

    private boolean hasMore;

    private String pageToken;

    private List<FeishuUserDetail> currentItems;

    private DepartmentOperations operations;

    private String tenantKey;

    private String departmentId;

    private int itemsPerPage;

    private boolean fetchChild;

    public FeishuUserDetailListPager(DepartmentOperations operations, String tenantKey, String departmentId, int itemsPerPage, boolean fetchChild) {
        this.operations = operations;
        this.tenantKey = tenantKey;
        this.departmentId = departmentId;
        this.itemsPerPage = itemsPerPage;
        this.fetchChild = fetchChild;
        FeishuUserDetailListRequest request = new FeishuUserDetailListRequest();
        request.setDepartmentId(departmentId);
        request.setPageSize(itemsPerPage);
        request.setFetchChild(fetchChild);
        FeishuUserDetailListResponse response = operations.getUserDetailList(tenantKey, request);
        logger.info("Request Dept User Detail List, has_more: {}, page_token: {}, record_number: {}",
            response.getData().isHasMore(), response.getData().getPageToken(), CollUtil.size(response.getData().getUserInfos()));
        if (CollUtil.isNotEmpty(response.getData().getUserInfos())) {
            this.currentItems = response.getData().getUserInfos();
        }
        this.hasMore = response.getData().isHasMore();
        this.pageToken = response.getData().getPageToken();
    }

    @Override
    public boolean hasNext() {
        return this.hasMore;
    }

    @Override
    public List<FeishuUserDetail> next() {
        return page();
    }

    public List<FeishuUserDetail> page() {
        FeishuUserDetailListRequest request = new FeishuUserDetailListRequest();
        request.setDepartmentId(departmentId);
        request.setPageToken(pageToken);
        request.setPageSize(itemsPerPage);
        request.setFetchChild(fetchChild);
        FeishuUserDetailListResponse response = operations.getUserDetailList(tenantKey, request);
        logger.info("Request Dept User Detail List, has_more: {}, page_token: {}, record_number: {}",
            response.getData().isHasMore(), response.getData().getPageToken(), CollUtil.size(response.getData().getUserInfos()));
        if (CollUtil.isNotEmpty(response.getData().getUserInfos())) {
            this.currentItems = response.getData().getUserInfos();
        }
        else {
            this.currentItems.clear();
        }
        this.hasMore = response.getData().isHasMore();
        this.pageToken = response.getData().getPageToken();
        return this.currentItems;
    }

    public List<FeishuUserDetail> all() {

        List<FeishuUserDetail> allItems = CollUtil.isEmpty(this.currentItems) ? new ArrayList<>() : new ArrayList<>(this.currentItems);

        while (hasNext()) {
            allItems.addAll(next());
        }

        return allItems;
    }
}
