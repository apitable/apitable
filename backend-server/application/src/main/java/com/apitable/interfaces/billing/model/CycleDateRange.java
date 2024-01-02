package com.apitable.interfaces.billing.model;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * cycle Date range class.
 */
@Data
@AllArgsConstructor
public class CycleDateRange {

    private LocalDate cycleStartDate;

    private LocalDate cycleEndDate;
}
