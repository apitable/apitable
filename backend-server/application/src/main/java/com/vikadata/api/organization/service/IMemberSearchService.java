package com.vikadata.api.organization.service;

import java.util.List;

import com.vikadata.api.organization.vo.SearchMemberResultVo;
import com.vikadata.api.organization.vo.SearchMemberVo;

public interface IMemberSearchService {

    /**
     * fuzzy query member by keyword
     *
     * @param spaceId space id
     * @param keyword keyword
     * @param highlightClassName the highlight style
     * @return SearchMemberResultVo
     */
    List<SearchMemberResultVo> getByName(String spaceId, String keyword, String highlightClassName);

    /**
     * fuzzy query member by member name
     *
     * @param spaceId space id
     * @param keyword keyword
     * @param filter  whether to filter unadded members
     * @param highlightClassName the highlight style
     * @return SearchMemberVos
     * space id
     *
     */
    List<SearchMemberVo> getLikeMemberName(String spaceId, String keyword, Boolean filter, String highlightClassName);
}
