package com.vikadata.api.modular.test.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.modular.test.model.ClockVO;
import com.vikadata.clock.Clock;
import com.vikadata.clock.ClockUtil;
import com.vikadata.clock.MockClock;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * 测试模块
 * @author Shawn Deng
 * @date 2022-05-25 16:23:28
 */
@RestController
@Api(tags = "测试模块")
@ApiResource(path = "/test")
public class TestController {

    @Resource
    private Clock clock;

    @GetResource(path = "/clock", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "Get the current time", response = ClockVO.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "timeZone", value = "时区", dataTypeClass = String.class, paramType = "query", example = "+08:00"),
    })
    public ResponseData<ClockVO> getCurrentTime(@RequestParam(name = "timeZone", required = false) String timeZoneStr) {
        // default china zone
        final ZoneOffset timeZone = timeZoneStr != null ? ZoneOffset.of(timeZoneStr) : ZoneOffset.UTC;
        final OffsetDateTime now = clock.getUTCNow();
        System.out.println(LocalDateTime.now());
        System.out.println(LocalDate.now());
        System.out.println(clock.getNow(DEFAULT_TIME_ZONE));
        System.out.println(clock.getToday(DEFAULT_TIME_ZONE));
        ClockVO clockVO = new ClockVO(now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME), ClockUtil.formatTimeZone(timeZone), ClockUtil.toLocalDate(now, timeZone));
        return ResponseData.success(clockVO);
    }

    @PostResource(path = "/clock", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "Set the current time")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "requestedDate", value = "设置时间", dataTypeClass = String.class, paramType = "query", example = "2022-12-14T23:02:15.000Z"),
            @ApiImplicitParam(name = "timeZone", value = "时区", dataTypeClass = String.class, paramType = "query", example = "+08:00"),
    })
    public ResponseData<ClockVO> setTestClockTime(@RequestParam(name = "requestedDate", required = false) String requestedDate,
            @RequestParam(name = "timeZone", required = false) String timeZoneStr,
            @RequestParam(name = "timeoutSec", required = false, defaultValue = "5") Long timeoutSec) {
        final MockClock testClock = getMockClock();
        if (requestedDate == null) {
            testClock.resetDeltaFromReality();
        }
        else {
            final OffsetDateTime newTime = OffsetDateTime.parse(requestedDate).with(ZoneOffset.UTC);
            testClock.setTime(newTime);
        }

        waitForEventToComplete(timeoutSec);

        return getCurrentTime(timeZoneStr);
    }

    @PostResource(path = "/clock", method = RequestMethod.PUT, requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "Move the current time")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "days", value = "天数", dataTypeClass = String.class, paramType = "query", example = "10"),
            @ApiImplicitParam(name = "weeks", value = "周数", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "months", value = "月数", dataTypeClass = String.class, paramType = "query", example = "10"),
            @ApiImplicitParam(name = "years", value = "年数", dataTypeClass = String.class, paramType = "query", example = "1¬"),
            @ApiImplicitParam(name = "timeZone", value = "时区", dataTypeClass = String.class, paramType = "query", example = "+08:00"),
    })
    public ResponseData<ClockVO> updateTestClock(@RequestParam(name = "days", required = false) final Integer addDays,
            @RequestParam(name = "weeks", required = false) final Integer addWeeks,
            @RequestParam(name = "months", required = false) final Integer addMonths,
            @RequestParam(name = "years", required = false) final Integer addYears,
            @RequestParam(name = "timeZone", required = false) final String timeZoneStr,
            @RequestParam(name = "timeoutSec", required = false, defaultValue = "5") final Long timeoutSec) {
        final MockClock testClock = getMockClock();
        if (addDays != null) {
            testClock.addDays(addDays);
        }
        else if (addWeeks != null) {
            testClock.addWeeks(addWeeks);
        }
        else if (addMonths != null) {
            testClock.addMonths(addMonths);
        }
        else if (addYears != null) {
            testClock.addYears(addYears);
        }

        waitForEventToComplete(timeoutSec);

        return getCurrentTime(timeZoneStr);
    }

    private boolean waitForEventToComplete(final Long timeoutSec) {
        return false;
    }

    private MockClock getMockClock() {
        if (!(clock instanceof MockClock)) {
            throw new UnsupportedOperationException("System has not been configured to update the time");
        }
        return (MockClock) clock;
    }
}
