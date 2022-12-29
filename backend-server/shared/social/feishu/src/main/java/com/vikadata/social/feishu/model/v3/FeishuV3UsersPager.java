package com.vikadata.social.feishu.model.v3;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.feishu.api.UserOperations;
import com.vikadata.social.feishu.model.builder.DeptIdType;

/**
 * user list pager
 */
public class FeishuV3UsersPager implements Iterator<List<FeishuUserObject>> {

    private final Logger logger = LoggerFactory.getLogger(FeishuV3UsersPager.class);

    private boolean hasMore;

    private String pageToken;

    private List<FeishuUserObject> items;

    private String tenantKey;

    private DeptIdType deptIdType;

    private UserOperations operations;

    private int currentPage;

    public FeishuV3UsersPager(UserOperations operations, String tenantKey, DeptIdType deptIdType) {
        this.operations = operations;
        this.tenantKey = tenantKey;
        this.deptIdType = deptIdType;
        FeishuV3UsersRequest request = new FeishuV3UsersRequest();
        request.setDepartmentIdType(deptIdType.type());
        request.setDepartmentId(deptIdType.value());
        FeishuV3UsersResponse response = operations.getUsers(tenantKey, request);
        logger.info("Request User List, has_more: {}, page_token: {}, record_number: {}",
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
    public List<FeishuUserObject> next() {
        if (this.currentPage == 0) {
            this.currentPage = 1;
            return this.items;
        }
        return nextPage();
    }

    private List<FeishuUserObject> nextPage() {
        FeishuV3UsersRequest request = new FeishuV3UsersRequest();
        request.setDepartmentIdType(deptIdType.type());
        request.setDepartmentId(deptIdType.value());
        request.setPageToken(pageToken);
        FeishuV3UsersResponse response = operations.getUsers(tenantKey, request);
        logger.info("Request Dept User Detail List, has_more: {}, page_token: {}, record_number: {}",
                response.getData().isHasMore(), response.getData().getPageToken(), CollUtil.size(response.getData().getItems()));
        this.items = CollUtil.emptyIfNull(response.getData().getItems());
        this.hasMore = response.getData().isHasMore();
        this.pageToken = response.getData().getPageToken();
        this.currentPage++;
        return this.items;
    }

    public List<FeishuUserObject> all() {

        List<FeishuUserObject> allItems = new ArrayList<>();

        while (hasNext()) {
            allItems.addAll(next());
        }

        return allItems;
    }
}
