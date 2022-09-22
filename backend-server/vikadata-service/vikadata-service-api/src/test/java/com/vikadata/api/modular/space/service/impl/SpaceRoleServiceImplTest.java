package com.vikadata.api.modular.space.service.impl;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import javax.annotation.Resource;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.model.ro.space.AddSpaceRoleRo;
import com.vikadata.api.model.vo.space.SpaceRoleDetailVo;
import com.vikadata.api.modular.space.mapper.SpaceMemberRoleRelMapper;
import com.vikadata.api.modular.space.mapper.SpaceRoleResourceRelMapper;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.UserEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatNoException;

/**
 * <p>
 *
 * </p>
 *
 * @author Chambers
 * @date 2022/7/26
 */
public class SpaceRoleServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private SpaceMemberRoleRelMapper spaceMemberRoleRelMapper;

    @Resource
    private SpaceRoleResourceRelMapper spaceRoleResourceRelMapper;

    @Test
    void testCreateRole() {
        // initial user and space
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());

        // prepare sub-admins test account
        UserEntity user = iUserService.createUserByEmail("sub_admin_test001@vikadata.com");
        // create member
        Long memberId = iMemberService.createMember(user.getId(), mockUserSpace.getSpaceId(), null);
        // set this member to sub-admins
        AddSpaceRoleRo data = new AddSpaceRoleRo();
        data.setMemberIds(Collections.singletonList(memberId));
        data.setResourceCodes(Arrays.asList("MANAGE_TEAM", "MANAGE_MEMBER"));
        assertThatNoException().isThrownBy(() -> iSpaceRoleService.createRole(mockUserSpace.getSpaceId(), data));

        // duplicate setting, must be throw error
        assertThatCode(() -> iSpaceRoleService.createRole(mockUserSpace.getSpaceId(), data)).isInstanceOf(BusinessException.class);
    }

    @Test
    void testBatchCreateRole() {
        // initial user and space
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());

        // prepare sub-admins test account
        UserEntity user1 = iUserService.createUserByEmail("sub_admin_test101@vikadata.com");
        UserEntity user2 = iUserService.createUserByEmail("sub_admin_test102@vikadata.com");
        // create member
        Long memberId1 = iMemberService.createMember(user1.getId(), mockUserSpace.getSpaceId(), null);
        Long memberId2 = iMemberService.createMember(user2.getId(), mockUserSpace.getSpaceId(), null);

        // set two member to sub-admins
        AddSpaceRoleRo data = new AddSpaceRoleRo();
        data.setMemberIds(Arrays.asList(memberId1, memberId2));
        data.setResourceCodes(Arrays.asList("MANAGE_TEAM", "MANAGE_MEMBER"));
        assertThatNoException().isThrownBy(() -> iSpaceRoleService.createRole(mockUserSpace.getSpaceId(), data));

        List<String> roleCodes = spaceMemberRoleRelMapper.selectRoleCodesBySpaceId(mockUserSpace.getSpaceId());
        assertThat(roleCodes).isNotEmpty().hasSize(2);

        // no share the same role
        assertThat(new HashSet<>(roleCodes)).isNotEmpty().hasSize(2);
    }
    @Test
    void testCreateRoleWithRoleManage() {
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());
        // user have management roles permission
        UserEntity user = iUserService.createUserByEmail("sub_admin_test001@vikadata.com");
        Long memberId = iMemberService.createMember(user.getId(), mockUserSpace.getSpaceId(), null);
        AddSpaceRoleRo data = new AddSpaceRoleRo();
        data.setMemberIds(Collections.singletonList(memberId));
        data.setResourceCodes(Collections.singletonList("MANAGE_ROLE"));
        iSpaceRoleService.createRole(mockUserSpace.getSpaceId(), data);
        // assert user have management roles permission
        SpaceRoleDetailVo roleDetail = iSpaceRoleService.getRoleDetail(mockUserSpace.getSpaceId(), memberId);
        assertThat(roleDetail.getResources().size()).isEqualTo(1);
        String roleCode = spaceMemberRoleRelMapper.selectRoleCodeByMemberId(mockUserSpace.getSpaceId(), memberId);
        List<String> resourceCodes = spaceRoleResourceRelMapper.selectResourceCodesByRoleCode(roleCode);
        assertThat(resourceCodes.size()).isEqualTo(6);
    }

}