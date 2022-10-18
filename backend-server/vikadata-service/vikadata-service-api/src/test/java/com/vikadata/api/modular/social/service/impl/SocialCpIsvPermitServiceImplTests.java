package com.vikadata.api.modular.social.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import me.chanjar.weixin.common.error.WxErrorException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.vikadata.api.AbstractIsvTest;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitDelayService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitOrderAccountService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitOrderService;
import com.vikadata.api.modular.social.service.IsocialWecomPermitOrderAccountBindService;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialWecomPermitOrderAccountEntity;
import com.vikadata.entity.SocialWecomPermitOrderEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvPermitServiceImpl;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.model.WxCpIsvPermitBatchActiveAccountRequest;
import com.vikadata.social.wecom.model.WxCpIsvPermitBatchGetActiveInfo;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateNewOrder;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateRenewOrderRequest;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateRenewOrderResponse;
import com.vikadata.social.wecom.model.WxCpIsvPermitGetOrder;
import com.vikadata.social.wecom.model.WxCpIsvPermitListOrderAccount;
import com.vikadata.social.wecom.model.WxCpIsvPermitSubmitRenewOrder;

import org.springframework.web.client.RestTemplate;

import static org.mockito.Mockito.lenient;

/**
 * <p>
 * 企微服务商接口许可
 * </p>
 * @author 刘斌华
 * @date 2022-07-06 11:29:49
 */
class SocialCpIsvPermitServiceImplTests extends AbstractIsvTest {

    @Resource
    private IBundleService realBundleService;

    @Resource
    private ISocialCpIsvPermitService realSocialCpIsvPermitService;

    @Resource
    private ISocialWecomPermitOrderService realSocialWecomPermitOrderService;

    @Resource
    private ISocialWecomPermitOrderAccountService realSocialWecomPermitOrderAccountService;

    @Resource
    private ISocialTenantService realSocialTenantService;

    @InjectMocks
    private SocialCpIsvPermitServiceImpl socialCpIsvPermitService;

    @Mock
    private WeComProperties weComProperties;

    @Mock
    private WeComTemplate weComTemplate;

    @Mock
    private IBundleService bundleService;

    @Mock
    private ISocialWecomPermitDelayService socialWecomPermitDelayService;

    @Mock
    private ISocialWecomPermitOrderService socialWecomPermitOrderService;

    @Mock
    private ISocialWecomPermitOrderAccountService socialWecomPermitOrderAccountService;

    @Mock
    private IsocialWecomPermitOrderAccountBindService socialWecomPermitOrderAccountBindService;

    @Mock
    private ISocialTenantService socialTenantService;

    @Mock
    private ISocialTenantBindService socialTenantBindService;

    @Mock
    private WxCpIsvServiceImpl wxCpIsvService;

    @Mock
    private WxCpIsvPermitServiceImpl wxCpIsvPermitService;

    @Mock
    private RestTemplate restTemplate;

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createNewOrderTest() throws Exception {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String spaceId = "testSpaceId";
        String cpUserId = "testCpUserId";
        String permitBuyerUserId = "testPermitBuyerUserId";
        String orderId = "testOrderId";

        mockGetBySpaceId(suiteId, authCorpId, spaceId);
        mockGetNeedActivateCpUserIds(cpUserId);
        mockWxCpIsvPermitService();
        mockGetIsvAppList(suiteId, permitBuyerUserId);
        mockCreateNewOrder(orderId);
        mockGetOrder(authCorpId, orderId, false);
        mockSave(suiteId, authCorpId, orderId, permitBuyerUserId, false);

        SocialWecomPermitOrderEntity orderEntity = socialCpIsvPermitService.createNewOrder(spaceId, 12);

        Assertions.assertNotNull(orderEntity);
    }

    @Test
    void activateOrderTest() throws Exception {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String spaceId = "testSpaceId";
        String activeCode = "testActiveCode";
        String orderId = "testOrderId";

        mockGetByOrderId(suiteId, authCorpId, orderId, false);
        mockWxCpIsvPermitService();
        mockGetOrder(authCorpId, orderId, true);
        mockUpdateById();
        mockGetTenantBindSpaceId(spaceId);
        mockGetCountByOrderId(0);
        mockSaveAllActiveCodes(suiteId, authCorpId, orderId, activeCode);

        socialCpIsvPermitService.activateOrder(orderId);

        List<String> activeCodes = realSocialWecomPermitOrderAccountService.getActiveCodesByOrderId(suiteId, authCorpId, orderId, null);
        Assertions.assertEquals(1, activeCodes.size());
    }

