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

package com.apitable.user.service.impl;

import static com.apitable.organization.enums.OrganizationException.INVITE_EMAIL_HAS_LINK;
import static com.apitable.organization.enums.OrganizationException.INVITE_EMAIL_NOT_EXIT;
import static com.apitable.shared.constants.AssetsPublicConstants.PUBLIC_PREFIX;
import static com.apitable.shared.constants.NotificationConstants.EXTRA_TOAST;
import static com.apitable.shared.constants.NotificationConstants.EXTRA_TOAST_URL;
import static com.apitable.shared.constants.SpaceConstants.SPACE_NAME_DEFAULT_SUFFIX;
import static com.apitable.user.enums.UserException.LINK_EMAIL_ERROR;
import static com.apitable.user.enums.UserException.MODIFY_PASSWORD_ERROR;
import static com.apitable.user.enums.UserException.MUST_BIND_EAMIL;
import static com.apitable.user.enums.UserException.MUST_BIND_MOBILE;
import static com.apitable.user.enums.UserException.REGISTER_FAIL;
import static com.apitable.user.enums.UserException.SIGN_IN_ERROR;
import static com.apitable.user.enums.UserException.USERNAME_OR_PASSWORD_ERROR;
import static com.apitable.user.enums.UserException.USER_LANGUAGE_SET_UN_SUPPORTED;
import static com.apitable.user.enums.UserException.USER_NOT_EXIST;
import static com.apitable.user.enums.UserOperationType.COMPLETE_CLOSING;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.PageUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.asset.service.IAssetService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.social.enums.SocialNameModified;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.social.model.SocialUserBind;
import com.apitable.interfaces.user.facade.UserLinkServiceFacade;
import com.apitable.interfaces.user.facade.UserServiceFacade;
import com.apitable.interfaces.user.model.RewardedUser;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.dto.MemberUserDTO;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.player.mapper.PlayerActivityMapper;
import com.apitable.player.service.IPlayerActivityService;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.bean.OpenedSheet;
import com.apitable.shared.cache.bean.UserLinkInfo;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.LoginUserCacheService;
import com.apitable.shared.cache.service.UserActiveSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceOpenedSheetCacheService;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.component.LanguageManager;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.INotificationFactory;
import com.apitable.shared.component.notification.NotificationManager;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.constants.LanguageConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.security.PasswordService;
import com.apitable.shared.sysconfig.notification.NotificationTemplate;
import com.apitable.shared.util.StringUtil;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.ro.SpaceUpdateOpRo;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceService;
import com.apitable.user.dto.UserInPausedDto;
import com.apitable.user.dto.UserLangDTO;
import com.apitable.user.dto.UserSensitiveDTO;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.entity.UserHistoryEntity;
import com.apitable.user.enums.UserClosingException;
import com.apitable.user.enums.UserOperationType;
import com.apitable.user.mapper.UserMapper;
import com.apitable.user.ro.UserOpRo;
import com.apitable.user.service.IDeveloperService;
import com.apitable.user.service.IUserHistoryService;
import com.apitable.user.service.IUserService;
import com.apitable.user.vo.UserInfoVo;
import com.apitable.user.vo.UserLinkVo;
import com.apitable.user.vo.UserSimpleVO;
import com.apitable.workspace.service.INodeShareService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.google.common.collect.Lists;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User table service implementation class.
 */
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, UserEntity>
    implements IUserService {

    private static final int USER_AVATAR_COLOR_MAX_VALUE = 10;

    private static final int USER_IS_PAUSED_CLOSE_DAY = 30;

    private static final int QUERY_LOCALE_IN_EMAILS_LIMIT = 200;

    @Resource
    private LoginUserCacheService loginUserCacheService;

    @Resource
    private LanguageManager languageManager;

    @Resource
    private IAssetService iAssetService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IPlayerActivityService iPlayerActivityService;

    @Resource
    private PlayerActivityMapper playerActivityMapper;

    @Resource
    private UserActiveSpaceCacheService userActiveSpaceCacheService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private UserSpaceOpenedSheetCacheService userSpaceOpenedSheetCacheService;

    @Resource
    private INodeShareService nodeShareService;

    @Resource
    private ISpaceInviteLinkService spaceInviteLinkService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private FindByIndexNameSessionRepository<? extends Session> sessions;

    @Resource
    private IUserHistoryService iUserHistoryService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private INotificationFactory notificationFactory;

    @Resource
    private UserServiceFacade userServiceFacade;

    @Resource
    private UserLinkServiceFacade userLinkServiceFacade;

    @Resource
    private EntitlementServiceFacade entitlementServiceFacade;

    @Resource
    private PasswordService passwordService;

    @Resource
    private IDeveloperService iDeveloperService;

    @Resource
    private ConstProperties constProperties;

    @Override
    public Long getUserIdByMobile(final String mobile) {
        return baseMapper.selectIdByMobile(mobile);
    }

    @Override
    public Long getUserIdByEmail(final String email) {
        return baseMapper.selectIdByEmail(email);
    }

    @Override
    public boolean checkByCodeAndMobile(final String code,
                                        final String mobile) {
        String areaCode = StrUtil.prependIfMissing(code, "+");
        UserEntity userEntity = baseMapper.selectByMobile(mobile);
        if (userEntity == null) {
            return false;
        }
        return StrUtil.isNotBlank(userEntity.getCode())
            && userEntity.getCode().equals(areaCode);
    }

    @Override
    public boolean checkByEmail(final String email) {
        return SqlTool.retCount(baseMapper.selectCountByEmail(email)) > 0;
    }

    @Override
    public UserEntity getByCodeAndMobilePhone(final String code,
                                              final String mobilePhone) {
        String areaCode = StrUtil.prependIfMissing(code, "+");
        UserEntity userEntity = baseMapper.selectByMobile(mobilePhone);
        if (userEntity == null) {
            return null;
        }
        if (StrUtil.isNotBlank(userEntity.getCode())
            && userEntity.getCode().equals(areaCode)) {
            return userEntity;
        }
        return null;
    }

    @Override
    public List<UserEntity> getByCodeAndMobilePhones(
        final String code, final Collection<String> mobilePhones) {
        List<UserEntity> userEntities =
            baseMapper.selectByMobilePhoneIn(mobilePhones);
        if (userEntities.isEmpty()) {
            return userEntities;
        }
        String finalCode = StrUtil.prependIfMissing(code, "+");
        return userEntities.stream()
            .filter(user -> StrUtil.isNotBlank(user.getCode())
                && user.getCode().equals(finalCode))
            .collect(Collectors.toList());
    }

    @Override
    public UserEntity getByEmail(final String email) {
        return baseMapper.selectByEmail(email);
    }

    @Override
    public List<UserEntity> getByEmails(final Collection<String> emails) {
        return baseMapper.selectByEmails(emails);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createByExternalSystem(
        final String externalId,
        final String nickName,
        final String avatar,
        final String email,
        final String remark
    ) {
        if (StrUtil.isNotBlank(email)) {
            // Query whether the existing mail exists
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
                socialServiceFacade.createSocialUser(
                    new SocialUserBind(selectUser.getId(), externalId));
                return selectUser.getId();
            }
        }
        log.info("Create Account");
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        String name = StrUtil.isNotBlank(nickName) ? nickName
            : StringUtils.substringBefore(email, "@");
        user.setNickName(name);
        user.setAvatar(StrUtil.isNotBlank(avatar) ? avatar : null);
        Integer color = StrUtil.isNotBlank(avatar) ? null
            : RandomUtil.randomInt(0, USER_AVATAR_COLOR_MAX_VALUE);
        user.setColor(color);
        user.setEmail(email);
        user.setLastLoginTime(LocalDateTime.now());
        user.setRemark(remark);
        boolean flag = saveUser(user);
        if (!flag) {
            throw new BusinessException(SIGN_IN_ERROR);
        }
        if (StrUtil.isNotBlank(email)) {
            // If the mail has been invited
            // and has not been bound to other accounts,
            // activate the space members of the invited mail
            List<MemberDTO> inactiveMembers =
                iMemberService.getInactiveMemberByEmail(email);
            inactiveMemberProcess(user.getId(), inactiveMembers);
        } else {
            String spaceName = user.getNickName();
            if (LocaleContextHolder.getLocale()
                .equals(LanguageManager.me().getDefaultLanguage())) {
                spaceName += SPACE_NAME_DEFAULT_SUFFIX;
            }
            iSpaceService.createSpace(user, spaceName);
        }
        // Create user activity record
        iPlayerActivityService.createUserActivityRecord(user.getId());
        // Create personal invitation code
        userServiceFacade.createInvitationCode(user.getId());
        // Create Associated User
        socialServiceFacade.createSocialUser(
            new SocialUserBind(user.getId(), externalId));
        return user.getId();
    }

    @Override
    public boolean saveUser(final UserEntity user) {
        boolean flag = save(user);
        TaskManager.me().execute(() -> {
            // jump to third site
            NotificationTemplate template =
                notificationFactory.getTemplateById(NotificationTemplateId
                    .NEW_USER_WELCOME_NOTIFY.getValue());
            Dict extras = Dict.create();
            if (StrUtil.isNotBlank(template.getRedirectUrl())) {
                Dict toast = Dict.create();
                toast.put(EXTRA_TOAST_URL, template.getUrl());
                toast.put("onClose",
                    ListUtil.toList("mark_cur_notice_to_read()"));
                toast.put("onBtnClick",
                    ListUtil.toList("window_open_url()"));
                toast.put("duration", 0);
                toast.put("closable", true);
                extras.put(EXTRA_TOAST, toast);
            }
            NotificationManager.me()
                .playerNotify(NotificationTemplateId.NEW_USER_WELCOME_NOTIFY,
                    Collections.singletonList(user.getId()), 0L, null, extras);
        });
        return flag;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(
        final String areaCode,
        final String mobile,
        final String nickName,
        final String avatar,
        final String email,
        final String spaceName
    ) {
        Integer color = nullToDefaultAvatar(avatar) != null ? null
            : RandomUtil.randomInt(0, USER_AVATAR_COLOR_MAX_VALUE);
        String name = nullToDefaultNickName(nickName, mobile != null
            ? mobile : StringUtils.substringBefore(email, "@"));
        // Create user with mobile number
        UserEntity entity = UserEntity.builder()
            .uuid(IdUtil.fastSimpleUUID())
            .code(areaCode)
            .mobilePhone(mobile)
            .nickName(name)
            .avatar(nullToDefaultAvatar(avatar))
            .locale(languageManager.getDefaultLanguageTag())
            .color(color)
            .email(email)
            .lastLoginTime(LocalDateTime.now())
            .build();
        boolean flag = saveUser(entity);
        ExceptionUtil.isTrue(flag, REGISTER_FAIL);
        boolean hasSpace = false;
        if (email != null) {
            // If the mailbox has been invited
            // and has not been bound to other accounts,
            // activate the space members of the invited mailbox
            List<MemberDTO> inactiveMembers =
                iMemberService.getInactiveMemberByEmail(email);
            hasSpace = this.inactiveMemberProcess(entity.getId(),
                inactiveMembers);
        }
        // Activate imported members
        if (mobile != null) {
            int count =
                memberMapper.updateUserIdByMobile(entity.getId(), mobile);
            hasSpace = hasSpace || count > 0;
        }
        // No space to create a space automatically
        if (!hasSpace) {
            String newSpaceName;
            if (StrUtil.isNotBlank(spaceName)) {
                newSpaceName = spaceName;
            } else {
                newSpaceName = entity.getNickName();
                if (LocaleContextHolder.getLocale()
                    .equals(LanguageManager.me().getDefaultLanguage())) {
                    newSpaceName += SPACE_NAME_DEFAULT_SUFFIX;
                }
            }
            iSpaceService.createSpace(entity, newSpaceName);
        }
        // Create user activity record
        iPlayerActivityService.createUserActivityRecord(entity.getId());
        // Create personal invitation code
        userServiceFacade.createInvitationCode(entity.getId());
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserByMobilePhone(
        final String areaCode,
        final String mobile,
        final String nickName,
        final String avatar
    ) {
        Integer color = nullToDefaultAvatar(avatar) != null ? null
            : RandomUtil.randomInt(0, USER_AVATAR_COLOR_MAX_VALUE);
        UserEntity entity = UserEntity.builder()
            .uuid(IdUtil.fastSimpleUUID())
            .code(areaCode)
            .mobilePhone(mobile)
            .nickName(nullToDefaultNickName(nickName, mobile))
            .locale(languageManager.getDefaultLanguageTag())
            .avatar(nullToDefaultAvatar(avatar))
            .color(color)
            .lastLoginTime(LocalDateTime.now())
            .build();
        boolean flag = saveUser(entity);
        ExceptionUtil.isTrue(flag, REGISTER_FAIL);
        // Create user activity record
        iPlayerActivityService.createUserActivityRecord(entity.getId());
        // Create personal invitation code
        userServiceFacade.createInvitationCode(entity.getId());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserByEmail(final String email) {
        return this.createUserByEmail(email, null);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserByEmail(final String email, final String password) {
        return createUserByEmail(email, password, languageManager.getDefaultLanguageTag());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserByEmail(final String email, final String password, String lang) {
        UserEntity entity = UserEntity.builder()
            .uuid(IdUtil.fastSimpleUUID())
            .email(email)
            .nickName(StringUtils.substringBefore(email, "@"))
            .locale(lang)
            .color(RandomUtil.randomInt(0, USER_AVATAR_COLOR_MAX_VALUE))
            .lastLoginTime(LocalDateTime.now())
            .build();
        if (password != null) {
            entity.setPassword(passwordService.encode(password));
        }
        boolean flag = saveUser(entity);
        ExceptionUtil.isTrue(flag, REGISTER_FAIL);
        // Create user activity record
        iPlayerActivityService.createUserActivityRecord(entity.getId());
        // Create personal invitation code
        userServiceFacade.createInvitationCode(entity.getId());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void initialDefaultSpaceForUser(final UserEntity user) {
        // initial default space for new come user
        String spaceName = user.getNickName();
        if (LocaleContextHolder.getLocale()
            .equals(LanguageManager.me().getDefaultLanguage())) {
            spaceName += SPACE_NAME_DEFAULT_SUFFIX;
        }
        iSpaceService.createSpace(user, spaceName);
    }

    @Override
    public boolean checkUserHasBindEmail(final Long userId) {
        log.info("Query whether users bind email");
        UserEntity user = getById(userId);
        ExceptionUtil.isNotNull(user, USER_NOT_EXIST);
        return user.getEmail() != null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void bindMemberByEmail(final Long userId, final String spaceId,
                                  final String email) {
        log.info("Bind member email");
        // Determine whether the email is unbound and invited
        MemberEntity member =
            iMemberService.getBySpaceIdAndEmail(spaceId, email);
        ExceptionUtil.isNotNull(member, INVITE_EMAIL_NOT_EXIT);
        ExceptionUtil.isNull(member.getUserId(), INVITE_EMAIL_HAS_LINK);

        // Judge whether the requesting user's mailbox is bound
        // to another email, and the user's email must be empty
        String userEmail = baseMapper.selectEmailById(userId);
        ExceptionUtil.isBlank(userEmail, LINK_EMAIL_ERROR);
        // Bind as user email, and the email
        // will be activated by invited space members together
        updateEmailByUserId(userId, email, null);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateEmailByUserId(final Long userId, final String email, final String oldEmail) {
        log.info("Modify User [{}] email [{}]", userId, email);
        UserEntity updateUser = new UserEntity();
        updateUser.setId(userId);
        updateUser.setEmail(email);
        boolean flag = updateById(updateUser);
        ExceptionUtil.isTrue(flag, LINK_EMAIL_ERROR);
        // Synchronize member information email
        iMemberService.updateEmailByUserId(userId, email);
        // If the email has been invited
        // and has not been bound to other accounts,
        // activate the space members of the invited email
        List<MemberDTO> inactiveMembers =
            iMemberService.getInactiveMemberByEmail(email);
        this.inactiveMemberProcess(userId, inactiveMembers);
        // Delete Cache
        loginUserCacheService.delete(userId);
        userServiceFacade.onUserChangeEmailAction(userId, email, oldEmail);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void unbindEmailByUserId(final Long userId) {
        // The user needs to bind at least
        // one contact (mobile phone number, email) to unbind the email
        LoginUserDto userDto = loginUserCacheService.getLoginUser(userId);
        ExceptionUtil.isNotBlank(userDto.getMobile(), MUST_BIND_MOBILE);
        boolean flag =
            SqlHelper.retBool(baseMapper.resetEmailByUserId(userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // Synchronize unbound member information email
        iMemberService.resetEmailByUserId(userId);
        // Delete Cache
        loginUserCacheService.delete(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateMobileByUserId(final Long userId, final String code,
                                     final String mobile) {
        UserEntity updateUser = new UserEntity();
        updateUser.setId(userId);
        updateUser.setCode(code);
        updateUser.setMobilePhone(mobile);
        boolean flag = updateById(updateUser);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // Synchronize the mobile number of member information
        iMemberService.updateMobileByUserId(userId, mobile);
        // If the mobile phone number has been invited
        // and no other account has been bound,
        // activate the invited space member
        List<MemberDTO> inactiveMembers =
            iMemberService.getInactiveMemberDtoByMobile(mobile);
        this.inactiveMemberProcess(userId, inactiveMembers);

        // Delete Cache
        loginUserCacheService.delete(userId);
        // Email registration is bound to mobile phones for the first time,
        // and additional invitation rewards are given
        LoginUserDto userDto = loginUserCacheService.getLoginUser(userId);
        if (userDto.getMobile() == null) {
            TaskManager.me().execute(
                () -> userServiceFacade.rewardUserInfoUpdateAction(
                    new RewardedUser(userId, userDto.getNickName())));
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void unbindMobileByUserId(final Long userId) {
        // The user needs to bind at least one contact (phone number, email)
        // to unbind the mobile phone number
        LoginUserDto userDto = loginUserCacheService.getLoginUser(userId);
        ExceptionUtil.isNotBlank(userDto.getEmail(), MUST_BIND_EAMIL);
        boolean flag =
            SqlHelper.retBool(baseMapper.resetMobileByUserId(userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // Synchronize the mobile phone number of unbinding member information
        iMemberService.resetMobileByUserId(userId);
        // Delete Cache
        loginUserCacheService.delete(userId);
    }

    @Override
    public void updateLoginTime(final Long userId) {
        // Update the last login time
        UserEntity update = new UserEntity();
        update.setId(userId);
        update.setLastLoginTime(ClockManager.me().getLocalDateTimeNow());
        boolean flag = updateById(update);
        ExceptionUtil.isTrue(flag, SIGN_IN_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(final Long userId, final UserOpRo param) {
        log.info("Edit user information");
        UserEntity userEntity = getById(userId);
        ExceptionUtil.isNotNull(userEntity, USER_NOT_EXIST);
        UserEntity user = UserEntity.builder().id(userId).build();
        String waitDeleteOldAvatar = null;
        if (StrUtil.isNotBlank(param.getAvatar())) {
            waitDeleteOldAvatar = userEntity.getAvatar();
            userMapper.updateUserAvatarInfo(userId, param.getAvatar(), null);
            userServiceFacade.onUserChangeAvatarAction(userId,
                StringUtil.trimSlash(constProperties.getOssBucketByAsset().getResourceUrl())
                    + param.getAvatar());
        }
        if (ObjectUtil.isNotNull(param.getAvatarColor())) {
            userMapper.updateUserAvatarInfo(userId, null,
                param.getAvatarColor());
        }
        if (StrUtil.isNotBlank(param.getTimeZone())) {
            user.setTimeZone(param.getTimeZone());
        }
        if (StrUtil.isNotBlank(param.getLocale())) {
            ExceptionUtil.isTrue(
                LanguageConstants.isLanguagesSupported(param.getLocale()),
                USER_LANGUAGE_SET_UN_SUPPORTED);
            user.setLocale(param.getLocale());
        }
        if (StrUtil.isNotBlank(param.getNickName())) {
            // Initialize the nickname.
            // If there is a space "space of *** planet residents" registered
            // and automatically created, synchronously modify the space name
            if (BooleanUtil.isTrue(param.getInit())) {
                String spaceId =
                    spaceMapper.selectSpaceIdByUserIdAndName(userId,
                        userEntity.getNickName());
                if (StrUtil.isNotBlank(spaceId)) {
                    String spaceName = param.getNickName();
                    if (LocaleContextHolder.getLocale()
                        .equals(LanguageManager.me().getDefaultLanguage())) {
                        spaceName += SPACE_NAME_DEFAULT_SUFFIX;
                    }
                    iSpaceService.updateSpace(userId, spaceId,
                        SpaceUpdateOpRo.builder().name(spaceName).build());
                }
            }
            // Synchronize personal nickname to
            // member name that has not been modifie
            iMemberService.updateMemberNameByUserId(userId,
                param.getNickName());
            // Synchronously modify member 'Social Name Modified' field status
            memberMapper.updateSocialNameModifiedByUserId(userId);
            // Delete the space cache with modified member names
            TaskManager.me().execute(() -> {
                List<String> spaceIds =
                    iMemberService.getSpaceIdWithoutNameModifiedByUserId(
                        userId);
                for (String spcId : spaceIds) {
                    userSpaceCacheService.delete(userId, spcId);
                }
            });
            user.setNickName(param.getNickName())
                .setIsSocialNameModified(SocialNameModified.YES.getValue());
            userServiceFacade.onUserChangeNicknameAction(userId,
                param.getNickName(), param.getInit());
        } else {
            user.setNickName(userEntity.getNickName());
        }
        boolean flag = updateById(user);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // Delete Cache
        loginUserCacheService.delete(userId);
        if (StrUtil.isNotBlank(waitDeleteOldAvatar)
            && StrUtil.startWith(waitDeleteOldAvatar, PUBLIC_PREFIX)) {
            // Delete original cloud files
            iAssetService.delete(waitDeleteOldAvatar);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePwd(final Long id, final String password) {
        log.info("Change Password");
        UserEntity user = UserEntity.builder()
            .id(id)
            .password(passwordService.encode(password))
            .build();

        // Delete Cache
        loginUserCacheService.delete(id);
        boolean flag = updateById(user);
        ExceptionUtil.isTrue(flag, MODIFY_PASSWORD_ERROR);
    }

    @Override
    public UserInfoVo getCurrentUserInfo(final Long userId,
                                         final String spaceId, final Boolean filter) {
        log.info("Get user information and space content");
        // Query the user's basic information
        // Whether the invitation code has been used for rewards
        boolean usedInviteReward =
            userServiceFacade.getInvitationReward(userId);
        UserInfoVo userInfo = UserInfoVo.builder()
            .sendSubscriptionNotify(true)
            .usedInviteReward(usedInviteReward)
            .build();
        LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
        userInfo.transferDataFromLoginUserDto(loginUserDto);
        UserLinkInfo userLinkInfo =
            userLinkServiceFacade.getUserLinkInfo(userId);
        if (userLinkInfo != null) {
            // Copy third-party account associated information
            List<UserLinkVo> userLinkVos =
                new ArrayList<>(userLinkInfo.getAccountLinkList().size());
            for (int i = 0; i < userLinkInfo.getAccountLinkList().size(); i++) {
                UserLinkVo linkVo = new UserLinkVo();
                BeanUtil.copyProperties(
                    userLinkInfo.getAccountLinkList().get(i), linkVo);
                userLinkVos.add(linkVo);
            }
            userInfo.transferDataFromDto(userLinkInfo, userLinkVos);
        } else {
            userInfo.setApiKey(iDeveloperService.getApiKeyByUserId(userId));
            String actions = playerActivityMapper.selectActionsByUserId(userId);
            userInfo.setWizards(JSONUtil.parseObj(actions));
        }
        // Cancel the account during the calm period,
        // and calculate the official cancellation time
        if (userInfo.getIsPaused()) {
            UserHistoryEntity userHistory =
                iUserHistoryService.getLatestUserHistoryEntity(userId,
                    UserOperationType.APPLY_FOR_CLOSING);
            ExceptionUtil.isNotNull(userHistory,
                UserClosingException.USER_HISTORY_RECORD_ISSUE);
            userInfo.setCloseAt(userHistory.getCreatedAt()
                .plusDays(USER_IS_PAUSED_CLOSE_DAY)
                .withHour(0)
                .withMinute(0)
                .withSecond(0));
        }

        boolean noSpace = StrUtil.isBlank(spaceId);
        String spcId = spaceId;
        // Selectively filter spatial related information
        if (BooleanUtil.isTrue(filter)) {
            if (noSpace) {
                return userInfo;
            }
            Long memberId =
                iMemberService.getMemberIdByUserIdAndSpaceId(userId, spcId);
            if (ObjectUtil.isNull(memberId)) {
                return userInfo;
            }
        } else if (noSpace) {
            // When the space ID is not transferred,
            // obtain the space ID of the user's recent work
            String activeSpaceId =
                userActiveSpaceCacheService.getLastActiveSpace(userId);
            if (StrUtil.isBlank(activeSpaceId)) {
                return userInfo;
            }
            spcId = activeSpaceId;
        } else {
            // Prevent access to not join spaces
            userSpaceCacheService.getMemberId(userId, spcId);
        }
        userInfo.setNeedCreate(false);
        // Cache session
        UserSpaceDto userSpace =
            userSpaceCacheService.getUserSpace(userId, spcId);
        userInfo.setSpaceId(userSpace.getSpaceId());
        userInfo.setSpaceName(userSpace.getSpaceName());
        userInfo.setSpaceLogo(userSpace.getSpaceLogo());
        userInfo.setMemberId(userSpace.getMemberId());
        userInfo.setMemberName(userSpace.getMemberName());
        userInfo.setUnitId(userSpace.getUnitId());
        userInfo.setIsAdmin(userSpace.isAdmin() || userSpace.isMainAdmin());
        userInfo.setIsMainAdmin(userSpace.isMainAdmin());
        userInfo.setIsDelSpace(userSpace.isDel());
        userInfo.setIsNewComer(
            !iMemberService.checkUserHasModifyNameInSpace(userId));
        userInfo.setIsMemberNameModified(userSpace.getIsMemberNameModified());

        // Get the last opened data table information
        OpenedSheet openedSheet =
            userSpaceOpenedSheetCacheService.getOpenedSheet(userId, spcId);
        if (ObjectUtil.isNotNull(openedSheet)
            && ObjectUtil.isNotNull(openedSheet.getNodeId())) {
            userInfo.setActiveNodeId(openedSheet.getNodeId());
            userInfo.setActiveViewId(openedSheet.getViewId());
            userInfo.setActiveNodePos(openedSheet.getPosition());
        }

        return userInfo;
    }

    @Override
    public void closeMultiSession(final Long userId, final boolean isRetain) {
        Collection<? extends Session> usersSessions =
            this.sessions.findByPrincipalName(userId.toString()).values();
        if (CollUtil.isNotEmpty(usersSessions)) {
            List<String> idList = usersSessions.stream()
                .map(Session::getId).collect(Collectors.toList());
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
    public String getUuidByUserId(final Long userId) {
        return baseMapper.selectUuidById(userId);
    }

    @Override
    public String getNicknameByUserId(final Long userId) {
        return baseMapper.selectNickNameById(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void applyForClosingAccount(final UserEntity user) {
        // Update the user logoff cool down period status to Yes
        updateIsPaused(user.getId(), true);
        // Add User Operation Record
        iUserHistoryService.create(user, UserOperationType.APPLY_FOR_CLOSING);
        // Logically delete user share
        nodeShareService.disableNodeSharesByUserId(user.getId());
        // Delete user Login Dto cache
        loginUserCacheService.delete(user.getId());
        userActiveSpaceCacheService.delete(user.getId());
        // Logical deletion of space invite link
        List<MemberEntity> members = iMemberService.getByUserId(user.getId());
        if (members.isEmpty()) {
            return;
        }
        List<Long> memberIds = members.stream()
            .map(MemberEntity::getId).collect(Collectors.toList());
        spaceInviteLinkService.deleteByMemberIds(memberIds);
        // Logical delete member information
        iMemberService.preDelByMemberIds(memberIds);

        // notify the main admin about
        // this member is going to close his account.
        List<String> spaceIds = members.stream()
            .map(MemberEntity::getSpaceId).collect(Collectors.toList());
        List<SpaceEntity> spaces = iSpaceService.getBySpaceIds(spaceIds);
        if (spaces.isEmpty()) {
            return;
        }
        TaskManager.me().execute(() -> this.sendClosingAccountNotify(user, spaces, members));
    }

    private void sendClosingAccountNotify(UserEntity user,
                                          List<SpaceEntity> spaces, List<MemberEntity> members) {
        Map<String, String> spaceIdToMemberNameMap = members.stream()
            .collect(Collectors.toMap(MemberEntity::getSpaceId, MemberEntity::getMemberName));
        for (SpaceEntity space : spaces) {
            NotificationManager.me().playerNotify(
                NotificationTemplateId.MEMBER_APPLIED_TO_CLOSE_ACCOUNT,
                Lists.newArrayList(space.getOwner()),
                user.getId(),
                space.getSpaceId(),
                Dict.create().set("nickName", user.getNickName())
                    .set("MEMBER_NAME", spaceIdToMemberNameMap.get(space.getSpaceId()))
            );
        }
    }

    private void updateIsPaused(final Long userId, final boolean isPaused) {
        UserEntity userPaused = UserEntity.builder()
            .id(userId).isPaused(isPaused).build();
        baseMapper.updateById(userPaused);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelClosingAccount(final UserEntity user) {
        // Update the user to log off the cool down period status to No
        updateIsPaused(user.getId(), false);
        // Get the member information that has not been logically deleted
        // and the exceptions caused by compatible address book synchronization
        List<MemberEntity> unexpectedMembers =
            iMemberService.getByUserId(user.getId());
        List<Long> unexpectedMemberIds = unexpectedMembers.stream()
            .map(MemberEntity::getId).collect(Collectors.toList());
        // Logical deletion of abnormal member information
        if (!unexpectedMemberIds.isEmpty()) {
            memberMapper.deleteBatchByIds(unexpectedMemberIds);
        }
        // Restore member information
        iMemberService.cancelPreDelByUserId(user.getId());
        // Delete user Login Dto cache
        loginUserCacheService.delete(user.getId());
        userActiveSpaceCacheService.delete(user.getId());
        // Add User Operation Record
        UserHistoryEntity userHistory = UserHistoryEntity.builder()
            .userId(user.getId())
            .userStatus(UserOperationType.CANCEL_CLOSING.getStatusCode())
            .uuid(user.getUuid())
            .build();
        iUserHistoryService.create(userHistory);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void closeAccount(final UserEntity user) {
        // Clear the user's nickname, area code,
        // mobile phone and email information
        userMapper.resetUserById(user.getId());
        // cancel subscription if exists
        List<String> spaceIds = iMemberService.getSpaceIdByUserIdIgnoreDeleted(user.getId());
        spaceIds.forEach(spaceId -> {
            long count = iMemberService.getTotalActiveMemberCountBySpaceId(spaceId);
            if (count == 0) {
                log.info("Cancel subscription for space [{}]", spaceId);
                // only one member left, cancel subscription
                entitlementServiceFacade.cancelSubscription(spaceId);
            }
        });
        // Clear the user's information in the member table
        memberMapper.clearMemberInfoByUserId(user.getId());
        // Physically delete
        // the user's third-party association binding information
        socialServiceFacade.deleteUser(user.getId());
        // Write the "Logout Completed" record to the history table.
        // 0 represents the system user
        UserHistoryEntity userHistory = UserHistoryEntity.builder()
            .userId(user.getId())
            .uuid(user.getUuid())
            .userStatus(COMPLETE_CLOSING.getStatusCode())
            .createdBy(user.getId())
            .updatedBy(user.getId())
            .build();
        iUserHistoryService.create(userHistory);
        userServiceFacade.onUserCloseAccount(user.getId());
    }

    @Override
    public List<UserInPausedDto> getPausedUserDtos(final List<Long> userIds) {
        return userMapper.selectPausedUsers(userIds);
    }

    private boolean inactiveMemberProcess(final Long userId,
                                          final List<MemberDTO> inactiveMembers) {
        if (CollUtil.isEmpty(inactiveMembers)) {
            return false;
        }
        List<Long> activateMember = new ArrayList<>();
        List<Long> delMember = new ArrayList<>();
        // Get the ID of all spaces of the user
        List<String> spaceIds = iMemberService.getSpaceIdByUserId(userId);
        inactiveMembers.forEach(member -> {
            if (spaceIds.contains(member.getSpaceId())) {
                // An inactive member already exists in the user space.
                // Delete the inactive member
                delMember.add(member.getId());
            } else {
                activateMember.add(member.getId());
            }
        });
        if (CollUtil.isNotEmpty(activateMember)) {
            // Activate members of the invited space
            // and synchronize user information
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
        // Delete duplicate inactive members of the same space
        if (CollUtil.isNotEmpty(delMember)) {
            iMemberService.removeByMemberIds(delMember);
        }
        return true;
    }

    @Override
    public List<UserLangDTO> getLangByEmails(final String expectedLang,
                                             final List<String> emails) {
        // Maybe have performance problems, the segmented query is used.
        List<UserLangDTO> userLangs = new ArrayList<>(emails.size());
        int page =
            PageUtil.totalPage(emails.size(), QUERY_LOCALE_IN_EMAILS_LIMIT);
        for (int i = 0; i < page; i++) {
            List<String> subEmails =
                CollUtil.page(i, QUERY_LOCALE_IN_EMAILS_LIMIT, emails);
            userLangs.addAll(
                userMapper.selectLocaleInEmailsWithDefaultLocale(expectedLang,
                    subEmails));
        }
        // Add an email that is not in the database
        if (userLangs.size() != emails.size()) {
            // Generally, they will not enter this judgment
            List<String> existEmails = userLangs.stream()
                .map(UserLangDTO::getEmail).collect(Collectors.toList());
            List<String> nonExistEmails =
                CollUtil.subtractToList(emails, existEmails);
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
    public String getLangByEmail(
        final String expectedLang, final String email) {
        UserLangDTO userLangDTO =
            userMapper.selectLocaleByEmailWithDefaultLocale(expectedLang,
                email);
        if (ObjectUtil.isNotNull(userLangDTO)) {
            return userLangDTO.getLocale();
        }
        return expectedLang;
    }

    @Override
    public List<UserLangDTO> getLangAndEmailByIds(
        final List<Long> userIds, final String defaultLocale) {
        List<UserLangDTO> dtos = userMapper.selectLocaleAndEmailByIds(userIds);
        return dtos.stream().peek(v -> {
            if (StrUtil.isBlank(v.getLocale())) {
                v.setLocale(defaultLocale);
            }
            if (StrUtil.isBlank(v.getTimeZone())) {
                v.setTimeZone(ClockManager.me().getDefaultTimeZone().toString());
            }
        }).collect(Collectors.toList());
    }

    @Override
    public Long getUserIdByUuidWithCheck(final String uuid) {
        Long userId = userMapper.selectIdByUuid(uuid);
        ExceptionUtil.isNotNull(userId, USER_NOT_EXIST);
        return userId;
    }

    private String nullToDefaultNickName(
        final String nickName, final String mobileOrEmailPrefix
    ) {
        return StrUtil.blankToDefault(nickName, mobileOrEmailPrefix);
    }

    private String nullToDefaultAvatar(final String avatar) {
        return StrUtil.blankToDefault(avatar, null);
    }

    /**
     * Query users by username. User's name can be email or area code+mobile phone number
     *
     * @param areaCode Area code
     * @param username User name
     * @return UserEntity
     */
    @Override
    public UserEntity getByUsername(
        final String areaCode, final String username
    ) {
        if (Validator.isEmail(username)) {
            // Judge whether it exists
            UserEntity user = this.getByEmail(username);
            ExceptionUtil.isNotNull(user, USERNAME_OR_PASSWORD_ERROR);
            return user;
        } else if (StrUtil.isNotBlank(areaCode)) {
            ExceptionUtil.isTrue(Validator.isNumber(username),
                USERNAME_OR_PASSWORD_ERROR);
            // Judge whether it exists
            UserEntity user = this.getByCodeAndMobilePhone(areaCode, username);
            ExceptionUtil.isNotNull(user, USERNAME_OR_PASSWORD_ERROR);
            return user;
        } else {
            // User name format error
            throw new BusinessException(USERNAME_OR_PASSWORD_ERROR);
        }
    }

    /**
     * get user's email by user id.
     *
     * @param userId user id
     * @return user's email
     */
    @Override
    public String getEmailByUserId(final Long userId) {
        return userMapper.selectEmailById(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void closePausedUser(int limitDays) {
        LocalDateTime endAt =
            ClockManager.me().getLocalDateTimeNow().minusDays(limitDays);
        LocalDateTime startAt =
            endAt.minusDays(limitDays * 2L);
        // After obtaining the specified cooling-off period, there has been an operation to
        // cancel the application within 30 days before.
        List<Long> userIds = iUserHistoryService
            .getUserIdsByCreatedAtAndUserOperationType(startAt, endAt,
                UserOperationType.APPLY_FOR_CLOSING);
        log.info("Number of accounts with cooling-off:{}:{}:{}", startAt, endAt, userIds.size());
        userIds.forEach(userId -> {
            try {
                UserEntity user = baseMapper.selectById(userId);
                if (null != user && user.getIsPaused()) {
                    closeAccount(user);
                    log.info("ClosedUserAccount:{}", user.getId());
                }
            } catch (Exception e) {
                log.error("CloseUserError:{}", userId, e);
            }
        });
    }

    @Override
    public List<UserSensitiveDTO> getUserSensitiveInfoByIds(List<Long> userIds) {
        return baseMapper.selectEmailAndMobilePhoneByIds(userIds);
    }

    @Override
    public Map<Long, UserSimpleVO> getUserSimpleInfoMap(String spaceId, List<Long> userIds) {
        if (userIds.isEmpty()) {
            return new HashMap<>();
        }
        UserMapper userMapper = SpringContextHolder.getBean(UserMapper.class);
        Map<Long, String> members =
            memberMapper.selectMemberNameByUserIdsAndSpaceIds(spaceId, userIds).stream().collect(
                Collectors.toMap(MemberUserDTO::getUserId, MemberUserDTO::getMemberName));
        return userMapper.selectByIds(userIds).stream().collect(
            Collectors.toMap(UserEntity::getId, i -> {
                String memberName = StrUtil.isBlank(members.get(i.getId())) ? i.getNickName() :
                    members.get(i.getId());
                UserSimpleVO vo = new UserSimpleVO();
                vo.setUuid(i.getUuid());
                vo.setNickName(memberName);
                vo.setAvatar(i.getAvatar());
                return vo;
            }));
    }

    @Override
    public List<UserEntity> getByIds(List<Long> userIds) {
        return baseMapper.selectByIds(userIds);
    }
}
