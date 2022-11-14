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
import com.vikadata.api.enterprise.social.service.impl.SocialCpIsvPermitServiceImpl;
import com.vikadata.api.enterprise.billing.core.Bundle;
import com.vikadata.api.enterprise.billing.service.IBundleService;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.enterprise.social.service.ISocialWecomPermitDelayService;
import com.vikadata.api.enterprise.social.service.ISocialWecomPermitOrderAccountService;
import com.vikadata.api.enterprise.social.service.ISocialWecomPermitOrderService;
import com.vikadata.api.enterprise.social.service.IsocialWecomPermitOrderAccountBindService;
import com.apitable.starter.social.wecom.autoconfigure.WeComProperties;
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
 * WeCom Service Provider Interface License
 * </p>
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

        // Pre populated data
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
        // Pre populated data
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
     * @param suiteId Expected App Suite ID
     * @param authCorpId Expected Authorized Enterprise ID
     * @param spaceId Expected space ID
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
     * @param cpUserId Expected enterprise WeCom users ID
     */
    private void mockGetNeedActivateCpUserIds(String cpUserId) {
        Mockito.when(socialWecomPermitOrderAccountService.getNeedActivateCpUserIds(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(Collections.singletonList(cpUserId));
    }

    /**
     * Mock Get {@link WxCpIsvPermitServiceImpl}
     */
    private void mockWxCpIsvPermitService() {
        Mockito.when(weComTemplate.isvService(Mockito.any()))
                .thenReturn(wxCpIsvService);
        Mockito.when(wxCpIsvService.getWxCpIsvPermitService())
                .thenReturn(wxCpIsvPermitService);
    }

    /**
     * Mock Get enterprise WeCom application information configuration
     *
     * @param suiteId Expected App Suite ID
     * @param permitBuyerUserId The enterprise WeCom user ID of the person under the expected interface license
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
     * @param orderId Expected interface license number
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
     * @param authCorpId Expected Authorized Enterprise ID
     * @param orderId Expected interface license number
     * @param isPaid Whether it is expected to have been paid
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
     * @param suiteId Expected App Suite ID
     * @param authCorpId Expected Authorized Enterprise ID
     * @param orderId Expected interface license number
     * @param isPaid Whether the expected order has been paid
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
     */
    private void mockUpdateById() {
        Mockito.when(socialWecomPermitOrderService.updateById(Mockito.any()))
                .thenReturn(true);
    }

    /**
     * Mock {@link ISocialTenantBindService#getTenantBindSpaceId(String, String)}
     *
     * @param spaceId Expected space ID
     */
    private void mockGetTenantBindSpaceId(String spaceId) {
        Mockito.when(socialTenantBindService.getTenantBindSpaceId(Mockito.any(), Mockito.any()))
                .thenReturn(spaceId);
    }

    /**
     * Mock {@link IsocialWecomPermitOrderAccountBindService#getCountByOrderId(String)}
     *
     * @param count Expected quantity returned
     */
    private void mockGetCountByOrderId(int count) {
        Mockito.when(socialWecomPermitOrderAccountBindService.getCountByOrderId(Mockito.any()))
                .thenReturn(count);
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#listOrderAccount(String, Integer, String)}
     *
     * @param activeCode Expected return activation code
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
     * @param activeCode Expected return activation code
     */
    private void mockGetActiveCodesByOrderId(String activeCode) {
        Mockito.when(socialWecomPermitOrderAccountService.getActiveCodesByOrderId(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(Collections.singletonList(activeCode));
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#batchActiveAccount(WxCpIsvPermitBatchActiveAccountRequest)}
     */
    private void mockBatchActiveAccount() throws WxErrorException {
        Mockito.when(wxCpIsvPermitService.batchActiveAccount(Mockito.any()))
                .thenReturn(null);
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#batchGetActiveInfo(String, List)}
     *
     * @param activeCode Expected return activation code
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
     * @param suiteId Expected returned application suite ID
     * @param authCorpId Expected returned authorized enterprise ID
     * @param activeCode Expected return activation code
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
     */
    private void mockUpdateBatchById() {
        Mockito.when(socialWecomPermitOrderAccountService.updateBatchById(Mockito.any()))
                .thenReturn(true);
    }

    /**
     * Mock {@link WxCpIsvPermitServiceImpl#createRenewOrder(WxCpIsvPermitCreateRenewOrderRequest)}
     *
     * @param jobId Expected returned jobId
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
     * @param orderId Expected return order number
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
     * @param activeCode Expected return activation code
     */
    private void mockGetActiveCodes(String activeCode) {
        Mockito.when(socialWecomPermitOrderAccountService.getActiveCodes(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(Collections.singletonList(activeCode));
    }

    /**
     * Mock {@link ISocialWecomPermitDelayService#addAuthCorp(String, String, LocalDateTime, Integer, Integer)}
     */
    private void mockAddAuthCorp() {
        lenient().when(socialWecomPermitDelayService.addAuthCorp(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(null);
    }

    /**
     * Mock {@link RestTemplate#postForObject(String, Object, Class, Object...)}
     *
     * @param response Expected return results
     */
    private void mockPostForObject(String response) {
        Mockito.when(restTemplate.postForObject((String) Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(response);
    }

    /**
     * Mock Save Activation Code
     *
     * @param activeCode Expected return activation code
     */
    private void mockSaveAllActiveCodes(String suite, String authCorpId, String orderId, String activeCode) throws WxErrorException {
        mockWxCpIsvPermitService();
        mockListOrderAccount(activeCode);
        realBatchSaveActiveCode(suite, authCorpId, orderId, activeCode);
    }

    /**
     * Mock Confirm Activation Code
     *
     * @param suiteId Expected App Suite ID
     * @param authCorpId Expected Authorized Enterprise ID
     * @param activeCode Expected activation code
     */
    private void mockEnsureActiveCodes(String suiteId, String authCorpId, String activeCode) throws WxErrorException {
        mockWxCpIsvPermitService();
        mockBatchGetActiveInfo(activeCode);
        mockGetByActiveCodes(suiteId, authCorpId, activeCode);
        mockUpdateBatchById();
    }

    /**
     * Mock Activate account
     *
     * @param suiteId Expected App Suite ID
     * @param authCorpId Expected Authorized Enterprise ID
     * @param activeCode Expected activation code
     * @param cpUserId Expected enterprise user ID
     */
    private void mockActivateAccount(String suiteId, String authCorpId, String activeCode, String cpUserId) throws WxErrorException {
        mockGetNeedActivateCpUserIds(cpUserId);
        mockWxCpIsvPermitService();
        mockBatchActiveAccount();
        mockEnsureActiveCodes(suiteId, authCorpId, activeCode);
    }

    /**
     * Call {@link ISocialWecomPermitOrderAccountService#batchSaveActiveCode(String, String, String, List)}
     *
     * @param suiteId Pre application Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param orderId order ID
     * @param activeCode Activation code
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
     * Call {@link IBundleService#getActivatedBundleBySpaceId(String)}
     *
     * @param spaceId Space ID
     */
    private Bundle realGetActivatedBundleBySpaceId(String spaceId) {
        return Mockito.doAnswer(invocation -> realBundleService.getActivatedBundleBySpaceId(spaceId))
                .when(bundleService)
                .getActivatedBundleBySpaceId(spaceId);
    }

    /**
     * Call {@link ISocialTenantService#getByAppIdAndTenantId(String, String)}
     *
     * @param suiteId Pre application Suite ID
     * @param authCorpId Authorized enterprise ID
     */
    private void realGetByAppIdAndTenantId(String suiteId, String authCorpId) {
        Mockito.doAnswer(invocation -> realSocialTenantService.getByAppIdAndTenantId(suiteId, authCorpId))
                .when(socialTenantService)
                .getByAppIdAndTenantId(suiteId, authCorpId);
    }

}
