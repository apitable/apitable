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

package com.apitable;

import cn.hutool.core.collection.CollUtil;
import com.apitable.auth.service.IAuthService;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.internal.service.IFieldService;
import com.apitable.mock.bean.MockInvitation;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.organization.ro.RoleMemberUnitRo;
import com.apitable.organization.service.*;
import com.apitable.shared.clock.MockClock;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.config.ServerConfig;
import com.apitable.shared.config.initializers.EnterpriseEnvironmentInitializers;
import com.apitable.shared.holder.UserHolder;
import com.apitable.shared.util.IdUtil;
import com.apitable.space.service.IInvitationService;
import com.apitable.space.service.ISpaceService;
import com.apitable.sql.script.enhance.TablePrefixUtil;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.service.IUserService;
import com.apitable.workspace.dto.CreateNodeDto;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.service.INodeService;
import com.baomidou.mybatisplus.autoconfigure.MybatisPlusProperties;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;

import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@SpringBootTest(classes = { Application.class })
@ContextConfiguration(initializers = EnterpriseEnvironmentInitializers.class)
@AutoConfigureMockMvc
@ExtendWith({ MockitoExtension.class })
@TestPropertySource(value = {
        "classpath:test.properties",
}, properties = { "TEST_ENABLED=true" })
public abstract class AbstractIntegrationTest extends TestSuiteWithDB {

    /**
     * using east 8 timezone for testing
     */
    @Deprecated
    protected static final ZoneOffset testTimeZone = ZoneOffset.ofHours(8);

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    protected MybatisPlusProperties mybatisPlusProperties;

    @Autowired
    protected RedisTemplate<String, Object> redisTemplate;

    @Autowired
    protected ServerConfig serverConfig;

    @Autowired
    protected IAuthService iAuthService;

    @Autowired
    protected IUserService iUserService;

    @Autowired
    protected ISpaceService iSpaceService;

    @Autowired
    protected ITeamService iTeamService;

    @Autowired
    protected IMemberService iMemberService;

    @Autowired
    protected ITeamMemberRelService iTeamMemberRelService;

    @Autowired
    protected INodeService iNodeService;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected IFieldService fieldService;

    @Autowired
    protected IInvitationService invitationService;

    @Autowired
    protected IRoleService iRoleService;

    @Autowired
    protected IRoleMemberService iRoleMemberService;

    @Autowired
    protected EntitlementServiceFacade entitlementServiceFacade;

    @Value("#{'${exclude}'.split(',')}")
    private List<String> excludeTables;

    @BeforeEach
    public void beforeMethod() {
        // db suite prepare before method
        super.beforeMethod();
        // reset clock
        getClock().resetDeltaFromReality();
    }

    @Override
    protected List<String> configureExcludeTables() {
        return Collections.unmodifiableList(excludeTables);
    }

    @Override
    protected String tablePrefix() {
        Object tablePrefix = mybatisPlusProperties.getConfigurationProperties().get("tablePrefix");
        if (Objects.isNull(tablePrefix)) {
            return "";
        }
        return tablePrefix.toString();
    }

    protected void execute(String sql) {
        String newSql = TablePrefixUtil.changeTablePrefix(sql, tablePrefix());
        jdbcTemplate.execute(newSql);
    }

    @Override
    protected JdbcTemplate configureJdbcTemplate() {
        return this.jdbcTemplate;
    }

    @Override
    protected RedisTemplate<String, Object> configureRedisTemplate() {
        return this.redisTemplate;
    }

    protected MockClock getClock() {
        return ClockManager.me().getMockClock();
    }

    protected UserEntity createUserRandom() {
        return createUserWithEmail(IdWorker.getIdStr() + "@apitable.com");
    }

    protected UserEntity createUserWithEmail(String email) {
        return iUserService.createUserByEmail(email);
    }

    protected String createSpaceWithoutName(UserEntity user) {
        return createSpaceWithName(user, "test space");
    }

    protected String createSpaceWithName(UserEntity user, String name) {
        return iSpaceService.createSpace(user, name);
    }

    protected Long createMember(Long userId, String spaceId) {
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        return createMember(userId, spaceId, rootTeamId);
    }

    protected Long createMember(Long userId, String spaceId, Long teamId) {
        return iMemberService.createMember(userId, spaceId, teamId);
    }

    protected MockUserSpace createSingleUserAndSpace() {
        UserEntity user = createUserRandom();
        String spaceId = createSpaceWithoutName(user);

        // init context
        initCallContext(user.getId());

        return new MockUserSpace(user.getId(), spaceId);
    }

    protected void initCallContext(Long userId) {
        UserHolder.init();
        UserHolder.set(userId);
    }

    protected void refreshCallContext(Long userId) {
        UserHolder.set(userId);
    }

    protected MockInvitation prepareInvitationToken() {
        UserEntity user = createUserWithEmail(IdWorker.getIdStr() + "@test.com");
        String spaceId = createSpaceWithoutName(user);
        Long userId = user.getId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        String nodeId = iNodeService.createChildNode(userId, CreateNodeDto.builder()
                .spaceId(spaceId)
                .newNodeId(IdUtil.createDstId())
                .type(NodeType.DATASHEET.getNodeType())
                .build());
        String token = invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        return MockInvitation.builder()
                .token(token)
                .nodeId(nodeId)
                .userId(userId)
                .spaceId(spaceId)
                .memberId(iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId)).build();
    }

    protected Long addRoleMembers(MockUserSpace userSpace) {
        UserEntity user = iUserService.createUserByEmail("body@apitable.com");
        Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
        Long memberId = iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
        RoleMemberUnitRo rootTeamUnit = new RoleMemberUnitRo();
        RoleMemberUnitRo adminUnit = new RoleMemberUnitRo();
        RoleMemberUnitRo memberUnit = new RoleMemberUnitRo();
        rootTeamUnit.setId(rootTeamId);
        rootTeamUnit.setType(1);
        Long adminMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        adminUnit.setId(adminMemberId);
        adminUnit.setType(3);
        memberUnit.setId(memberId);
        memberUnit.setType(3);
        Long allPart = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "apitable boys");
        iRoleMemberService.addRoleMembers(allPart, CollUtil.newArrayList(rootTeamUnit, adminUnit, memberUnit));
        return allPart;
    }
}
