package com.vikadata.scheduler.space.handler;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.scheduler.space.cache.service.RedisService;
import com.vikadata.scheduler.space.service.IApiStatisticsService;
import com.vikadata.scheduler.space.service.IDingTalkConfigService;
import com.vikadata.scheduler.space.service.ISpaceAssetService;
import com.vikadata.scheduler.space.service.ISpaceService;
import com.vikadata.scheduler.space.service.IStaticsService;
import com.vikadata.scheduler.space.service.ITemplateService;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 任务处理器
 * </p>
 *
 * @author Chambers
 * @date 2019/11/20
 */
@Component
public class SpaceJobHandler {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private IStaticsService iStaticsService;

    @Resource
    private ITemplateService templateService;

    @Resource
    private IDingTalkConfigService iDingTalkConfigService;

    @Resource
    private RedisService redisService;

    @Resource
    private IApiStatisticsService apiStatisticsService;

    @XxlJob(value = "delSpaceJobHandler")
    public void execute() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("Delete Space. param:{}", param);
        iSpaceService.delSpace(param);
    }

    @XxlJob(value = "refCountingJobHandler")
    public void refCounting() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("Ref Counting. param:{}", param);
        iSpaceAssetService.referenceCounting(param);
    }

    @XxlJob(value = "releaseAssetHandler")
    public void releaseAsset() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("释放上传之后没有用过的附件. param:{}", param);
        String spaceId = "";
        LocalDate date = LocalDate.now(ZoneId.of("+8")).minusDays(1);
        LocalDateTime startAt = LocalDateTime.of(date, LocalTime.MIN);
        LocalDateTime endAt = LocalDateTime.of(date, LocalTime.MAX);
        if (StrUtil.isNotBlank(param)) {
            JSONObject obj = JSONUtil.parseObj(param);
            spaceId = obj.getStr("spaceId", spaceId);
            DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            startAt = LocalDateTime.parse(obj.getStr("startAt", startAt.toString()), df);
            endAt = LocalDateTime.parse(obj.getStr("endAt", endAt.toString()), df);
        }
        iSpaceAssetService.releaseAsset(spaceId, startAt, endAt);
    }

    @XxlJob(value = "vCodeStatistics")
    public void vCodeStatistics() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("每日V币统计. param:{}", param);
        if (StrUtil.isBlank(param) || !JSONUtil.parseObj(param).containsKey("datasheetId")) {
            XxlJobHelper.handleFail("统计表ID不存在");
            return;
        }
        iStaticsService.vCodeStatistics(JSONUtil.parseObj(param).getStr("datasheetId"));
    }

    @XxlJob(value = "syncTemplate")
    public void syncTemplate() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("初始化模版数据. param:{}", param);
        templateService.syncTemplate();
    }

    @XxlJob(value = "syncDingTalkGoodsCode")
    public void syncDingTalkGoodsCode() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("初始化数据表IDs. param:{}", param);
        String[] params = param.split(",");
        if (params.length != 4) {
            XxlJobHelper.log("参数错误: param:[{}]", Arrays.toString(params));
            XxlJobHelper.handleFail("参数错误");
        }
        // 第一个为plan表，第二个为属性表
        iDingTalkConfigService.saveDingTalkGoodsConfig(params[0], params[1], params[2], params[3]);
    }

    @XxlJob(value = "refreshApiUsageNextMonthIdHandler")
    public void refreshApiUsageNextMonthMinId() {
        redisService.refreshApiUsageNextMonthMinId();
    }

    @XxlJob(value = "spaceApiUsageDailyStatistics")
    public void spaceApiUsageDailyStatistics() {
        apiStatisticsService.spaceApiUsageDailyStatistics();
    }

    @XxlJob(value = "spaceApiUsageMonthlyStatistics")
    public void spaceApiUsageMonthlyStatistics() throws ParseException {
        apiStatisticsService.spaceApiUsageMonthlyStatistics();
    }
}