    @Test
    void renewalCpUser() throws Exception {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String spaceId = "testSpaceId";
        String cpUserId = "testCpUserId";
        String permitBuyerUserId = "testPermitBuyerUserId";
        String orderId = "testOrderId";
        String jobId = "testJobId";

        mockGetBySpaceId(suiteId, authCorpId, spaceId);
        mockWxCpIsvPermitService();
        mockCreateRenewOrder(jobId);
        mockGetIsvAppList(suiteId, permitBuyerUserId);
        mockSubmitRenewOrder(orderId);
        mockGetOrder(authCorpId, orderId, false);
        mockSave(suiteId, authCorpId, orderId, permitBuyerUserId, false);

        SocialWecomPermitOrderEntity orderEntity = socialCpIsvPermitService.renewalCpUser(spaceId, Collections.singletonList(cpUserId), 12);

        Assertions.assertNotNull(orderEntity);
    }

    @Test
    void ensureAllTest() throws Exception {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String activeCode = "testActiveCode";
        String orderId = "testOrderId";

        // 预填充数据
        WxCpIsvPermitListOrderAccount.AccountList accountList = new WxCpIsvPermitListOrderAccount.AccountList();
        accountList.setActiveCode(activeCode);
        accountList.setType(1);
        realSocialWecomPermitOrderAccountService
                .batchSaveActiveCode(suiteId, activeCode, orderId, Collections.singletonList(accountList));

        mockGetByOrderId(suiteId, authCorpId, orderId, false);
        mockWxCpIsvPermitService();
        mockGetOrder(authCorpId, orderId, true);
        mockUpdateById();
        mockGetActiveCodes(activeCode);
        mockEnsureActiveCodes(suiteId, authCorpId, activeCode);

        socialCpIsvPermitService.ensureOrderAndAllActiveCodes(orderId);

        List<String> activeCodes = realSocialWecomPermitOrderAccountService.getActiveCodesByOrderId(suiteId, authCorpId, orderId, null);
        Assertions.assertEquals(1, activeCodes.size());
    }

    @Test
    void calcNewAccountCountTest() {
        String suiteId = "suiteId";
        String authCorpId = "authCorpId";
        String spaceId = createWecomIsvTenant(suiteId, authCorpId, true);
        int newAccountCount = realSocialCpIsvPermitService.calcNewAccountCount(suiteId, authCorpId, spaceId);
        Assertions.assertEquals(0, newAccountCount);
    }

    @Test
    void ensureOrderTest() throws WxErrorException {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String orderId = "testOrderId";

        mockGetByOrderId(suiteId, authCorpId, orderId, false);
        mockWxCpIsvPermitService();
        mockGetOrder(authCorpId, orderId, true);
        mockUpdateById();

        SocialWecomPermitOrderEntity orderEntity = socialCpIsvPermitService.ensureOrder(orderId);
        Assertions.assertNotNull(orderEntity);
    }

    @Test
    void ensureAllActiveCodesTest() throws WxErrorException {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String activeCode = "testActiveCode";
        String orderId = "testOrderId";
        // 预填充数据
        WxCpIsvPermitListOrderAccount.AccountList accountList = new WxCpIsvPermitListOrderAccount.AccountList();
        accountList.setActiveCode(activeCode);
        accountList.setType(1);
        realSocialWecomPermitOrderAccountService
                .batchSaveActiveCode(suiteId, activeCode, orderId, Collections.singletonList(accountList));
        mockGetActiveCodes(activeCode);
        mockEnsureActiveCodes(suiteId, authCorpId, activeCode);
        socialCpIsvPermitService.ensureAllActiveCodes(suiteId, authCorpId);
        List<String> activeCodes = realSocialWecomPermitOrderAccountService.getActiveCodesByOrderId(suiteId, authCorpId, orderId, null);
        Assertions.assertEquals(1, activeCodes.size());
    }

