package com.vikadata.api;

import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.vikadata.api.auth.service.IAuthService;
import com.vikadata.api.client.service.IClientReleaseVersionService;
import com.vikadata.api.interfaces.billing.facade.EntitlementServiceFacade;
import com.vikadata.api.internal.service.IFieldService;
import com.vikadata.api.mock.bean.MockInvitation;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.organization.ro.RoleMemberUnitRo;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.organization.service.IRoleMemberService;
import com.vikadata.api.organization.service.IRoleService;
import com.vikadata.api.organization.service.ITeamMemberRelService;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.shared.clock.MockClock;
import com.vikadata.api.shared.clock.spring.ClockManager;
import com.vikadata.api.shared.holder.UserHolder;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.api.space.service.IInvitationService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.sql.script.enhance.TablePrefixUtil;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.workspace.dto.CreateNodeDto;
import com.vikadata.api.workspace.enums.NodeType;
import com.vikadata.api.workspace.service.INodeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;


@SpringBootTest(classes = { Application.class })
@AutoConfigureMockMvc
@ExtendWith({ MockitoExtension.class })
@TestPropertySource(value = {
        "classpath:test.properties",
}, properties = { "vikadata.test.test-mode=true" })
public abstract class AbstractIntegrationTest extends TestSuiteWithDB {

    /**
     * using east 8 timezone for testing
     */
    protected static final ZoneOffset testTimeZone = ZoneOffset.ofHours(8);

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Value("${mybatis-plus.configuration-properties.tablePrefix:vika_}")
    protected String tablePrefix;

    @Autowired
    protected RedisTemplate<String, Object> redisTemplate;

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
    protected IClientReleaseVersionService iClientReleaseVersionService;

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
        return this.tablePrefix;
    }

    protected void execute(String sql) {
        String newSql = TablePrefixUtil.changeTablePrefix(sql, this.tablePrefix);
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
        return createUserWithEmail(IdWorker.getIdStr() + "@vikadata.com");
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
        UserEntity user = iUserService.createUserByEmail("vikaboy@vikadata.com");
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
        Long allPart = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "vika boys");
        iRoleMemberService.addRoleMembers(allPart, CollUtil.newArrayList(rootTeamUnit, adminUnit, memberUnit));
        return allPart;
    }
}
