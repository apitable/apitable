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
import com.apitable.asset.service.IAssetCallbackService;
import com.apitable.asset.service.IAssetService;
import com.apitable.asset.service.IAssetUploadTokenService;
import com.apitable.asset.task.AssetTask;
import com.apitable.auth.service.IAuthService;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.automation.service.IAutomationTriggerService;
import com.apitable.automation.service.IAutomationTriggerTypeService;
import com.apitable.client.task.ClientTasks;
import com.apitable.control.service.IControlRoleService;
import com.apitable.control.service.IControlService;
import com.apitable.internal.service.IFieldService;
import com.apitable.internal.service.InternalSpaceService;
import com.apitable.mock.bean.MockInvitation;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.organization.ro.RoleMemberUnitRo;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamMemberRelService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.player.service.IPlayerNotificationService;
import com.apitable.shared.cache.service.TemplateConfigCacheService;
import com.apitable.shared.captcha.email.EmailValidateCodeProcessor;
import com.apitable.shared.captcha.sms.SmsValidateCodeProcessor;
import com.apitable.shared.clock.MockClock;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.component.notification.INotificationFactory;
import com.apitable.shared.component.notification.queue.NotificationConsumer;
import com.apitable.shared.config.properties.SystemProperties;
import com.apitable.shared.holder.UserHolder;
import com.apitable.shared.util.IdUtil;
import com.apitable.shared.util.RandomExtendUtil;
import com.apitable.space.service.IInvitationService;
import com.apitable.space.service.ISpaceInvitationService;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceMemberRoleRelService;
import com.apitable.space.service.ISpaceRoleResourceRelService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.service.IStaticsService;
import com.apitable.starter.amqp.core.RabbitSenderService;
import com.apitable.starter.mail.autoconfigure.MailTemplate;
import com.apitable.starter.oss.core.OssClientTemplate;
import com.apitable.template.service.ITemplateAlbumRelService;
import com.apitable.template.service.ITemplateAlbumService;
import com.apitable.template.service.ITemplateService;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.service.IUserService;
import com.apitable.user.task.UserTasks;
import com.apitable.widget.service.IWidgetPackageService;
import com.apitable.widget.service.IWidgetUploadService;
import com.apitable.workspace.dto.CreateNodeDto;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.service.IDatasheetMetaService;
import com.apitable.workspace.service.IFieldRoleService;
import com.apitable.workspace.service.INodeRoleService;
import com.apitable.workspace.service.INodeRubbishService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.IResourceMetaService;
import com.apitable.workspace.service.NodeBundleService;
import com.baomidou.mybatisplus.autoconfigure.MybatisPlusProperties;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestClient;

@SpringBootTest(classes = Application.class)
@TestPropertySource(value = {
    "classpath:test.properties", "classpath:spring.properties"
})
@ComponentScan(excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE,
    classes = {
        UserTasks.class,
        AssetTask.class,
        ClientTasks.class,
        NotificationConsumer.class
    })
)
@AutoConfigureMockMvc
public abstract class AbstractIntegrationTest extends TestSuiteWithDB {

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected RedisTemplate<String, Object> redisTemplate;

    @MockBean
    protected RestClient restClient;

    @Autowired
    protected MybatisPlusProperties mybatisPlusProperties;

    @Autowired
    protected SystemProperties systemProperties;

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
    protected INodeRubbishService iNodeRubbishService;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected IFieldService iFieldService;

    @Autowired
    protected IInvitationService invitationService;

    @Autowired
    protected IRoleService iRoleService;

    @Autowired
    protected IRoleMemberService iRoleMemberService;

    @Autowired
    protected ITemplateService iTemplateService;

    @Autowired
    protected IAssetCallbackService iAssetCallbackService;

    @Autowired
    protected IAssetUploadTokenService iAssetUploadTokenService;

    @Autowired
    protected IPlayerNotificationService iPlayerNotificationService;

    @Autowired
    protected INotificationFactory notificationFactory;

    @Autowired
    protected TemplateConfigCacheService templateConfigCacheService;

    @Autowired
    protected ISpaceInviteLinkService iSpaceInviteLinkService;

    @Autowired
    protected ISpaceInvitationService iSpaceInvitationService;

    @Autowired
    protected IControlRoleService iControlRoleService;

    @Autowired
    protected IUnitService iUnitService;

    @Autowired
    protected ISpaceRoleService iSpaceRoleService;

    @Autowired
    protected ISpaceMemberRoleRelService iSpaceMemberRoleRelService;

    @Autowired
    protected ISpaceRoleResourceRelService iSpaceRoleResourceRelService;

    @Autowired
    protected IStaticsService iStaticsService;

    @Autowired
    protected ITemplateAlbumService iTemplateAlbumService;

