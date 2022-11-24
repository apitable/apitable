package com.vikadata.api.shared.clock;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public interface Clock {

    /**
     * get a offsetDateTime object using the specified timezone
     *
     * @param tz Target timezone
     * @return DateTime in the specified timezone
     */
    OffsetDateTime getNow(ZoneOffset tz);

    /**
     * get a offsetDateTime object using utc timezone
     *
     * @return DateTime in the utc timezone
     */
    OffsetDateTime getUTCNow();

    /**
     * get a LocalDate object using utc timezone
     *
     * @return LocalDate in the utc timezone
     */
    LocalDate getUTCToday();

    /**
     * get a LocalDate object using the specified timezone
     *
     * @param timeZone Target timezone
     * @return LocalDate in the specified timezone
     */
    LocalDate getToday(ZoneOffset timeZone);
}
