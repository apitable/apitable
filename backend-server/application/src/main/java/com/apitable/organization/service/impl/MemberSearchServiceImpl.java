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

package com.apitable.organization.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.organization.dto.MemberTeamDTO;
import com.apitable.organization.dto.SearchMemberDTO;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.service.IMemberSearchService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.SearchMemberResultVo;
import com.apitable.organization.vo.SearchMemberVo;
import com.apitable.shared.util.information.InformationUtil;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * member search service implement.
 */
@Service
public class MemberSearchServiceImpl implements IMemberSearchService {

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private ITeamService iTeamService;

    @Override
    public List<SearchMemberResultVo> getByName(String spaceId, String keyword,
                                                String highlightClassName) {
        // Query the local member that meets the conditions
        List<SearchMemberDTO> searchMembers = memberMapper.selectByName(spaceId, keyword);
        List<SearchMemberResultVo> results = searchMembers.stream()
            .map(searchMember -> {
                SearchMemberResultVo result = new SearchMemberResultVo();
                result.setMemberId(searchMember.getMemberId());
                result.setOriginName(searchMember.getMemberName());
                result.setMemberName(
                    InformationUtil.keywordHighlight(searchMember.getMemberName(), keyword,
                        highlightClassName));
                result.setAvatar(searchMember.getAvatar());
                result.setAvatarColor(searchMember.getColor());
                result.setNickName(searchMember.getNickName());
                result.setIsActive(searchMember.getIsActive());
                if (CollUtil.isNotEmpty(searchMember.getTeam())) {
                    List<String> teamNames =
                        CollUtil.getFieldValues(searchMember.getTeam(), "teamName", String.class);
                    result.setTeam(CollUtil.join(teamNames, "｜"));
                }

                return result;
            }).collect(Collectors.toList());

        List<String> openIds = socialServiceFacade.fuzzySearchIfSatisfyCondition(spaceId, keyword);
        if (CollUtil.isNotEmpty(openIds)) {
            // Populate the returned result with the un-renamed members
            List<SearchMemberDTO> socialMembers =
                memberMapper.selectByNameAndOpenIds(spaceId, openIds);
            List<SearchMemberResultVo> socialResults = socialMembers.stream()
                .map(socialMember -> {
                    SearchMemberResultVo result = new SearchMemberResultVo();
                    result.setMemberId(socialMember.getMemberId());
                    result.setOriginName(socialMember.getMemberName());
                    // Wecom usernames need to be front-end rendered, and search results do not return highlighting
                    result.setMemberName(socialMember.getMemberName());
                    result.setAvatar(socialMember.getAvatar());
                    if (CollUtil.isNotEmpty(socialMember.getTeam())) {
                        List<String> teamNames =
                            socialMember.getTeam().stream().map(MemberTeamDTO::getTeamName)
                                .collect(Collectors.toList());
                        result.setTeam(CollUtil.join(teamNames, "｜"));
                    }

                    return result;
                }).toList();

            results.addAll(socialResults);
        }

        // get all member's ids
        List<Long> memberIds =
            results.stream().map(SearchMemberResultVo::getMemberId).collect(Collectors.toList());
        // handle member's team name，get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap =
            iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (SearchMemberResultVo member : results) {
            if (memberToTeamPathInfoMap.containsKey(member.getMemberId())) {
                member.setTeamData(memberToTeamPathInfoMap.get(member.getMemberId()));
            }
        }

        return results;

    }

    @Override
    public List<SearchMemberVo> getLikeMemberName(String spaceId, String keyword, Boolean filter,
                                                  String highlightClassName) {
        // Query the local member that meets the conditions
        List<SearchMemberVo> searchMembers =
            memberMapper.selectLikeMemberName(spaceId, keyword, filter);
        searchMembers.forEach(vo -> {
            vo.setOriginName(vo.getMemberName());
            vo.setMemberName(
                InformationUtil.keywordHighlight(vo.getMemberName(), keyword, highlightClassName));
        });

        List<String> openIds = socialServiceFacade.fuzzySearchIfSatisfyCondition(spaceId, keyword);
        if (CollUtil.isNotEmpty(openIds)) {
            // Populate the returned result with the un-renamed members
            List<SearchMemberVo> socialMembers =
                memberMapper.selectLikeMemberNameByOpenIds(spaceId, openIds, filter);
            socialMembers.forEach(vo -> {
                vo.setOriginName(vo.getMemberName());
                // The wecom username of the company needs front-end rendering, and the search result does not return highlighting
                vo.setMemberName(vo.getMemberName());
            });

            searchMembers.addAll(socialMembers);
        }
        return searchMembers;
    }
}
