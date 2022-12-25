-- APITable <https://github.com/apitable/apitable>
-- Copyright (C) 2022 APITable Ltd. <https://apitable.com>
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with this program.  If not, see <http://www.gnu.org/licenses/>.

-- Resource type: png, jpeg, pdf, zip,
INSERT INTO asset(id, `checksum`, head_sum, bucket, file_size, file_url, mime_type,
                       extension_name, preview, is_template, height, width)
VALUES (1506201075392774146, 'DekwyNBgUj3Shi1FzCfl1A==', NULL, 'QNY1', 658436,
        'space/2022/03/22/cc3737c2aef54d499502f4941ab81841', 'image/png', 'png', NULL, 0,
        1574, 2834),
       (1504000749080977410, 'a3/k6dEo0oArGIgAj1NsIg==', NULL, 'QNY1', 30172,
        'space/2022/03/16/8580516060d04644af837c58d48bc341', 'application/pdf', 'pdf',
        'space/2022/03/16/f84c9bbaa3dd49e98584bf2125a546cd', 0, NULL, NULL),
       (1504294306435092482, '1TEHKHE/kRI//itWS+VmqA==', NULL, 'QNY1', 221582,
        'space/2022/03/17/7499b34fd918404e9e192b9510a9585c', 'image/jpeg', 'jpeg', NULL,
        0, 844, 1500),
       (1504391903843299329, 'gBzxF8WgPaFcXKHB2LKWYA==', NULL, 'QNY1', 144656256,
        'space/2022/03/17/53541fe104634651b07855b4bb2e7e31', 'application/zip', 'zip',
        NULL, 0, NULL, NULL),
       (1504393156275056641, '39BpTncpg3+m5vtnKwoM7w==', NULL, 'QNY1', 221179294,
        'space/2022/03/17/bd2ed27814224345920b8a616100bdb2', 'video/mp4', 'mp4', NULL, 0,
        NULL, NULL),
       (41, 'checksum', 'checksum', 'bucket', 41, 'url', 'type', 'extension', NULL, 0, 41, 41);