    @Test
    void autoProcessPermitOrderTest() {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String spaceId = createWecomIsvTenant(suiteId, authCorpId);
        String permitBuyerUserId = "testPermitBuyerUserId";
        Bundle bundle = realGetActivatedBundleBySpaceId(spaceId);
        if (Objects.nonNull(bundle)) {
            realGetByAppIdAndTenantId(suiteId, authCorpId);
            mockGetIsvAppList(suiteId, permitBuyerUserId);
            mockAddAuthCorp();
        }
        socialCpIsvPermitService.autoProcessPermitOrder(suiteId, authCorpId, spaceId);
        List<String> activeCodes = realSocialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId, null);
        Assertions.assertEquals(0, activeCodes.size());
    }

    @Test
    void createPermitOrderTest() {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String spaceId = createWecomIsvTenant(suiteId, authCorpId, true);
        LocalDateTime expireTime = DateTimeUtil.localDateTimeFromNow(8, 15, 0, 0, 0);
        boolean result = socialCpIsvPermitService.createPermitOrder(suiteId, authCorpId, spaceId, expireTime);
        Assertions.assertFalse(result);
    }

    @Test
    void sendNewWebhookTest() {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String orderId = "testOrderId";
        String permitBuyerUserId = "testPermitBuyerUserId";
        mockGetIsvAppList(suiteId, permitBuyerUserId);
        mockPostForObject("{\"StatusCode\":0}");
        boolean result = socialCpIsvPermitService.sendNewWebhook(suiteId, authCorpId, null, orderId, null);
        Assertions.assertTrue(result);
    }

    @Test
    void sendRenewWebhookTest() {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String orderId = "testOrderId";
        String permitBuyerUserId = "testPermitBuyerUserId";
        mockGetIsvAppList(suiteId, permitBuyerUserId);
        mockPostForObject("{\"StatusCode\":0}");
        boolean result = socialCpIsvPermitService.sendRenewWebhook(suiteId, authCorpId, null, orderId);
        Assertions.assertTrue(result);
    }

    @Test
    void sendRefundWebhookTest() {
        String suiteId = "testSuiteId";
        String authCorpId = "testAuthCorpId";
        String orderId = "testOrderId";
        String permitBuyerUserId = "testPermitBuyerUserId";
        mockGetIsvAppList(suiteId, permitBuyerUserId);
        mockPostForObject("{\"StatusCode\":0}");
        boolean result = socialCpIsvPermitService.sendRefundWebhook(suiteId, authCorpId);
        Assertions.assertTrue(result);
    }

    /**
     * Mock {@link ISocialTenantBindService#getBySpaceId(String)}
     *
     * @param suiteId 预期的应用套件 ID
     * @param authCorpId 预期的授权企业 ID
     * @param spaceId 预期的空间站 ID
     * @author 刘斌华
     * @date 2022-07-18 11:06:42
     */
    private void mockGetBySpaceId(String suiteId, String authCorpId, String spaceId) {
        Mockito.when(socialTenantBindService.getBySpaceId(spaceId))
                .thenReturn(SocialTenantBindEntity.builder()
                        .appId(suiteId)
                        .tenantId(authCorpId)
                        .spaceId(spaceId)
                        .build());
    }

    /**
     * Mock {@link ISocialWecomPermitOrderAccountService#getNeedActivateCpUserIds(String, String, String)}
     *
     * @param cpUserId 预期的企微用户 ID
     * @author 刘斌华
     * @date 2022-07-18 11:08:02
     */
    private void mockGetNeedActivateCpUserIds(String cpUserId) {
        Mockito.when(socialWecomPermitOrderAccountService.getNeedActivateCpUserIds(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(Collections.singletonList(cpUserId));
    }

    /**
     * Mock 获取 {@link WxCpIsvPermitServiceImpl}
     *
     * @author 刘斌华
     * @date 2022-07-18 11:09:05
     */
    private void mockWxCpIsvPermitService() {
        Mockito.when(weComTemplate.isvService(Mockito.any()))
                .thenReturn(wxCpIsvService);
        Mockito.when(wxCpIsvService.getWxCpIsvPermitService())
                .thenReturn(wxCpIsvPermitService);
    }

    /**
     * Mock 获取企微应用信息配置
     *
     * @param suiteId 预期的应用套件 ID
     * @param permitBuyerUserId 预期的接口许可下单人的企微用户 ID
     * @author 刘斌华
     * @date 2022-07-18 11:10:02
     */
    private void mockGetIsvAppList(String suiteId, String permitBuyerUserId) {
        WeComProperties.IsvApp isvApp = new WeComProperties.IsvApp();
        isvApp.setSuiteId(suiteId);
        isvApp.setPermitBuyerUserId(permitBuyerUserId);
        isvApp.setPermitNotifyWebhookUrl("webhook url");
        isvApp.setPermitNotifyWebhookSecret("webhook secret");
        Mockito.when(weComProperties.getIsvAppList())
                .thenReturn(Collections.singletonList(isvApp));
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#createNewOrder(String, Integer, Integer, String)}
     *
     * @param orderId 预期的接口许可单号
     * @author 刘斌华
     * @date 2022-07-18 11:10:51
     */
    private void mockCreateNewOrder(String orderId) throws WxErrorException {
        WxCpIsvPermitCreateNewOrder wxCpIsvPermitCreateNewOrder = new WxCpIsvPermitCreateNewOrder();
        wxCpIsvPermitCreateNewOrder.setOrderId(orderId);
        Mockito.when(wxCpIsvPermitService.createNewOrder(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(wxCpIsvPermitCreateNewOrder);
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#getOrder(String)}
     *
     * @param authCorpId 预期的授权企业 ID
     * @param orderId 预期的接口许可单号
     * @param isPaid 预期是否已支付
     * @author 刘斌华
     * @date 2022-07-18 11:11:52
     */
    private void mockGetOrder(String authCorpId, String orderId, boolean isPaid) throws WxErrorException {
        WxCpIsvPermitGetOrder wxCpIsvPermitGetOrder = new WxCpIsvPermitGetOrder();
        WxCpIsvPermitGetOrder.Order wxCpIsvPermitGetOrderDetail = new WxCpIsvPermitGetOrder.Order();
        wxCpIsvPermitGetOrderDetail.setOrderId(orderId);
        wxCpIsvPermitGetOrderDetail.setOrderType(1);
        wxCpIsvPermitGetOrderDetail.setOrderStatus(isPaid ? 1 : 0);
        wxCpIsvPermitGetOrderDetail.setCorpId(authCorpId);
        wxCpIsvPermitGetOrderDetail.setPrice(100);
        WxCpIsvPermitGetOrder.Order.AccountCount accountCount = new WxCpIsvPermitGetOrder.Order.AccountCount();
        accountCount.setBaseCount(1);
        accountCount.setExternalContactCount(0);
        wxCpIsvPermitGetOrderDetail.setAccountCount(accountCount);
        WxCpIsvPermitGetOrder.Order.AccountDuration accountDuration = new WxCpIsvPermitGetOrder.Order.AccountDuration();
        accountDuration.setMonths(12);
        wxCpIsvPermitGetOrderDetail.setAccountDuration(accountDuration);
        wxCpIsvPermitGetOrderDetail.setCreateTime(LocalDateTime.now().toEpochSecond(ZoneOffset.ofHours(8)));
        if (isPaid) {
            wxCpIsvPermitGetOrderDetail.setPayTime(LocalDateTime.now().toEpochSecond(ZoneOffset.ofHours(8)));
        }
        wxCpIsvPermitGetOrder.setOrder(wxCpIsvPermitGetOrderDetail);

        Mockito.when(wxCpIsvPermitService.getOrder(Mockito.any()))
                .thenReturn(wxCpIsvPermitGetOrder);
    }

    /**
     * Mock {@link ISocialWecomPermitOrderService#save(Object)}
     *
     * @author 刘斌华
     * @date 2022-07-18 11:13:08
     */
    private void mockSave(String suiteId, String authCorpId, String orderId, String buyerUserId, boolean isPaid) {
        SocialWecomPermitOrderEntity socialWecomPermitOrderEntity = SocialWecomPermitOrderEntity.builder()
                .suiteId(suiteId)
                .authCorpId(authCorpId)
                .orderId(orderId)
                .orderType(1)
                .orderStatus(0)
                .price(100)
                .baseAccountCount(1)
                .externalAccountCount(0)
                .durationMonths(12)
                .createTime(DateTimeUtil.localDateTimeNow(8))
                .payTime(isPaid ? DateTimeUtil.localDateTimeNow(8) : null)
                .buyerUserId(buyerUserId)
                .build();
        Mockito.when(socialWecomPermitOrderService.save(Mockito.any()))
                .thenAnswer(invocation -> realSocialWecomPermitOrderService.save(socialWecomPermitOrderEntity));
    }

    /**
     * Mock {@link ISocialWecomPermitOrderService#getByOrderId(String)}
     *
     * @param suiteId 预期的应用套件 ID
     * @param authCorpId 预期的授权企业 ID
     * @param orderId 预期的接口许可单号
     * @param isPaid 预期订单是否已支付
     * @author 刘斌华
     * @date 2022-07-18 11:13:49
     */
    private void mockGetByOrderId(String suiteId, String authCorpId, String orderId, boolean isPaid) {
        Mockito.when(socialWecomPermitOrderService.getByOrderId(Mockito.any()))
                .thenReturn(SocialWecomPermitOrderEntity.builder()
                        .suiteId(suiteId)
                        .authCorpId(authCorpId)
                        .orderId(orderId)
                        .orderType(1)
                        .orderStatus(isPaid ? 1 : 0)
                        .price(100)
                        .baseAccountCount(1)
                        .externalAccountCount(0)
                        .durationMonths(12)
                        .createTime(DateTimeUtil.localDateTimeNow(8))
                        .payTime(isPaid ? DateTimeUtil.localDateTimeNow(8) : null)
                        .build());
    }

    /**
     * Mock {@link ISocialWecomPermitOrderService#updateById(Object)}
     *
     * @author 刘斌华
     * @date 2022-07-18 11:15:00
     */
    private void mockUpdateById() {
        Mockito.when(socialWecomPermitOrderService.updateById(Mockito.any()))
                .thenReturn(true);
    }

    /**
     * Mock {@link ISocialTenantBindService#getTenantBindSpaceId(String, String)}
     *
     * @param spaceId 预期的空间站 ID
     * @author 刘斌华
     * @date 2022-07-18 11:15:30
     */
    private void mockGetTenantBindSpaceId(String spaceId) {
        Mockito.when(socialTenantBindService.getTenantBindSpaceId(Mockito.any(), Mockito.any()))
                .thenReturn(spaceId);
    }

    /**
     * Mock {@link IsocialWecomPermitOrderAccountBindService#getCountByOrderId(String)}
     *
     * @param count 预期返回的数量
     * @author 刘斌华
     * @date 2022-07-18 11:16:30
     */
    private void mockGetCountByOrderId(int count) {
        Mockito.when(socialWecomPermitOrderAccountBindService.getCountByOrderId(Mockito.any()))
                .thenReturn(count);
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#listOrderAccount(String, Integer, String)}
     *
     * @param activeCode 预期返回的激活码
     * @author 刘斌华
     * @date 2022-07-18 11:17:13
     */
    private void mockListOrderAccount(String activeCode) throws WxErrorException {
        WxCpIsvPermitListOrderAccount wxCpIsvPermitListOrderAccount = new WxCpIsvPermitListOrderAccount();
        wxCpIsvPermitListOrderAccount.setHasMore(0);
        WxCpIsvPermitListOrderAccount.AccountList accountList = new WxCpIsvPermitListOrderAccount.AccountList();
        accountList.setActiveCode(activeCode);
        accountList.setType(1);
        wxCpIsvPermitListOrderAccount.setAccountList(Collections.singletonList(accountList));

        Mockito.when(wxCpIsvPermitService.listOrderAccount(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(wxCpIsvPermitListOrderAccount);
    }

    /**
     * Mock {@link ISocialWecomPermitOrderAccountService#getActiveCodesByOrderId(String, String, String, List)}
     *
     * @param activeCode 预期返回的激活码
     * @author 刘斌华
     * @date 2022-07-18 11:18:19
     */
    private void mockGetActiveCodesByOrderId(String activeCode) {
        Mockito.when(socialWecomPermitOrderAccountService.getActiveCodesByOrderId(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(Collections.singletonList(activeCode));
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#batchActiveAccount(WxCpIsvPermitBatchActiveAccountRequest)}
     *
     * @author 刘斌华
     * @date 2022-07-18 11:19:06
     */
    private void mockBatchActiveAccount() throws WxErrorException {
        Mockito.when(wxCpIsvPermitService.batchActiveAccount(Mockito.any()))
                .thenReturn(null);
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#batchGetActiveInfo(String, List)}
     *
     * @param activeCode 预期返回的激活码
     * @author 刘斌华
     * @date 2022-07-18 11:19:37
     */
    private void mockBatchGetActiveInfo(String activeCode) throws WxErrorException {
        WxCpIsvPermitBatchGetActiveInfo.ActiveInfoList activeInfoList = new WxCpIsvPermitBatchGetActiveInfo.ActiveInfoList();
        activeInfoList.setActiveCode(activeCode);
        activeInfoList.setType(1);
        activeInfoList.setStatus(1);
        activeInfoList.setCreateTime(LocalDateTime.now().toEpochSecond(ZoneOffset.ofHours(8)));
        WxCpIsvPermitBatchGetActiveInfo wxCpIsvPermitBatchGetActiveInfo = new WxCpIsvPermitBatchGetActiveInfo();
        wxCpIsvPermitBatchGetActiveInfo.setActiveInfoList(Collections.singletonList(activeInfoList));

        Mockito.when(wxCpIsvPermitService.batchGetActiveInfo(Mockito.any(), Mockito.any()))
                .thenReturn(wxCpIsvPermitBatchGetActiveInfo);
    }

    /**
     * Mock {@link ISocialWecomPermitOrderAccountService#getByActiveCodes(String, String, List)}
     *
     * @param suiteId 预期返回的应用套件 ID
     * @param authCorpId 预期返回的授权企业 ID
     * @param activeCode 预期返回的激活码
     * @author 刘斌华
     * @date 2022-07-18 11:20:11
     */
    private void mockGetByActiveCodes(String suiteId, String authCorpId, String activeCode) {
        Mockito.when(socialWecomPermitOrderAccountService.getByActiveCodes(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(Collections.singletonList(SocialWecomPermitOrderAccountEntity.builder()
                        .suiteId(suiteId)
                        .authCorpId(authCorpId)
                        .type(1)
                        .activateStatus(1)
                        .activeCode(activeCode)
                        .build()));
    }

    /**
     * Mock {@link ISocialWecomPermitOrderAccountService#updateBatchById(Collection)}
     *
     * @author 刘斌华
     * @date 2022-07-18 11:21:07
     */
    private void mockUpdateBatchById() {
        Mockito.when(socialWecomPermitOrderAccountService.updateBatchById(Mockito.any()))
                .thenReturn(true);
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#createRenewOrder(WxCpIsvPermitCreateRenewOrderRequest)}
     *
     * @param jobId 预期返回的 jobId
     * @author 刘斌华
     * @date 2022-07-18 11:22:00
     */
    private void mockCreateRenewOrder(String jobId) throws WxErrorException {
        WxCpIsvPermitCreateRenewOrderResponse wxCpIsvPermitCreateRenewOrderResponse = new WxCpIsvPermitCreateRenewOrderResponse();
        wxCpIsvPermitCreateRenewOrderResponse.setJobId(jobId);

        Mockito.when(wxCpIsvPermitService.createRenewOrder(Mockito.any()))
                .thenReturn(wxCpIsvPermitCreateRenewOrderResponse);
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#submitRenewOrder(String, Integer, String)}
     *
     * @param orderId 预期返回的单号
     * @author 刘斌华
     * @date 2022-07-18 11:22:39
     */
    private void mockSubmitRenewOrder(String orderId) throws WxErrorException {
        WxCpIsvPermitSubmitRenewOrder wxCpIsvPermitSubmitRenewOrder = new WxCpIsvPermitSubmitRenewOrder();
        wxCpIsvPermitSubmitRenewOrder.setOrderId(orderId);

        Mockito.when(wxCpIsvPermitService.submitRenewOrder(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(wxCpIsvPermitSubmitRenewOrder);
    }

    /**
     * Mock {@link ISocialWecomPermitOrderAccountService#getActiveCodes(String, String, List)}
     *
     * @param activeCode 预期返回的激活码
     * @author 刘斌华
     * @date 2022-07-18 11:23:16
     */
    private void mockGetActiveCodes(String activeCode) {
        Mockito.when(socialWecomPermitOrderAccountService.getActiveCodes(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(Collections.singletonList(activeCode));
    }

    /**
     * Mock {@link ISocialWecomPermitDelayService#addAuthCorp(String, String, LocalDateTime, Integer, Integer)}
     *
     * @author 刘斌华
     * @date 2022-08-15 11:44:23
     */
    private void mockAddAuthCorp() {
        lenient().when(socialWecomPermitDelayService.addAuthCorp(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(null);
    }

    /**
     * Mock {@link RestTemplate#postForObject(String, Object, Class, Object...)}
     *
     * @param response 预期的返回结果
     * @author 刘斌华
     * @date 2022-08-04 14:19:07
     */
    private void mockPostForObject(String response) {
        Mockito.when(restTemplate.postForObject((String) Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(response);
    }

    /**
     * Mock 保存激活码
     *
     * @param activeCode 预期返回的激活码
     * @author 刘斌华
     * @date 2022-07-18 11:23:58
     */
    private void mockSaveAllActiveCodes(String suite, String authCorpId, String orderId, String activeCode) throws WxErrorException {
        mockWxCpIsvPermitService();
        mockListOrderAccount(activeCode);
        realBatchSaveActiveCode(suite, authCorpId, orderId, activeCode);
    }

    /**
     * Mock 确认激活码
     *
     * @param suiteId 预期的应用套件 ID
     * @param authCorpId 预期的授权企业 ID
     * @param activeCode 预期的激活码
     * @author 刘斌华
     * @date 2022-07-18 11:24:31
     */
    private void mockEnsureActiveCodes(String suiteId, String authCorpId, String activeCode) throws WxErrorException {
        mockWxCpIsvPermitService();
        mockBatchGetActiveInfo(activeCode);
        mockGetByActiveCodes(suiteId, authCorpId, activeCode);
        mockUpdateBatchById();
    }

    /**
     * Mock 激活账号
     *
     * @param suiteId 预期的应用套件 ID
     * @param authCorpId 预期的授权企业 ID
     * @param activeCode 预期的激活码
     * @param cpUserId 预期的企微用户 ID
     * @author 刘斌华
     * @date 2022-07-18 11:25:08
     */
    private void mockActivateAccount(String suiteId, String authCorpId, String activeCode, String cpUserId) throws WxErrorException {
        mockGetNeedActivateCpUserIds(cpUserId);
        mockWxCpIsvPermitService();
        mockBatchActiveAccount();
        mockEnsureActiveCodes(suiteId, authCorpId, activeCode);
    }

    /**
     * 调用 {@link ISocialWecomPermitOrderAccountService#batchSaveActiveCode(String, String, String, List)}
     *
     * @param suiteId 预应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param orderId 订单号
     * @param activeCode 激活码
     * @author 刘斌华
     * @date 2022-07-18 11:17:44
     */
    private void realBatchSaveActiveCode(String suiteId, String authCorpId, String orderId, String activeCode) {
        WxCpIsvPermitListOrderAccount.AccountList accountList = new WxCpIsvPermitListOrderAccount.AccountList();
        accountList.setActiveCode(activeCode);
        accountList.setType(1);

        Mockito.doAnswer(invocation -> {
                    realSocialWecomPermitOrderAccountService
                            .batchSaveActiveCode(suiteId, authCorpId, orderId, Collections.singletonList(accountList));
                    return null;
                })
                .when(socialWecomPermitOrderAccountService)
                .batchSaveActiveCode(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any());
    }

    /**
     * 调用 {@link IBundleService#getActivatedBundleBySpaceId(String)}
     *
     * @param spaceId 空间站 ID
     * @author 刘斌华
     * @date 2022-08-04 14:04:51
     */
    private Bundle realGetActivatedBundleBySpaceId(String spaceId) {
        return Mockito.doAnswer(invocation -> realBundleService.getActivatedBundleBySpaceId(spaceId))
                .when(bundleService)
                .getActivatedBundleBySpaceId(spaceId);
    }

    /**
     * 调用 {@link ISocialTenantService#getByAppIdAndTenantId(String, String)}
     *
     * @param suiteId 预应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @author 刘斌华
     * @date 2022-08-04 14:04:51
     */
    private void realGetByAppIdAndTenantId(String suiteId, String authCorpId) {
        Mockito.doAnswer(invocation -> realSocialTenantService.getByAppIdAndTenantId(suiteId, authCorpId))
                .when(socialTenantService)
                .getByAppIdAndTenantId(suiteId, authCorpId);
    }

}
