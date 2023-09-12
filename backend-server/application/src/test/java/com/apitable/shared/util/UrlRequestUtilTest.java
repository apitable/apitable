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

package com.apitable.shared.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import org.junit.jupiter.api.Test;

public class UrlRequestUtilTest {

    @Test
    void testGetTitle() throws ExecutionException, InterruptedException {
        CompletableFuture<String> title =
            UrlRequestUtil.getTitle("https://aitable.ai", new ArrayList<>());
        String titleString = title.get();
        assertThat(titleString).isNotNull();
    }

    @Test
    void testGetHtmlTitle() throws MalformedURLException {
        Optional<String> title = UrlRequestUtil.getHtmlTitle(new URL("https://aitable.ai"));
        assertThat(title).isNotNull();
    }

}
