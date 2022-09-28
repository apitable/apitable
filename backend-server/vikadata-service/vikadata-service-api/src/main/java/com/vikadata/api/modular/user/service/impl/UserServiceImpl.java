package com.vikadata.api.modular.user.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.PageUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.cache.bean.OpenedSheet;
import com.vikadata.api.cache.bean.UserLinkInfo;
import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.LoginUserService;
import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.cache.service.UserLinkInfoService;
import com.vikadata.api.cache.service.UserSpaceOpenedSheetService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.LanguageManager;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationFactory;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.security.Auth0UserProfile;
import com.vikadata.api.constants.IntegralActionCodeConstants;
import com.vikadata.api.constants.LanguageConstants;
import com.vikadata.api.constants.NotificationConstants;
import com.vikadata.api.constants.UserQueryLimit;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.UserClosingException;
import com.vikadata.api.enums.exception.VCodeException;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.enums.user.UserOperationType;
import com.vikadata.api.enums.vcode.VCodeType;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.dto.vcode.VCodeDTO;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.model.ro.space.SpaceUpdateOpRo;
import com.vikadata.api.model.ro.user.DtBindOpRo;
import com.vikadata.api.model.ro.user.UserOpRo;
import com.vikadata.api.model.vo.user.UserInfoVo;
import com.vikadata.api.model.vo.user.UserLinkVo;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.developer.mapper.DeveloperMapper;
import com.vikadata.api.modular.integral.service.IIntegralService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.player.service.IPlayerActivityService;
import com.vikadata.api.modular.player.service.IPlayerNotificationService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.social.mapper.SocialUserBindMapper;
import com.vikadata.api.modular.social.service.ISocialCpTenantUserService;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.User;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.api.modular.user.service.IUserBindService;
import com.vikadata.api.modular.user.service.IUserHistoryService;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.user.strategey.CreateSocialUserSimpleFactory;
import com.vikadata.api.modular.user.strategey.CreateSocialUserStrategey;
import com.vikadata.api.modular.vcode.mapper.VCodeMapper;
import com.vikadata.api.modular.vcode.service.IVCodeService;
import com.vikadata.api.modular.vcode.service.IVCodeUsageService;
import com.vikadata.api.modular.workspace.service.INodeShareService;
import com.vikadata.api.util.DeveloperUtil;
import com.vikadata.api.util.RandomExtendUtil;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.define.dtos.UserInPausedDto;
import com.vikadata.entity.DeveloperEntity;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.entity.UserHistoryEntity;
import com.vikadata.system.config.notification.NotificationTemplate;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.AssetsPublicConstants.PUBLIC_PREFIX;
import static com.vikadata.api.constants.NotificationConstants.EXTRA_TOAST;
import static com.vikadata.api.constants.NotificationConstants.EXTRA_TOAST_CLOSE;
import static com.vikadata.api.constants.NotificationConstants.EXTRA_TOAST_URL;
import static com.vikadata.api.constants.SpaceConstants.SPACE_NAME_DEFAULT_SUFFIX;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_EMAIL_HAS_LINK;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_EMAIL_NOT_EXIT;
import static com.vikadata.api.enums.exception.UserException.LINK_EMAIL_ERROR;
import static com.vikadata.api.enums.exception.UserException.LINK_FAILURE;
import static com.vikadata.api.enums.exception.UserException.MOBILE_NO_EXIST;
import static com.vikadata.api.enums.exception.UserException.MODIFY_PASSWORD_ERROR;
import static com.vikadata.api.enums.exception.UserException.MUST_BIND_EAMIL;
import static com.vikadata.api.enums.exception.UserException.MUST_BIND_MOBILE;
import static com.vikadata.api.enums.exception.UserException.REGISTER_EMAIL_ERROR;
import static com.vikadata.api.enums.exception.UserException.REGISTER_EMAIL_HAS_EXIST;
import static com.vikadata.api.enums.exception.UserException.REGISTER_FAIL;
import static com.vikadata.api.enums.exception.UserException.SIGN_IN_ERROR;
import static com.vikadata.api.enums.exception.UserException.USERNAME_OR_PASSWORD_ERROR;
import static com.vikadata.api.enums.exception.UserException.USER_LANGUAGE_SET_UN_SUPPORTED;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_EXIST;
import static com.vikadata.api.enums.user.UserOperationType.COMPLETE_CLOSING;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-16
 */
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, UserEntity> implements IUserService {

    @Resource
    private LoginUserService loginUserService;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Resource
    private SocialUserBindMapper socialUserBindMapper;

    @Resource
    private IAssetService iAssetService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IPlayerActivityService iPlayerActivityService;

    @Resource
    private IVCodeService ivCodeService;

    @Resource
    private UserLinkInfoService userLinkInfoService;

    @Resource
    private UserActiveSpaceService userActiveSpaceService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private UserSpaceOpenedSheetService userSpaceOpenedSheetService;

    @Resource
    private INodeShareService nodeShareService;

    @Resource
    private ISpaceInviteLinkService spaceInviteLinkService;

    @Resource
    private IPlayerNotificationService notificationService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private FindByIndexNameSessionRepository<? extends Session> sessions;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private IIntegralService iIntegralService;

    @Resource
    private DeveloperMapper developerMapper;

    @Resource
    private IVCodeUsageService ivCodeUsageService;

    @Resource
    private IAuthService iAuthService;

    @Resource
    private ISocialCpTenantUserService iSocialCpTenantUserService;

    @Resource
    private ISocialCpUserBindService iSocialCpUserBindService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private IUserHistoryService iUserHistoryService;

    @Resource
    private CreateSocialUserSimpleFactory createSocialUserSimpleFactory;

    @Resource
    private UserMapper userMapper;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private VCodeMapper vCodeMapper;

    @Resource
    private IUserBindService iUserBindService;

    @Resource
    private NotificationFactory notificationFactory;

    @Override
    public Long getUserIdByMobile(String mobile) {
        return baseMapper.selectIdByMobile(mobile);
    }

    @Override
    public Long getUserIdByEmail(String email) {
        return baseMapper.selectIdByEmail(email);
    }

    @Override
    public boolean checkByCodeAndMobile(String code, String mobile) {
        code = StrUtil.prependIfMissing(code, "+");
        UserEntity userEntity = baseMapper.selectByMobile(mobile);
        if (userEntity == null) {
            return false;
        }
        return StrUtil.isNotBlank(userEntity.getCode()) && userEntity.getCode().equals(code);
    }

    @Override
    public boolean checkByEmail(String email) {
        return SqlTool.retCount(baseMapper.selectCountByEmail(email)) > 0;
    }

    @Override
    public UserEntity getByCodeAndMobilePhone(String code, String mobilePhone) {
        code = StrUtil.prependIfMissing(code, "+");
        UserEntity userEntity = baseMapper.selectByMobile(mobilePhone);
        if (userEntity == null) {
            return null;
        }
        if (StrUtil.isNotBlank(userEntity.getCode()) && userEntity.getCode().equals(code)) {
            return userEntity;
        }
        return null;
    }

    @Override
    public List<UserEntity> getByCodeAndMobilePhones(String code, Collection<String> mobilePhones) {
        List<UserEntity> userEntities = baseMapper.selectByMobilePhoneIn(mobilePhones);
        if (userEntities.isEmpty()) {
            return userEntities;
        }
        String finalCode = StrUtil.prependIfMissing(code, "+");
        return userEntities.stream().filter(user -> StrUtil.isNotBlank(user.getCode()) && user.getCode().equals(finalCode))
                .collect(Collectors.toList());
    }

    @Override
    public UserEntity getByEmail(String email) {
        return baseMapper.selectByEmail(email);
    }

    @Override
    public List<UserEntity> getByEmails(Collection<String> emails) {
        return baseMapper.selectByEmails(emails);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createByExternalSystem(String externalId, String nickName, String avatar, String email, String remark) {
        if (StrUtil.isNotBlank(email)) {
            // 查询现有的邮箱是否存在
            UserEntity selectUser = baseMapper.selectByEmail(email);
            if (selectUser != null) {
                UserEntity user = new UserEntity();
                user.setId(selectUser.getId());
                user.setNickName(nickName);
                user.setAvatar(avatar);
                user.setLastLoginTime(LocalDateTime.now());
                user.setRemark(remark);
                boolean flag = updateById(user);
                if (!flag) {
                    throw new BusinessException(SIGN_IN_ERROR);
                }
                iSocialUserBindService.create(selectUser.getId(), externalId);
                return selectUser.getId();
            }
        }
        log.info("创建账户");
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setNickName(StrUtil.isNotBlank(nickName) ? nickName : StrUtil.format("星球居民{}", RandomExtendUtil.randomString(4)));
        user.setAvatar(StrUtil.isNotBlank(avatar) ? avatar : getRandomAvatar());
        user.setEmail(email);
        user.setLastLoginTime(LocalDateTime.now());
        user.setRemark(remark);
        boolean flag = saveUser(user);
        if (!flag) {
            throw new BusinessException(SIGN_IN_ERROR);
        }
        if (StrUtil.isNotBlank(email)) {
            // 如果邮箱有被受邀且未绑定过其他账户，激活受邀邮箱的空间成员
            List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberByEmails(email);
            inactiveMemberProcess(user.getId(), inactiveMembers);
        }
        else {
            String spaceName = user.getNickName();
            if (LocaleContextHolder.getLocale().equals(LanguageManager.me().getDefaultLanguage())) {
                spaceName += SPACE_NAME_DEFAULT_SUFFIX;
            }
            iSpaceService.createSpace(user, spaceName);
        }
        // 创建用户活动记录
        iPlayerActivityService.createUserActivityRecord(user.getId());
        // 创建个人邀请码
        ivCodeService.createPersonalInviteCode(user.getId());
        // 创建关联用户
        iSocialUserBindService.create(user.getId(), externalId);
        return user.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createSocialUser(User user) {
        log.info("创建租户关联用户");
        // 根据不同租户类型获取策略实现创建用户
        CreateSocialUserStrategey strategy = createSocialUserSimpleFactory.getStrategy(user.getSocialPlatformType().getValue());
        return strategy.createSocialUser(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUser(SocialUser user) {
        String avatar = iAssetService.downloadAndUploadUrl(user.getAvatar());
        UserEntity entity = UserEntity.builder()
                .uuid(IdUtil.fastSimpleUUID())
                .nickName(user.getNickName())
                .avatar(avatar)
                .lastLoginTime(LocalDateTime.now())
                .build();
        saveUser(entity);
        // 创建用户活动记录
        iPlayerActivityService.createUserActivityRecord(entity.getId());
        // 创建个人邀请码
        ivCodeService.createPersonalInviteCode(entity.getId());
        // 创建关联用户
        iSocialUserBindService.create(entity.getId(), user.getUnionId());
        boolean isLink = iUserLinkService.isUserLink(user.getUnionId(), LinkType.FEISHU.getType());
        if (!isLink) {
            iUserLinkService.createThirdPartyLink(entity.getId(), user.getOpenId(), user.getUnionId(),
                    user.getNickName(), LinkType.FEISHU.getType());
        }
        return entity.getId();
    }

    @Override
    public boolean saveUser(UserEntity user) {
        boolean flag = save(user);
        TaskManager.me().execute(() -> {
            // jump to third site
            NotificationTemplate template =
                    notificationFactory.getTemplateById(NotificationTemplateId.NEW_USER_WELCOME_NOTIFY.getValue());
            Dict extras = Dict.create();
            if (StrUtil.isNotBlank(template.getUrl()) && template.getUrl().startsWith("http")) {
                Dict toast = Dict.create();
                toast.put(EXTRA_TOAST_URL, template.getUrl());
                toast.put(EXTRA_TOAST_CLOSE, ListUtil.toList("mark_cur_notice_to_read()"));
                extras.put(EXTRA_TOAST, toast);
            }
            NotificationManager.me().playerNotify(NotificationTemplateId.NEW_USER_WELCOME_NOTIFY,
                    Collections.singletonList(user.getId()), 0L, null, extras);
        });
        return flag;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUserByAuth0IfNotExist(Auth0UserProfile userProfile) {
        Long userId = iUserBindService.getUserIdByExternalKey(userProfile.getSub());
        if (userId == null) {
            // create user bind
            UserEntity userEntity = buildUserEntity(userProfile.getPicture(), userProfile.getNickname(), userProfile.getEmail());
            saveUser(userEntity);
            // 创建用户活动记录
            iPlayerActivityService.createUserActivityRecord(userEntity.getId());
            // 创建个人邀请码
            ivCodeService.createPersonalInviteCode(userEntity.getId());
            // create user bind
            iUserBindService.create(userEntity.getId(), userProfile.getSub());
            // init one space for user
            initialDefaultSpaceForUser(userEntity);
            userId = userEntity.getId();
        }
        List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByEmail(userProfile.getEmail());
        List<Long> memberIds = inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList());
        activeInvitationSpace(userId, memberIds);
        return userId;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUserByAuth0IfNotExist(com.auth0.json.mgmt.users.User user) {
        Long userId = iUserBindService.getUserIdByExternalKey(user.getId());
        if (userId == null) {
            // create user bind
            UserEntity userEntity = buildUserEntity(user.getPicture(), user.getNickname(), user.getEmail());
            saveUser(userEntity);
            // 创建用户活动记录
            iPlayerActivityService.createUserActivityRecord(userEntity.getId());
            // 创建个人邀请码
            ivCodeService.createPersonalInviteCode(userEntity.getId());
            // create user bind
            iUserBindService.create(userEntity.getId(), user.getId());
            // init one space for user
            initialDefaultSpaceForUser(userEntity);
            userId = userEntity.getId();
        }
        List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByEmail(user.getEmail());
        List<Long> memberIds = inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList());
        activeInvitationSpace(userId, memberIds);
        return userId;
    }

    private UserEntity buildUserEntity(String picture, String nickname, String email) {
        String avatar = iAssetService.downloadAndUploadUrl(picture);
        return UserEntity.builder()
                .uuid(IdUtil.fastSimpleUUID())
                .nickName(nickname)
                .avatar(avatar)
                .email(email)
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createWeComUser(SocialUser user) {
        String avatar = iAssetService.downloadAndUploadUrl(user.getAvatar());
        UserEntity entity = UserEntity.builder()
                .uuid(IdUtil.fastSimpleUUID())
                .code(user.getAreaCode())
                .mobilePhone(user.getTelephoneNumber())
                .nickName(user.getNickName())
                .avatar(avatar)
                .email(user.getEmailAddress())
                .lastLoginTime(LocalDateTime.now())
                .isSocialNameModified(user.getSocialAppType() == SocialAppType.ISV ?
                        SocialNameModified.NO.getValue() : SocialNameModified.NO_SOCIAL.getValue())
                .build();
        saveUser(entity);
        // 创建用户活动记录
        iPlayerActivityService.createUserActivityRecord(entity.getId());
        // 创建个人邀请码
        ivCodeService.createPersonalInviteCode(entity.getId());
        // 创建关联用户
        Long cpTenantUserId = iSocialCpTenantUserService.getCpTenantUserId(user.getTenantId(), user.getAppId(), user.getOpenId());
        if (Objects.isNull(cpTenantUserId)) {
            cpTenantUserId = iSocialCpTenantUserService.create(user.getTenantId(), user.getAppId(), user.getOpenId(), user.getUnionId());
        }
        boolean isBind = iSocialCpUserBindService.isCpTenantUserIdBind(entity.getId(), cpTenantUserId);
        if (!isBind) {
            iSocialCpUserBindService.create(entity.getId(), cpTenantUserId);
        }
        return entity.getId();
    }

    @Override
    public void activeTenantSpace(Long userId, String spaceId, String openId) {
        // 激活关联所在租户空间的成员
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, openId);
        if (member != null && member.getUserId() == null) {
            MemberEntity updatedMember = new MemberEntity();
            updatedMember.setId(member.getId());
            updatedMember.setUserId(userId);
            updatedMember.setIsActive(true);
            iMemberService.updateById(updatedMember);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(String areaCode, String mobile, String nickName, String avatar, String email, String spaceName) {
        // 使用手机号创建用户
        UserEntity entity = UserEntity.builder()
                .uuid(IdUtil.fastSimpleUUID())
                .code(areaCode)
                .mobilePhone(mobile)
                .nickName(nullToDefaultNickName(nickName))
                .avatar(nullToDefaultAvatar(avatar))
                .email(email)
                .lastLoginTime(LocalDateTime.now())
                .build();
        boolean flag = saveUser(entity);
        ExceptionUtil.isTrue(flag, REGISTER_FAIL);
        boolean hasSpace = false;
        if (email != null) {
            // 如果邮箱有被受邀且未绑定过其他账户，激活受邀邮箱的空间成员
            List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberByEmails(email);
            hasSpace = this.inactiveMemberProcess(entity.getId(), inactiveMembers);
        }
        // 激活导入的成员
        if (mobile != null) {
            int count = memberMapper.updateUserIdByMobile(entity.getId(), mobile);
            hasSpace = hasSpace || count > 0;
        }
        // 没有空间自动创建一个空间
        if (!hasSpace) {
            String newSpaceName;
            if (StrUtil.isNotBlank(spaceName)) {
                newSpaceName = spaceName;
            }
            else {
                newSpaceName = entity.getNickName();
                if (LocaleContextHolder.getLocale().equals(LanguageManager.me().getDefaultLanguage())) {
                    newSpaceName += SPACE_NAME_DEFAULT_SUFFIX;
                }
            }
            iSpaceService.createSpace(entity, newSpaceName);
        }
        // 创建用户活动记录
        iPlayerActivityService.createUserActivityRecord(entity.getId());
        // 创建个人邀请码
        ivCodeService.createPersonalInviteCode(entity.getId());
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserByMobilePhone(String areaCode, String mobile, String nickName, String avatar) {
        UserEntity entity = UserEntity.builder()
                .uuid(IdUtil.fastSimpleUUID())
                .code(areaCode)
                .mobilePhone(mobile)
                .nickName(nullToDefaultNickName(nickName))
                .avatar(nullToDefaultAvatar(avatar))
                .lastLoginTime(LocalDateTime.now())
                .build();
        boolean flag = saveUser(entity);
        ExceptionUtil.isTrue(flag, REGISTER_FAIL);
        // 创建用户活动记录
        iPlayerActivityService.createUserActivityRecord(entity.getId());
        // 创建个人邀请码
        ivCodeService.createPersonalInviteCode(entity.getId());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserByEmail(String email) {
        UserEntity entity = UserEntity.builder()
                .uuid(IdUtil.fastSimpleUUID())
                .email(email)
                .nickName(nullToDefaultNickName(null))
                .avatar(nullToDefaultAvatar(null))
                .lastLoginTime(LocalDateTime.now())
                .build();
        boolean flag = saveUser(entity);
        ExceptionUtil.isTrue(flag, REGISTER_FAIL);
        // 创建用户活动记录
        iPlayerActivityService.createUserActivityRecord(entity.getId());
        // 创建个人邀请码
        ivCodeService.createPersonalInviteCode(entity.getId());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUsersByCli() {
        int size = 50;
        String u = "test";
        String p = "13312345";
        for (int i = 0; i < size; i++) {
            if (i < 10) {
                createUserByCli(u + String.format("00%d@vikatest.com", i), "qwer1234", p + String.format("00%d", i));
            }
            else {
                createUserByCli(u + String.format("0%d@vikatest.com", i), "qwer1234", p + String.format("0%d", i));
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserByCli(String username, String password, String phone) {
        log.info("创建用户");
        ExceptionUtil.isTrue(Validator.isEmail(username), REGISTER_EMAIL_ERROR);
        UserEntity user = baseMapper.selectByEmail(username);
        ExceptionUtil.isNull(user, REGISTER_EMAIL_HAS_EXIST);
        UserEntity newUser = new UserEntity();
        newUser.setUuid(IdUtil.fastSimpleUUID());
        newUser.setEmail(username);
        newUser.setNickName(StrUtil.subBefore(username, '@', true));
        PasswordEncoder passwordEncoder = SpringContextHolder.getBean(PasswordEncoder.class);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setCode("+86");
        newUser.setMobilePhone(phone);
        boolean saveFlag = saveUser(newUser);
        ExceptionUtil.isTrue(saveFlag, REGISTER_FAIL);
        String spaceName = newUser.getNickName();
        if (LocaleContextHolder.getLocale().equals(LanguageManager.me().getDefaultLanguage())) {
            spaceName += SPACE_NAME_DEFAULT_SUFFIX;
        }
        iSpaceService.createSpace(newUser, spaceName);
        // 创建个人邀请码
        ivCodeService.createPersonalInviteCode(newUser.getId());
        // 创建用户活动记录
        iPlayerActivityService.createUserActivityRecord(newUser.getId());
        DeveloperEntity developer = new DeveloperEntity();
        developer.setId(IdWorker.getId());
        developer.setUserId(newUser.getId());
        developer.setApiKey(DeveloperUtil.createKey());
        developer.setCreatedBy(0L);
        developer.setUpdatedBy(0L);
        developerMapper.insert(developer);
        return newUser;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void initialDefaultSpaceForUser(UserEntity user) {
        // initial default space for new come user
        String spaceName = user.getNickName();
        if (LocaleContextHolder.getLocale().equals(LanguageManager.me().getDefaultLanguage())) {
            spaceName += SPACE_NAME_DEFAULT_SUFFIX;
        }
        iSpaceService.createSpace(user, spaceName);
    }

    @Override
    public void activeInvitationSpace(Long userId, List<Long> memberIds) {
        List<MemberEntity> memberEntities = new ArrayList<>();
        for (Long memberId : memberIds) {
            MemberEntity member = new MemberEntity();
            member.setId(memberId);
            member.setUserId(userId);
            member.setIsActive(true);
            memberEntities.add(member);
        }
        iMemberService.updateBatchById(memberEntities);
    }

    @Override
    public boolean checkUserHasBindEmail(Long userId) {
        log.info("查询用户是否绑定邮箱");
        UserEntity user = getById(userId);
        ExceptionUtil.isNotNull(user, USER_NOT_EXIST);
        return user.getEmail() != null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void bindMemberByEmail(Long userId, String spaceId, String email) {
        log.info("绑定成员邮箱");
        // 判断邮箱是否是未绑定，且是受邀邮箱
        MemberEntity member = iMemberService.getBySpaceIdAndEmail(spaceId, email);
        ExceptionUtil.isNotNull(member, INVITE_EMAIL_NOT_EXIT);
        ExceptionUtil.isNull(member.getUserId(), INVITE_EMAIL_HAS_LINK);

        // 判断请求用户邮箱是否已绑定其他邮箱、用户的邮箱必须为空
        String userEmail = baseMapper.selectEmailById(userId);
        ExceptionUtil.isBlank(userEmail, LINK_EMAIL_ERROR);
        // 绑定为用户邮箱，该邮箱被受邀的空间成员会一起激活
        updateEmailByUserId(userId, email);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateEmailByUserId(Long userId, String email) {
        log.info("修改用户[{}]邮箱[{}]", userId, email);
        UserEntity updateUser = new UserEntity();
        updateUser.setId(userId);
        updateUser.setEmail(email);
        boolean flag = updateById(updateUser);
        ExceptionUtil.isTrue(flag, LINK_EMAIL_ERROR);
        // 同步成员信息的邮箱
        iMemberService.updateEmailByUserId(userId, email);
        //如果邮箱有被受邀且未绑定过其他账户，激活受邀邮箱的空间成员
        List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberByEmails(email);
        this.inactiveMemberProcess(userId, inactiveMembers);
        //删除缓存
        loginUserService.delete(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void unbindEmailByUserId(Long userId) {
        // 用户解绑邮箱，需要至少绑定一个联系方式（手机号、邮箱）
        LoginUserDto userDto = loginUserService.getLoginUser(userId);
        ExceptionUtil.isNotBlank(userDto.getMobile(), MUST_BIND_MOBILE);
        boolean flag = SqlHelper.retBool(baseMapper.resetEmailByUserId(userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // 同步解绑成员信息的邮箱
        iMemberService.resetEmailByUserId(userId);
        // 删除缓存
        loginUserService.delete(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateMobileByUserId(Long userId, String code, String mobile) {
        LoginUserDto userDto = loginUserService.getLoginUser(userId);
        UserEntity updateUser = new UserEntity();
        updateUser.setId(userId);
        updateUser.setCode(code);
        updateUser.setMobilePhone(mobile);
        boolean flag = updateById(updateUser);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // 同步成员信息的手机号
        iMemberService.updateMobileByUserId(userId, mobile);
        // 如果手机号有被受邀且未绑定过其他账户，激活受邀的空间成员
        List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberByEmails(mobile);
        this.inactiveMemberProcess(userId, inactiveMembers);

        // 删除缓存
        loginUserService.delete(userId);
        // 邮箱注册首次绑定手机，补赠邀请奖励
        if (userDto.getMobile() == null) {
            TaskManager.me().execute(() -> {
                // 获取注册时的邀请码
                VCodeDTO vCodeDTO = ivCodeUsageService.getInvitorUserId(userId);
                if (vCodeDTO == null) {
                    return;
                }
                // 判断邀请码类型
                boolean isPersonal = vCodeDTO.getType().equals(VCodeType.PERSONAL_INVITATION_CODE.getType());
                String actionCode = isPersonal ? IntegralActionCodeConstants.BE_INVITED_TO_REWARD
                        : IntegralActionCodeConstants.OFFICIAL_INVITATION_REWARD;
                // 每个用户只能享受一次积分奖励
                int historyNum = iIntegralService.getCountByUserIdAndActionCode(userId, actionCode);
                if (historyNum >= 1) {
                    return;
                }
                // 个人邀请码奖励
                if (isPersonal) {
                    iAuthService.personalInvitedReward(userId, userDto.getNickName(), vCodeDTO.getUserId());
                    return;
                }
                // 官方邀请码奖励
                iAuthService.officialInvitedReward(userId);
            });
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void unbindMobileByUserId(Long userId) {
        // 用户解绑手机号，需要至少绑定一个联系方式（手机号、邮箱）
        LoginUserDto userDto = loginUserService.getLoginUser(userId);
        ExceptionUtil.isNotBlank(userDto.getEmail(), MUST_BIND_EAMIL);
        boolean flag = SqlHelper.retBool(baseMapper.resetMobileByUserId(userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // 同步解绑成员信息的手机号
        iMemberService.resetMobileByUserId(userId);
        // 删除缓存
        loginUserService.delete(userId);
    }

    @Override
    public void updateLoginTime(Long userId) {
        // 更新最后登陆时间
        UserEntity update = new UserEntity();
        update.setId(userId);
        update.setLastLoginTime(LocalDateTime.now());
        boolean flag = updateById(update);
        ExceptionUtil.isTrue(flag, SIGN_IN_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(Long userId, UserOpRo param) {
        log.info("编辑用户信息");
        UserEntity userEntity = getById(userId);
        ExceptionUtil.isNotNull(userEntity, USER_NOT_EXIST);
        UserEntity user = UserEntity.builder().id(userId).build();
        String waitDeleteOldAvatar = null;
        if (StrUtil.isNotBlank(param.getAvatar())) {
            user.setAvatar(param.getAvatar());
            waitDeleteOldAvatar = userEntity.getAvatar();
        }
        if (StrUtil.isNotBlank(param.getLocale())) {
            ExceptionUtil.isTrue(LanguageConstants.isLanguagesSupported(param.getLocale()), USER_LANGUAGE_SET_UN_SUPPORTED);
            user.setLocale(param.getLocale());
        }
        if (StrUtil.isNotBlank(param.getNickName())) {
            //初始化昵称，若存在注册自动创建的空间"星球居民***的空间站"，将空间名同步修改
            if (BooleanUtil.isTrue(param.getInit())) {
                String spaceId = spaceMapper.selectSpaceIdByUserIdAndName(userId, userEntity.getNickName());
                if (StrUtil.isNotBlank(spaceId)) {
                    String spaceName = param.getNickName();
                    if (LocaleContextHolder.getLocale().equals(LanguageManager.me().getDefaultLanguage())) {
                        spaceName += SPACE_NAME_DEFAULT_SUFFIX;
                    }
                    iSpaceService.updateSpace(userId, spaceId, SpaceUpdateOpRo.builder().name(spaceName).build());
                }
            }
            // 同步个人昵称到未指定修改过的成员名称
            iMemberService.updateMemberNameByUserId(userId, param.getNickName());
            // 同步修改成员'SocialNameModified'字段状态
            memberMapper.updateSocialNameModifiedByUserId(userId);
            // 删除修改了成员名称的空间缓存
            TaskManager.me().execute(() -> {
                List<String> spaceIds = iMemberService.getSpaceIdWithoutNameModifiedByUserId(userId);
                for (String spcId : spaceIds) {
                    userSpaceService.delete(userId, spcId);
                }
            });
            user.setNickName(param.getNickName())
                    .setIsSocialNameModified(SocialNameModified.YES.getValue());
            if (BooleanUtil.isTrue(param.getInit())) {
                // 如果是邀请奖励进来操作修改用户名称
                String key = RedisConstants.getInviteHistoryKey(userId.toString());
                if (BooleanUtil.isTrue(redisTemplate.hasKey(key))) {
                    Long recordId = Long.parseLong(StrUtil.toString(redisTemplate.opsForValue().get(key)));
                    iIntegralService.updateParameterById(recordId, JSONUtil.createObj().putOnce("userId", userId).putOnce("name", param.getNickName()).toString());
                    redisTemplate.delete(key);
                }
            }
        }
        boolean flag = updateById(user);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        //删除缓存
        loginUserService.delete(userId);
        if (StrUtil.isNotBlank(waitDeleteOldAvatar) && StrUtil.startWith(waitDeleteOldAvatar, PUBLIC_PREFIX)) {
            // 删除云端原文件
            iAssetService.delete(waitDeleteOldAvatar);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePwd(Long id, String password) {
        log.info("修改密码");
        PasswordEncoder passwordEncoder = SpringContextHolder.getBean(PasswordEncoder.class);
        UserEntity user = UserEntity.builder()
                .id(id)
                .password(passwordEncoder.encode(password))
                .build();

        //删除缓存
        loginUserService.delete(id);
        boolean flag = updateById(user);
        ExceptionUtil.isTrue(flag, MODIFY_PASSWORD_ERROR);
    }

    @Override
    public UserInfoVo getCurrentUserInfo(Long userId, String spaceId, Boolean filter) {
        log.info("获取用户信息和空间内容");
        // 查询用户基本信息
        LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
        UserLinkInfo userLinkInfo = userLinkInfoService.getUserLinkInfo(loginUserDto.getUserId());
        // 复制第三方帐号关联信息
        List<UserLinkVo> thirdPartyInformation = new ArrayList<>(userLinkInfo.getAccountLinkList().size());
        for (int i = 0; i < userLinkInfo.getAccountLinkList().size(); i++) {
            UserLinkVo linkVo = new UserLinkVo();
            BeanUtil.copyProperties(userLinkInfo.getAccountLinkList().get(i), linkVo);
            thirdPartyInformation.add(linkVo);
        }
        // 是否使用过邀请码奖励
        boolean usedInviteReward = iIntegralService.checkByUserIdAndActionCodes(userId,
                CollectionUtil.newArrayList(IntegralActionCodeConstants.BE_INVITED_TO_REWARD, IntegralActionCodeConstants.OFFICIAL_INVITATION_REWARD));
        UserInfoVo userInfo = UserInfoVo.builder().sendSubscriptionNotify(constProperties.getSendSubscriptionNotify())
                .usedInviteReward(usedInviteReward)
                .build()
                .transferDataFromDto(loginUserDto, userLinkInfo, thirdPartyInformation);

        if (userInfo.getIsPaused()) { // 注销冷静期内账号，计算正式注销时间
            UserHistoryEntity userHistory = iUserHistoryService
                    .getLatestUserHistoryEntity(userId, UserOperationType.APPLY_FOR_CLOSING);
            ExceptionUtil.isNotNull(userHistory, UserClosingException.USER_HISTORY_RECORD_ISSUE);
            userInfo.setCloseAt(userHistory.getCreatedAt().plusDays(30).withHour(0).withMinute(0).withSecond(0));
        }

        boolean noSpace = StrUtil.isBlank(spaceId);
        // 选择性过滤空间相关信息
        if (BooleanUtil.isTrue(filter)) {
            if (noSpace) {
                return userInfo;
            }
            Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
            if (ObjectUtil.isNull(memberId)) {
                return userInfo;
            }
        }
        else if (noSpace) {
            // 不传空间ID时，获取用户最近工作的空间ID
            String activeSpaceId = userActiveSpaceService.getLastActiveSpace(userId);
            if (StrUtil.isBlank(activeSpaceId)) {
                return userInfo;
            }
            spaceId = activeSpaceId;
        }
        else {
            // 防止访问未加入的空间
            userSpaceService.getMemberId(userId, spaceId);
        }
        userInfo.setNeedCreate(false);
        //缓存取会话
        UserSpaceDto userSpace = userSpaceService.getUserSpace(userId, spaceId);
        userInfo.setSpaceId(userSpace.getSpaceId());
        userInfo.setSpaceName(userSpace.getSpaceName());
        userInfo.setSpaceLogo(userSpace.getSpaceLogo());
        userInfo.setMemberId(userSpace.getMemberId());
        userInfo.setMemberName(userSpace.getMemberName());
        userInfo.setUnitId(userSpace.getUnitId());
        userInfo.setIsAdmin(userSpace.isAdmin() || userSpace.isMainAdmin());
        userInfo.setIsMainAdmin(userSpace.isMainAdmin());
        userInfo.setIsDelSpace(userSpace.isDel());
        userInfo.setIsNewComer(!iMemberService.checkUserHasModifyNameInSpace(userId));
        userInfo.setIsMemberNameModified(userSpace.getIsMemberNameModified());

        //获取上一次打开的数表信息
        OpenedSheet openedSheet = userSpaceOpenedSheetService.getOpenedSheet(userId, spaceId);
        if (ObjectUtil.isNotNull(openedSheet) && ObjectUtil.isNotNull(openedSheet.getNodeId())) {
            userInfo.setActiveNodeId(openedSheet.getNodeId());
            userInfo.setActiveViewId(openedSheet.getViewId());
            userInfo.setActiveNodePos(openedSheet.getPosition());
        }

        return userInfo;
    }

    @Override
    public void bindDingTalk(DtBindOpRo opRo) {
        log.info("关联钉钉");
        //判断是否存在
        Long id = baseMapper.selectIdByMobile(opRo.getPhone());
        ExceptionUtil.isNotNull(id, MOBILE_NO_EXIST);
        UserEntity user = UserEntity.builder()
                .id(id)
                .dingOpenId(opRo.getOpenId())
                .dingUnionId(opRo.getUnionId())
                .build();

        boolean flag = updateById(user);
        ExceptionUtil.isTrue(flag, LINK_FAILURE);
        //绑定成功、自动登陆保存session
        SessionContext.setUserId(id);
    }

    @Override
    public void closeMultiSession(Long userId, boolean isRetain) {
        Collection<? extends Session> usersSessions = this.sessions.findByPrincipalName(userId.toString()).values();
        if (CollUtil.isNotEmpty(usersSessions)) {
            List<String> idList = usersSessions.stream().map(Session::getId).collect(Collectors.toList());
            if (isRetain) {
                HttpSession httpSession = HttpContextUtil.getSession(false);
                if (httpSession != null) {
                    idList.remove(httpSession.getId());
                }
            }
            for (String id : idList) {
                this.sessions.deleteById(id);
            }
        }
    }

    @Override
    public void unbind(Long userId, Integer type) {
        log.info("创建(用户)账单账户");
        String linkUnionId = userLinkMapper.selectUnionIdByUserIdAndType(userId, type);
        // 删除第三方集成关联
        socialUserBindMapper.deleteByUnionIds(Collections.singletonList(linkUnionId));
        // 删除账号关联
        userLinkMapper.deleteByUserIdAndType(userId, type);
    }

    @Override
    public String getUuidByUserId(Long userId) {
        return baseMapper.selectUuidById(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void applyForClosingAccount(UserEntity user) {
        // 更新用户注销冷静期的状态为是
        updateIsPaused(user.getId(), true);
        // 新增用户操作记录
        iUserHistoryService.create(user, UserOperationType.APPLY_FOR_CLOSING);
        // 逻辑删除user share.
        nodeShareService.disableNodeSharesByUserId(user.getId());
        // 删除userLoginDto缓存
        loginUserService.delete(user.getId());
        // 逻辑删除space invite link.
        List<MemberEntity> members = iMemberService.getByUserId(user.getId());
        if (members.size() == 0) {
            return;
        }
        List<Long> memberIds = members.stream().map(MemberEntity::getId).collect(Collectors.toList());
        spaceInviteLinkService.deleteByMemberIds(memberIds);
        // 逻辑删除成员信息
        iMemberService.preDelByMemberIds(memberIds);

        // notify the main admin about this member is going to close his account.
        List<String> spaceIds = members.stream().map(MemberEntity::getSpaceId).collect(Collectors.toList());
        List<SpaceEntity> spaces = iSpaceService.getBySpaceIds(spaceIds);
        if (spaces.size() == 0) {
            return;
        }
        List<NotificationCreateRo> notificationCreateRos = genNotificationCreateRos(user, spaces);
        notificationService.batchCreateNotify(notificationCreateRos);
    }

    /**
     * 封装Notification，用于通知主管理员成员已申请注销.
     *
     * @param user 用户
     * @param spaces 空间列表
     * @return NotificationCreateRo List
     */
    private List<NotificationCreateRo> genNotificationCreateRos(UserEntity user, List<SpaceEntity> spaces) {
        List<NotificationCreateRo> ros = Lists.newArrayList();
        spaces.forEach(spaceEntity -> {
            NotificationCreateRo notifyRo = new NotificationCreateRo();
            notifyRo.setSpaceId(spaceEntity.getSpaceId());
            String memberId = String.valueOf(spaceEntity.getOwner());
            notifyRo.setToMemberId(Lists.newArrayList(memberId));
            notifyRo.setFromUserId(String.valueOf(user.getId()));
            Dict extras = Dict.create().set("nickName", user.getNickName());
            JSONObject data = JSONUtil.createObj().putOnce(NotificationConstants.BODY_EXTRAS, extras)
                    .set("nickName", user.getNickName());
            notifyRo.setBody(data);
            notifyRo.setTemplateId(NotificationTemplateId.MEMBER_APPLIED_TO_CLOSE_ACCOUNT.getValue());
            ros.add(notifyRo);
        });
        return ros;
    }

    private void updateIsPaused(Long userId, boolean isPaused) {
        UserEntity userPaused = UserEntity.builder()
                .id(userId).isPaused(isPaused).build();
        baseMapper.updateById(userPaused);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelClosingAccount(UserEntity user) {
        // 更新用户为注销冷静期状态为否
        updateIsPaused(user.getId(), false);
        // 获取当前未逻辑删除的成员信息，兼容通信录同步导致的异常情况.
        List<MemberEntity> unexpectedMembers = iMemberService.getByUserId(user.getId());
        List<Long> unexpectedMemberIds = unexpectedMembers.stream().map(MemberEntity::getId)
                .collect(Collectors.toList());
        // 逻辑删除异常成员信息.
        if (unexpectedMemberIds.size() > 0) {
            memberMapper.deleteBatchByIds(unexpectedMemberIds);
        }
        // 恢复成员信息
        iMemberService.cancelPreDelByUserId(user.getId());
        // 删除userLoginDto缓存
        loginUserService.delete(user.getId());
        // 新增用户操作记录
        UserHistoryEntity userHistory = UserHistoryEntity.builder().userId(user.getId())
                .userStatus(UserOperationType.CANCEL_CLOSING.getStatusCode())
                .uuid(user.getUuid())
                .build();
        iUserHistoryService.create(userHistory);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void closeAccount(UserEntity user) {
        // 清除该用户的昵称、区号、手机和邮箱信息
        userMapper.resetUserById(user.getId());
        // 清除该用户在成员表的信息
        memberMapper.clearMemberInfoByUserId(user.getId());
        // 物理删除用户第三方关联绑定信息
        userLinkMapper.deleteByUserId(user.getId());
        iSocialUserBindService.deleteByUserId(user.getId());
        iSocialCpUserBindService.deleteByUserId(user.getId());
        // 往历史表中写入"已完成注销"记录，0代表系统用户
        UserHistoryEntity userHistory = UserHistoryEntity.builder()
                .userId(user.getId())
                .uuid(user.getUuid())
                .userStatus(COMPLETE_CLOSING.getStatusCode())
                .createdBy(user.getId())
                .updatedBy(user.getId())
                .build();
        iUserHistoryService.create(userHistory);
    }

    @Override
    public List<UserInPausedDto> getPausedUserDtos(List<Long> userIds) {
        return userMapper.selectPausedUsers(userIds);
    }

    private boolean inactiveMemberProcess(Long userId, List<MemberDto> inactiveMembers) {
        if (CollUtil.isEmpty(inactiveMembers)) {
            return false;
        }
        List<Long> activateMember = new ArrayList<>();
        List<Long> delMember = new ArrayList<>();
        // 获取用户所有空间的ID
        List<String> spaceIds = iMemberService.getSpaceIdByUserId(userId);
        inactiveMembers.forEach(member -> {
            if (spaceIds.contains(member.getSpaceId())) {
                // 未激活的成员，已存在用户空间中，删除该未激活成员
                delMember.add(member.getId());
            }
            else {
                activateMember.add(member.getId());
            }
        });
        if (CollUtil.isNotEmpty(activateMember)) {
            // 激活受邀空间的成员，并同步用户信息
            UserEntity entity = getById(userId);
            if (entity != null) {
                List<MemberEntity> updateMembers = new ArrayList<>();
                activateMember.forEach(memberId -> {
                    MemberEntity updateMember = new MemberEntity();
                    updateMember.setId(memberId);
                    updateMember.setUserId(userId);
                    updateMember.setMemberName(entity.getNickName());
                    updateMember.setMobile(entity.getMobilePhone());
                    updateMember.setEmail(entity.getEmail());
                    updateMember.setIsActive(true);
                    updateMembers.add(updateMember);
                });
                iMemberService.updateBatchById(updateMembers);
            }
        }
        // 删除同一个空间重复的未激活成员
        if (CollUtil.isNotEmpty(delMember)) {
            iMemberService.removeByMemberIds(delMember);
        }
        return true;
    }

    private String getRandomAvatar() {
        String defaultAvatarList = constProperties.getDefaultAvatarList();
        if (StrUtil.isBlank(defaultAvatarList)) {
            return null;
        }
        String[] splits = defaultAvatarList.split(",");
        if (splits.length == 0) {
            return null;
        }
        return splits[RandomUtil.randomInt(0, splits.length)];
    }

    @Override
    public List<UserLangDTO> getLangByEmails(List<String> emails) {
        String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        return this.getLangByEmails(defaultLang, emails);
    }

    @Override
    public List<UserLangDTO> getLangByEmails(String expectedLang, List<String> emails) {
        // 由于in可能存在性能问题，采用分段查询。
        List<UserLangDTO> userLangs = new ArrayList<>(emails.size());
        int page = PageUtil.totalPage(emails.size(), UserQueryLimit.QUERY_LOCALE_IN_EMAILS_LIMIT);
        for (int i = 0; i < page; i++) {
            List<String> subEmails = CollUtil.page(i, UserQueryLimit.QUERY_LOCALE_IN_EMAILS_LIMIT, emails);
            userLangs.addAll(userMapper.selectLocaleInEmailsWithDefaultLocale(expectedLang, subEmails));
        }
        // 添加上数据库中没有的email
        if (userLangs.size() != emails.size()) {
            // 一般不会走进这个判断
            List<String> existEmails = userLangs.stream().map(UserLangDTO::getEmail).collect(Collectors.toList());
            List<String> nonExistEmails = CollUtil.subtractToList(emails, existEmails);
            nonExistEmails.forEach(email -> {
                UserLangDTO userLangDTO = new UserLangDTO();
                userLangDTO.setLocale(expectedLang);
                userLangDTO.setEmail(email);
                userLangs.add(userLangDTO);
            });
        }
        return userLangs;
    }

    @Override
    public String getLangByEmail(String expectedLang, String email) {
        UserLangDTO userLangDTO = userMapper.selectLocaleByEmailWithDefaultLocale(expectedLang, email);
        if (ObjectUtil.isNotNull(userLangDTO)) {
            return userLangDTO.getLocale();
        }
        return expectedLang;
    }

    @Override
    public List<UserLangDTO> getLangAndEmailByIds(List<Long> userIds, String defaultLocale) {
        List<UserLangDTO> dtos = userMapper.selectLocaleAndEmailByIds(userIds);
        return dtos.stream().peek(v -> {
            if (StrUtil.isBlank(v.getLocale())) {
                v.setLocale(defaultLocale);
            }
        }).collect(Collectors.toList());
    }

    @Override
    public void useInviteCodeReward(Long userId, String inviteCode) {
        // 查询用户的邀请码，判断不可用自身的邀请码
        String userInviteCode = ivCodeService.getUserInviteCode(userId);
        ExceptionUtil.isFalse(inviteCode.equals(userInviteCode), VCodeException.INVITE_CODE_NOT_VALID);
        // 用户没使用过邀请奖励
        boolean usedInviteReward = iIntegralService.checkByUserIdAndActionCodes(userId,
                CollectionUtil.newArrayList(IntegralActionCodeConstants.BE_INVITED_TO_REWARD, IntegralActionCodeConstants.OFFICIAL_INVITATION_REWARD));
        ExceptionUtil.isFalse(usedInviteReward, VCodeException.INVITE_CODE_REWARD_ERROR);
        // 加载用户信息
        LoginUserDto userDto = loginUserService.getLoginUser(userId);
        // 保存邀请码使用记录
        ivCodeService.useInviteCode(userId, userDto.getNickName(), inviteCode);
        // 查询邀请码所属用户，不存在则代表官方邀请码
        Long inviteUserId = vCodeMapper.selectRefIdByCodeAndType(inviteCode, VCodeType.PERSONAL_INVITATION_CODE.getType());
        if (inviteUserId == null) {
            // 非个人邀请码，官方邀请码
            iAuthService.officialInvitedReward(userId);
            return;
        }
        iAuthService.personalInvitedReward(userId, userDto.getNickName(), inviteUserId);
    }

    @Override
    public Long getUserIdByUuid(String uuid) {
        return userMapper.selectIdByUuid(uuid);
    }

    private String nullToDefaultNickName(String nickName) {
        return StrUtil.blankToDefault(nickName, String.format("星球居民%s", RandomExtendUtil.randomString(4)));
    }

    private String nullToDefaultAvatar(String avatar) {
        return StrUtil.blankToDefault(avatar, getRandomAvatar());
    }

    /**
     * 根据用户名查询用户
     * 用户名可以是邮箱或者区号+手机号
     *
     * @param areaCode 区号
     * @param username 用户名
     * @return UserEntity
     */
    @Override
    public UserEntity getByUsername(String areaCode, String username) {
        if (Validator.isEmail(username)) {
            // 判断是否存在
            UserEntity user = this.getByEmail(username);
            ExceptionUtil.isNotNull(user, USERNAME_OR_PASSWORD_ERROR);
            return user;
        }
        else if (StrUtil.isNotBlank(areaCode)) {
            ExceptionUtil.isTrue(Validator.isNumber(username), USERNAME_OR_PASSWORD_ERROR);
            // 判断是否存在
            UserEntity user = this.getByCodeAndMobilePhone(areaCode, username);
            ExceptionUtil.isNotNull(user, USERNAME_OR_PASSWORD_ERROR);
            return user;
        }
        else {
            //用户名格式错误
            throw new BusinessException(USERNAME_OR_PASSWORD_ERROR);
        }
    }
}
