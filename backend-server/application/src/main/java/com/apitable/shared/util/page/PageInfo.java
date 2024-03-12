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

package com.apitable.shared.util.page;

import cn.hutool.core.collection.CollUtil;
import java.util.Collections;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * page info.
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class PageInfo<T> {

    private long pageNum;

    private long pageSize;

    private long size;

    private long total;

    private long pages;

    private long startRow;

    private long endRow;

    private long prePage;

    private long nextPage;

    private Boolean firstPage = false;

    private Boolean lastPage = false;

    private boolean hasPreviousPage = false;

    private boolean hasNextPage = false;

    private List<T> records = Collections.emptyList();

    public PageInfo() {
        //Do Nothing
    }

    /**
     * constructor.
     *
     * @param pageNum  current page number
     * @param pageSize current page size
     * @param total    total records
     * @param records  records
     */
    public PageInfo(long pageNum, long pageSize, long total, List<T> records) {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.total = total;
        calculateSize(records);

        this.prePage = pageNum - 1;
        calculatePages();
        calculateStartAndEndRow();
        calcPage();
        judgePageBoundary();
    }

    private void calculateSize(List<T> records) {
        if (CollUtil.isEmpty(records)) {
            this.size = 0;
            return;
        }
        long sub = this.total - ((this.pageNum - 1) * this.pageSize);
        if (sub <= 0) {
            this.size = 0;
            return;
        }
        if (sub >= records.size()) {
            this.records = records;
            this.size = records.size();
            return;
        }
        this.records = records.subList(0, (int) sub);
        this.size = sub;
    }

    private void calculatePages() {
        if (getPageSize() == 0) {
            this.pages = 0;
        }
        long pages = getTotal() / getPageSize();
        if (getTotal() % getPageSize() != 0) {
            pages++;
        }
        this.pages = pages;
    }

    private void calculateStartAndEndRow() {
        if (this.pageNum > 0) {
            this.startRow = ((this.pageNum - 1) * this.pageSize) + 1;
        } else {
            this.startRow = 0;
        }

        this.endRow = this.startRow - 1 + this.size;
    }

    private void calcPage() {
        if (pageNum > 1) {
            prePage = pageNum - 1;
        } else {
            prePage = 1;
        }
        if (pageNum < pages) {
            nextPage = pageNum + 1;
        } else {
            nextPage = pages;
        }
    }

    private void judgePageBoundary() {
        firstPage = pageNum == 1;
        lastPage = pageNum == pages || pages == 0;
        hasPreviousPage = pageNum > 1;
        hasNextPage = pageNum < pages;
    }
}
