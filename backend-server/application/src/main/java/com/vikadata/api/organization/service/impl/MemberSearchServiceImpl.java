package com.vikadata.api.organization.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;

import com.vikadata.api.interfaces.social.facade.SocialServiceFacade;
import com.vikadata.api.organization.dto.MemberTeamDTO;
import com.vikadata.api.organization.dto.SearchMemberDTO;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.service.IMemberSearchService;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.organization.vo.MemberTeamPathInfo;
import com.vikadata.api.organization.vo.SearchMemberResultVo;
import com.vikadata.api.organization.vo.SearchMemberVo;
import com.vikadata.api.shared.util.information.InformationUtil;

import org.springframework.stereotype.Service;

@Service
public class MemberSearchServiceImpl implements IMemberSearchService {

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private ITeamService iTeamService;

    @Override
    public List<SearchMemberResultVo> getByName(String spaceId, String keyword, String highlightClassName) {
        // Query the local member that meets the conditions
        List<SearchMemberDTO> searchMembers = memberMapper.selectByName(spaceId, keyword);
        List<SearchMemberResultVo> results = searchMembers.stream()
                .map(searchMember -> {
                    SearchMemberResultVo result = new SearchMemberResultVo();
                    result.setMemberId(searchMember.getMemberId());
                    result.setOriginName(searchMember.getMemberName());
                    result.setMemberName(InformationUtil.keywordHighlight(searchMember.getMemberName(), keyword, highlightClassName));
                    result.setAvatar(searchMember.getAvatar());
                    result.setIsActive(searchMember.getIsActive());
                    if (CollUtil.isNotEmpty(searchMember.getTeam())) {
                        List<String> teamNames = CollUtil.getFieldValues(searchMember.getTeam(), "teamName", String.class);
                        result.setTeam(CollUtil.join(teamNames, "｜"));
                    }

                    return result;
                }).collect(Collectors.toList());

        List<String> openIds = socialServiceFacade.fuzzySearchIfSatisfyCondition(spaceId, keyword);
        if (CollUtil.isNotEmpty(openIds)) {
            // Populate the returned result with the un-renamed members
            List<SearchMemberDTO> socialMembers = memberMapper.selectByNameAndOpenIds(spaceId, openIds);
            List<SearchMemberResultVo> socialResults = socialMembers.stream()
                    .map(socialMember -> {
                        SearchMemberResultVo result = new SearchMemberResultVo();
                        result.setMemberId(socialMember.getMemberId());
                        result.setOriginName(socialMember.getMemberName());
                        // Wecom usernames need to be front-end rendered, and search results do not return highlighting
                        result.setMemberName(socialMember.getMemberName());
                        result.setAvatar(socialMember.getAvatar());
                        if (CollUtil.isNotEmpty(socialMember.getTeam())) {
                            List<String> teamNames = socialMember.getTeam().stream().map(MemberTeamDTO::getTeamName).collect(Collectors.toList());
                            result.setTeam(CollUtil.join(teamNames, "｜"));
                        }

                        return result;
                    }).collect(Collectors.toList());

            results.addAll(socialResults);
        }

        // get all member's ids
        List<Long> memberIds = results.stream().map(SearchMemberResultVo::getMemberId).collect(Collectors.toList());
        // handle member's team name，get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (SearchMemberResultVo member : results) {
            if (memberToTeamPathInfoMap.containsKey(member.getMemberId())) {
                member.setTeamData(memberToTeamPathInfoMap.get(member.getMemberId()));
            }
        }

        return results;

    }

    @Override
    public List<SearchMemberVo> getLikeMemberName(String spaceId, String keyword, Boolean filter, String highlightClassName) {
        // Query the local member that meets the conditions
        List<SearchMemberVo> searchMembers = memberMapper.selectLikeMemberName(spaceId, keyword, filter);
        searchMembers.forEach(vo -> {
            vo.setOriginName(vo.getMemberName());
            vo.setMemberName(InformationUtil.keywordHighlight(vo.getMemberName(), keyword, highlightClassName));
        });

        List<String> openIds = socialServiceFacade.fuzzySearchIfSatisfyCondition(spaceId, keyword);
        if (CollUtil.isNotEmpty(openIds)) {
            // Populate the returned result with the un-renamed members
            List<SearchMemberVo> socialMembers = memberMapper.selectLikeMemberNameByOpenIds(spaceId, openIds, filter);
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
