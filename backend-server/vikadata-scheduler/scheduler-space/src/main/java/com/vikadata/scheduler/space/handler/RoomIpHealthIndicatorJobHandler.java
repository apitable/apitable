package com.vikadata.scheduler.space.handler;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.date.TimeInterval;
import cn.hutool.core.exceptions.ExceptionUtil;
import cn.hutool.core.lang.ConsoleTable;
import cn.hutool.core.thread.ExecutorBuilder;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.Getter;
import lombok.Setter;

import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * <p>
 * ROOM-IP健康指标定时任务
 * </p>
 *
 * @author Pengap
 * @date 2021/11/1 20:59:41
 */
@Component
public class RoomIpHealthIndicatorJobHandler {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    // 远程IP
    private final String NEST_LOAD_KEY = "vikadata:load:nest_v2:{}";

    // 健康的IP
    private final String NEST_LOAD_HEALTH_KEY = "vikadata:load:nest_v2:{}:health";

    // 不健康的IP
    private final String NEST_LOAD_UNHEALTH_KEY = "vikadata:load:nest_v2:{}:unhealth";

    @XxlJob(value = "roomIpHealthIndicator")
    public void execute() {
        String param = XxlJobHelper.getJobParam();
        TimeInterval timer = DateUtil.timer();
        XxlJobHelper.log("Job. param:{}", param);
        JobParam jobParam = JSONUtil.toBean(param, JobParam.class);

        ExecutorService executorService = ExecutorBuilder.create()
                .setCorePoolSize(jobParam.getCorePoolSize())
                .setHandler(new CallerRunsPolicy())
                .build();

        try {
            String nestLoadKey = StrUtil.format(NEST_LOAD_KEY, jobParam.getNestEnv());
            Set<String> remoteIps = redisTemplate.execute((RedisCallback<Set<String>>) connection -> {
                Set<String> result = CollUtil.newLinkedHashSet();
                Set<byte[]> bytes = connection.sMembers(StrUtil.utf8Bytes(nestLoadKey));
                if (CollUtil.isNotEmpty(bytes)) {
                    bytes.forEach(bytes1 -> result.add(StrUtil.str(bytes1, CharsetUtil.CHARSET_UTF_8)));
                }
                return result;
            });

            if (CollUtil.isNotEmpty(remoteIps)) {
                ConsoleTable roomIpTableStr = ConsoleTable.create().addHeader("　Room Ip List");
                remoteIps.forEach(roomIpTableStr::addBody);
                XxlJobHelper.log("待检查RoomIP，数量：{}\n列表：\n{}", remoteIps.size(), roomIpTableStr.toString());

                List<CompletableFuture<Void>> cf = remoteIps.stream()
                        .map(remoteIp -> CompletableFuture.runAsync(() -> analyzeRemoteIp(remoteIp, jobParam), executorService))
                        .collect(Collectors.toList());

                CompletableFuture.allOf(cf.toArray(new CompletableFuture[0])).join();
                XxlJobHelper.log("Room客户端健康检查完成，耗时：{}", timer.intervalPretty());
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            XxlJobHelper.log(e);
        }
        finally {
            executorService.shutdown();
        }
    }

    /**
     * 分析远程Ip
     */
    private void analyzeRemoteIp(String remoteIp, JobParam jobParam) {
        try {
            TimeInterval httpTime = DateUtil.timer();
            String body = HttpUtil.get(StrUtil.format(jobParam.getActuatorHealthUrl(), remoteIp), jobParam.getTimeout());
            // 请求响应时间
            String requestHealthTime = httpTime.intervalPretty();
            JSONObject bodyJson = JSONUtil.parseObj(body);
            Integer requestCode = bodyJson.getInt("code");
            // 判断当前检查响应状态
            if (Objects.equals(requestCode, 200)) {
                // 健康检查通过
                XxlJobHelper.log("检查RoomIP：「{}」，状态：{}，响应时间：{}", remoteIp, requestCode, requestHealthTime);
                this.handleHealth(remoteIp, bodyJson, jobParam.getNestEnv());
            }
            else {
                // 健康检查不通过
                XxlJobHelper.log("检查RoomIP：「{}」，状态：{}，响应时间：{}", remoteIp, requestCode, requestHealthTime);
                this.handleUnHealth(jobParam, remoteIp, jobParam.getNestEnv(), true);
            }
        }
        catch (Exception e) {
            XxlJobHelper.log("检查RoomIP：「{}」，状态：{}，响应消息：{}", remoteIp, "unknown", ExceptionUtil.stacktraceToOneLineString(e));
            this.handleUnHealth(jobParam, remoteIp, jobParam.getNestEnv(), true);
        }
    }

    /**
     * 标记健康的Ip处理
     */
    private void handleHealth(String ip, JSONObject healthInfo, String nestEnv) {
        redisTemplate.executePipelined((RedisCallback<String>) connection -> {
            byte[] healthKey = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_HEALTH_KEY, nestEnv));
            byte[] unhealthKey = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_UNHEALTH_KEY, nestEnv));
            byte[] ipValue = StrUtil.utf8Bytes(ip);

            /* 健康指标 */
            // 机器可用内存
            Double totalMem = Convert.toDouble(healthInfo.getByPath("data.info.memory_rss.totalMem"), 1D);
            // 机器已用内存
            Double memoryUsageMem = Convert.toDouble(healthInfo.getByPath("data.info.memory_heap.memoryUsageMem"), 1D);
            /* 健康指标 */

            // 计算健康分数 - 没有过去CPU，目前就用已用内存当作分数
            double healthScore = NumberUtil.roundDown(memoryUsageMem, 2).doubleValue();

            // 添加健康IP，同时移除不健康的Ip
            connection.zAdd(healthKey, healthScore, ipValue);
            connection.hDel(unhealthKey, ipValue);
            return null;
        });
    }

    /**
     * 标记不健康的Ip处理
     */
    private void handleUnHealth(JobParam jobParam, String ip, String nestEnv, boolean available) {
        byte[] healthKeyByte = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_HEALTH_KEY, nestEnv));
        byte[] unhealthKeyByte = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_UNHEALTH_KEY, nestEnv));
        byte[] ipKeyByte = StrUtil.utf8Bytes(ip);

        redisTemplate.execute((RedisCallback<String>) connection -> {
            // 标记不健康的Ip，同时移除健康Ip
            Long latestOfflineNum = connection.hIncrBy(unhealthKeyByte, ipKeyByte, 1);
            connection.zRem(healthKeyByte, ipKeyByte);

            XxlJobHelper.log("检查RoomIP：「{}」，状态：{}，离线次数：{}", ip, "offline", latestOfflineNum);

            // 处理服务不可达的情况，room强制重启了，在重启之前没有pub消息
            if (!available | Convert.toInt(latestOfflineNum, 0) > jobParam.getMaxOfflineNum()) {
                byte[] loadKey = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_KEY, nestEnv));
                connection.sRem(loadKey, ipKeyByte);
                connection.zRem(healthKeyByte, ipKeyByte);
                connection.hDel(unhealthKeyByte, ipKeyByte);
                XxlJobHelper.log("检查RoomIP：「{}」，状态：{}", ip, "out");
                // TODO 考虑是否需要接入IM通知？？？
            }
            return null;
        });
    }

    @Getter
    @Setter
    public static class JobParam {
        // 检查环境
        private String nestEnv = "local";

        private String actuatorHealthUrl = "http://{}:3333/actuator/health";

        private int corePoolSize = 10;

        private int timeout = 1000;

        // 最大离线次数，默认20次
        private int maxOfflineNum = 20;
    }

}
