package com.vikadata.api.component.audit;

import cn.hutool.core.util.StrUtil;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.template.mapper.TemplateMapper;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 审计字段生产工厂
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/30 20:05
 */
@Component
@DependsOn("springContextHolder")
public class AuditFieldFactory implements IAuditFieldFactory {

    private UserMapper userMapper = SpringContextHolder.getBean(UserMapper.class);
    private MemberMapper memberMapper = SpringContextHolder.getBean(MemberMapper.class);
    private SpaceMapper spaceMapper = SpringContextHolder.getBean(SpaceMapper.class);
    private NodeMapper nodeMapper = SpringContextHolder.getBean(NodeMapper.class);
    private TemplateMapper templateMapper = SpringContextHolder.getBean(TemplateMapper.class);

    public static IAuditFieldFactory me() {
        return SpringContextHolder.getBean(AuditFieldFactory.class);
    }

    @Override
    public String getUserNameByUserId(Long userId) {
        if (userId == null || userId == 0) {
            return "";
        } else {
            String userName = userMapper.selectUserNameById(userId);
            if (userName == null) {
                return "";
            } else {
                return userName;
            }
        }
    }

    @Override
    public String getSpaceNameBySpaceId(String spaceId) {
        if (StrUtil.isBlank(spaceId)) {
            return "";
        } else {
            String spaceName = spaceMapper.selectSpaceNameBySpaceId(spaceId);
            if (spaceName == null) {
                return "";
            } else {
                return spaceName;
            }
        }
    }

    @Override
    public String getMemberNameByMemberId(Long memberId) {
        if (memberId == null || memberId == 0) {
            return "";
        } else {
            String memberName = memberMapper.selectMemberNameById(memberId);
            if (memberName == null) {
                return "";
            } else {
                return memberName;
            }
        }
    }

    @Override
    public String getNodeNameByNodeId(String nodeId) {
        if (StrUtil.isBlank(nodeId)) {
            return "";
        } else {
            String nodeName = nodeMapper.selectNodeNameByNodeIdIncludeDeleted(nodeId);
            if (nodeName == null) {
                return "";
            } else {
                return nodeName;
            }
        }
    }

    @Override
    public String getTemplateNameByTemplateId(String templateId) {
        if (StrUtil.isBlank(templateId)) {
            return "";
        } else {
            String name = templateMapper.selectNameByTemplateIdIncludeDelete(templateId);
            if (name == null) {
                return "";
            } else {
                return name;
            }
        }
    }
}
