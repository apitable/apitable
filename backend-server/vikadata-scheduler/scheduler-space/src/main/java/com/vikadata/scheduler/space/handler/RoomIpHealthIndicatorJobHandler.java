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
 * ROOM-IP Health Indicator Timing Task
 * </p>
 */
@Component
public class RoomIpHealthIndicatorJobHandler {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    // remote IP
    private final String NEST_LOAD_KEY = "vikadata:load:nest_v2:{}";

    // health IP
    private final String NEST_LOAD_HEALTH_KEY = "vikadata:load:nest_v2:{}:health";

    // unhealth IP
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
                XxlJobHelper.log("RoomIP to be checked，count：{}.\n List：\n{}", remoteIps.size(), roomIpTableStr.toString());

                List<CompletableFuture<Void>> cf = remoteIps.stream()
                        .map(remoteIp -> CompletableFuture.runAsync(() -> analyzeRemoteIp(remoteIp, jobParam), executorService))
                        .collect(Collectors.toList());

                CompletableFuture.allOf(cf.toArray(new CompletableFuture[0])).join();
                XxlJobHelper.log("Room client health check completed. Time consuming：{}", timer.intervalPretty());
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

    private void analyzeRemoteIp(String remoteIp, JobParam jobParam) {
        try {
            TimeInterval httpTime = DateUtil.timer();
            String body = HttpUtil.get(StrUtil.format(jobParam.getActuatorHealthUrl(), remoteIp), jobParam.getTimeout());
            String requestHealthTime = httpTime.intervalPretty();
            JSONObject bodyJson = JSONUtil.parseObj(body);
            Integer requestCode = bodyJson.getInt("code");
            // Determine the current check response status
            if (Objects.equals(requestCode, 200)) {
                // Health check passed
                XxlJobHelper.log("Check RoomIP: 「{}」. Status:{}. Response time:{}", remoteIp, requestCode, requestHealthTime);
                this.handleHealth(remoteIp, bodyJson, jobParam.getNestEnv());
            }
            else {
                // Failed health check
                XxlJobHelper.log("Check RoomIP: 「{}」. Status:{}. Response time:{}", remoteIp, requestCode, requestHealthTime);
                this.handleUnHealth(jobParam, remoteIp, jobParam.getNestEnv(), true);
            }
        }
        catch (Exception e) {
            XxlJobHelper.log("Check RoomIP: 「{}」. Status:{}，Response mesaage：{}", remoteIp, "unknown", ExceptionUtil.stacktraceToOneLineString(e));
            this.handleUnHealth(jobParam, remoteIp, jobParam.getNestEnv(), true);
        }
    }

    /**
     * Mark healthy IP processing
     */
    private void handleHealth(String ip, JSONObject healthInfo, String nestEnv) {
        redisTemplate.executePipelined((RedisCallback<String>) connection -> {
            byte[] healthKey = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_HEALTH_KEY, nestEnv));
            byte[] unhealthKey = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_UNHEALTH_KEY, nestEnv));
            byte[] ipValue = StrUtil.utf8Bytes(ip);

            /* health indicators */
            // Machine total memory
            Double totalMem = Convert.toDouble(healthInfo.getByPath("data.info.memory_rss.totalMem"), 1D);
            // Machine used memory
            Double memoryUsageMem = Convert.toDouble(healthInfo.getByPath("data.info.memory_heap.memoryUsageMem"), 1D);

            // Calculate health score - no past CPU, currently use used memory as score
            double healthScore = NumberUtil.roundDown(memoryUsageMem, 2).doubleValue();

            // Add healthy IP while removing unhealthy IP
            connection.zAdd(healthKey, healthScore, ipValue);
            connection.hDel(unhealthKey, ipValue);
            return null;
        });
    }

    /**
     * Mark unhealthy IP processing
     */
    private void handleUnHealth(JobParam jobParam, String ip, String nestEnv, boolean available) {
        byte[] healthKeyByte = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_HEALTH_KEY, nestEnv));
        byte[] unhealthKeyByte = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_UNHEALTH_KEY, nestEnv));
        byte[] ipKeyByte = StrUtil.utf8Bytes(ip);

        redisTemplate.execute((RedisCallback<String>) connection -> {
            // Mark unhealthy IPs and remove healthy IPs at the same time
            Long latestOfflineNum = connection.hIncrBy(unhealthKeyByte, ipKeyByte, 1);
            connection.zRem(healthKeyByte, ipKeyByte);

            XxlJobHelper.log("Check RoomIP:「{}」. Status:{}. Offline times: {}", ip, "offline", latestOfflineNum);

            // In the case of unreachable service, room is forced to restart, and there is no pub message before restart
            if (!available | Convert.toInt(latestOfflineNum, 0) > jobParam.getMaxOfflineNum()) {
                byte[] loadKey = StrUtil.utf8Bytes(StrUtil.format(NEST_LOAD_KEY, nestEnv));
                connection.sRem(loadKey, ipKeyByte);
                connection.zRem(healthKeyByte, ipKeyByte);
                connection.hDel(unhealthKeyByte, ipKeyByte);
                XxlJobHelper.log("Check RoomIP:「{}」. Status:{}", ip, "out");
                // TODO IM notification?
            }
            return null;
        });
    }

    @Getter
    @Setter
    public static class JobParam {
        // check environment
        private String nestEnv = "local";

        private String actuatorHealthUrl = "http://{}:3333/actuator/health";

        private int corePoolSize = 10;

        private int timeout = 1000;

        private int maxOfflineNum = 20;
    }

}