    @Autowired
    protected ITemplateAlbumRelService iTemplateAlbumRelService;

    @Autowired
    protected IWidgetUploadService iWidgetUploadService;

    @Autowired
    protected IWidgetPackageService iWidgetPackageService;

    @Autowired
    protected IFieldRoleService iFieldRoleService;

    @Autowired
    protected INodeRoleService iNodeRoleService;

    @Autowired
    protected IControlService iControlService;

    @Autowired
    protected IDatasheetMetaService iDatasheetMetaService;

    @Autowired
    protected IResourceMetaService iResourceMetaService;

    @Autowired
    protected InternalSpaceService internalSpaceService;

    @Autowired
    protected IAssetService iAssetService;

    @Autowired
    protected IAutomationTriggerService iAutomationTriggerService;

    @Autowired
    protected IAutomationRobotService iAutomationRobotService;

    @Autowired
    protected IAutomationTriggerTypeService iAutomationTriggerTypeService;

    @Autowired
    protected NodeBundleService nodeBundleService;

    @Value("#{'${exclude}'.split(',')}")
    private List<String> excludeTables;

    @MockBean
    protected EmailValidateCodeProcessor emailValidateCodeProcessor;

    @MockBean
    protected SmsValidateCodeProcessor smsValidateCodeProcessor;

    @MockBean
    protected MailTemplate mailTemplate;

    @MockBean
    protected OssClientTemplate ossTemplate;

    @MockBean
    protected RabbitSenderService rabbitSenderService;

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

    protected UserEntity createUserWithEmail(String email) {
        return iUserService.createUserByEmail(email);
    }

    protected String createSpaceWithoutName(UserEntity user) {
        return iSpaceService.createSpace(user, "test space").getId();
    }

    protected Long createMember(Long userId, String spaceId) {
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        return createMember(userId, spaceId, rootTeamId);
    }

    protected Long createMember(Long userId, String spaceId, Long teamId) {
        return iMemberService.createMember(userId, spaceId, teamId);
    }

    protected MockUserSpace createSingleUserAndSpace() {
        UserEntity user =
            iUserService.createUserByEmail(
                "test_user" + RandomExtendUtil.randomString(10) + "@apitable.com",
                "123456");
        String spaceId = createSpaceWithoutName(user);

        // init context
        initCallContext(user.getId());

        // get member id in space
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), spaceId);

        return new MockUserSpace(user.getId(), spaceId, memberId);
    }

    protected void initCallContext(Long userId) {
        UserHolder.init();
        refreshCallContext(userId);
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
        String token =
            invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
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
        Long memberId =
            iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
        RoleMemberUnitRo rootTeamUnit = new RoleMemberUnitRo();
        RoleMemberUnitRo adminUnit = new RoleMemberUnitRo();
        RoleMemberUnitRo memberUnit = new RoleMemberUnitRo();
        rootTeamUnit.setId(rootTeamId);
        rootTeamUnit.setType(1);
        Long adminMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        adminUnit.setId(adminMemberId);
        adminUnit.setType(3);
        memberUnit.setId(memberId);
        memberUnit.setType(3);
        Long allPart =
            iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "apitable boys");
        iRoleMemberService.addRoleMembers(allPart,
            CollUtil.newArrayList(rootTeamUnit, adminUnit, memberUnit));
        return allPart;
    }

    protected void initNodeTreeMockData(String spaceId, String rootNodeId) {
        List<NodeEntity> nodeEntities = Lists.list(
            NodeEntity.builder()
                .spaceId(spaceId).parentId(rootNodeId).nodeId("L1")
                .type(NodeType.FOLDER.getNodeType()).nodeName("L1")
                .build(),
            NodeEntity.builder()
                .spaceId(spaceId).parentId("L1").nodeId("L2-1")
                .type(NodeType.DATASHEET.getNodeType()).nodeName("L2-1")
                .build(),
            NodeEntity.builder()
                .spaceId(spaceId).parentId("L1").nodeId("L2-2")
                .type(NodeType.DATASHEET.getNodeType()).nodeName("L2-2")
                .build(),
            NodeEntity.builder()
                .spaceId(spaceId).parentId("L1").nodeId("L2-3")
                .type(NodeType.DATASHEET.getNodeType()).nodeName("L2-3")
                .build(),
            NodeEntity.builder()
                .spaceId(spaceId).parentId("L1").nodeId("L2-4")
                .type(NodeType.DATASHEET.getNodeType()).nodeName("L2-4")
                .build(),
            NodeEntity.builder()
                .spaceId(spaceId).parentId("L1").nodeId("L2-5")
                .type(NodeType.DATASHEET.getNodeType()).nodeName("L2-5")
                .build()
        );
        iNodeService.saveBatch(nodeEntities);
    }
}
