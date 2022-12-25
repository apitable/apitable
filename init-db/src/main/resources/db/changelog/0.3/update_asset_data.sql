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

-- Update Base Asset Data
UPDATE `${table.prefix}asset`
SET is_template = 0
WHERE id IN ('1236218159638151170', '1236220900691312641', '1236221004961710082', '1236221498866171906', '1236221524875051010',
             '1236221574858571778', '1236221594953482242', '1236221617518837762', '1236221687517577217', '1236221706526162945',
             '1236221728084885505', '1236221746959253506', '1236221767049969666', '1236221787111325698', '1236221807407562753',
             '1236221831675805697', '1236221851649081346', '1236221871152594945', '1236221898839195649', '1236221919512920065',
             '1236221940006289410');

-- Init Base Asset Data
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236221940006289415, 'H5oOmGzQYqPlrlZprYXf6w==', 'iVBORw0KGgoAAAANSUhEUgAAAvwAAAI6CAYAAABb6Zw=', 918566, 'template/datasheet/initial/101.png', 'png', 1, 570, 764);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236221940006289416, 'lk6Fs3BoEse6OSQd0iDbXg==', 'iVBORw0KGgoAAAANSUhEUgAAAwEAAAJBCAYAAAAeMLk=', 1007624, 'template/datasheet/initial/102.png', 'png', 1, 577, 769);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222052472356871, 'cMdBhYzltJHxwyZLuZ+hqA==', 'iVBORw0KGgoAAAANSUhEUgAAA14AAAINCAYAAAAuta4=', 1288320, 'template/datasheet/initial/201.png', 'png', 1, 525, 862);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222052472356872, 'RZI4tX7a37qNXmw/5wFkAg==', 'iVBORw0KGgoAAAANSUhEUgAAA1cAAAI7CAYAAAAAg2E=', 1273061, 'template/datasheet/initial/202.png', 'png', 1, 571, 855);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222052673683464, 'J16QTU16RaAbpz42SrOrYg==', 'iVBORw0KGgoAAAANSUhEUgAAA1wAAAI8CAYAAADlZqo=', 674950, 'template/datasheet/initial/203.png', 'png', 1, 572, 860);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222052757569543, 'cbWWfCX236Y9lb6vTYFu8A==', 'iVBORw0KGgoAAAANSUhEUgAAAvwAAAI6CAYAAABb6Zw=', 757712, 'template/datasheet/initial/204.png', 'png', 1, 570, 764);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222132726169608, 'Ofjkwoq7sQarsxFwq8JjrQ==', 'iVBORw0KGgoAAAANSUhEUgAAA1QAAAIzCAYAAAAH51g=', 992157, 'template/datasheet/initial/301.png', 'png', 1, 563, 852);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222132726169609, 'Snq5CAFVIpWFK1fNOF+QgQ==', 'iVBORw0KGgoAAAANSUhEUgAAA10AAAI+CAYAAABHbGA=', 1375610, 'template/datasheet/initial/302.png', 'png', 1, 574, 861);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222133061713928, 'CaR5LSL2eH4Im+R9ogLJkg==', 'iVBORw0KGgoAAAANSUhEUgAAA9IAAAD/CAYAAAAdSe4=', 681672, 'template/datasheet/initial/303.png', 'png', 1, 255, 978);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222133061713929, '9wpnomajrJpcNFPlRQUC5A==', 'iVBORw0KGgoAAAANSUhEUgAAA0IAAAIUCAYAAAA3/pw=', 1044368, 'template/datasheet/initial/304.png', 'png', 1, 532, 834);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222133065908232, 'p+AJJCobbFEwrS6N15d8jQ==', 'iVBORw0KGgoAAAANSUhEUgAAA1oAAAI+CAYAAAClsHs=', 962707, 'template/datasheet/initial/305.png', 'png', 1, 574, 858);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222210165604360, 'ory09EfI+1CHpL2RC2ntgA==', 'iVBORw0KGgoAAAANSUhEUgAAAvwAAAI7CAYAAACQtU8=', 1245827, 'template/datasheet/initial/401.png', 'png', 1, 571, 764);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222210165604361, 'Yb0ZFyA9y8IJwacWMBfBog==', 'iVBORw0KGgoAAAANSUhEUgAAA88AAAITCAYAAAA5AC4=', 1079356, 'template/datasheet/initial/402.png', 'png', 1, 531, 975);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222210341765128, 'cDGlveDQay5WygP1x+GS5w==', 'iVBORw0KGgoAAAANSUhEUgAAA1wAAAI9CAYAAAAuOnk=', 895177, 'template/datasheet/initial/403.png', 'png', 1, 573, 860);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222250707746824, 'OhPFyoite/yDRUATh6W+wQ==', 'iVBORw0KGgoAAAANSUhEUgAAA2AAAAI7CAYAAACKrPg=', 861877, 'template/datasheet/initial/501.png', 'png', 1, 571, 864);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222250879713288, '2n5+pxlFXhLg7eURJdl/TA==', 'iVBORw0KGgoAAAANSUhEUgAAA14AAAI+CAYAAACsW9s=', 1386996, 'template/datasheet/initial/502.png', 'png', 1, 574, 862);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222250888101895, 'upvjuXSFvzzFnFwqdHNNHw==', 'iVBORw0KGgoAAAANSUhEUgAAA14AAAI8CAYAAADhk3o=', 1289958, 'template/datasheet/initial/503.png', 'png', 1, 572, 862);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222280101429255, 'Mg4lOggwi0yxmR63DgklzA==', 'iVBORw0KGgoAAAANSUhEUgAAA84AAAIgCAYAAABULDA=', 684881, 'template/datasheet/initial/601.png', 'png', 1, 544, 974);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222280185315336, '7MqdNpswqhOtT0DchpZS9Q==', 'iVBORw0KGgoAAAANSUhEUgAAA9EAAAIfCAYAAAB3pV8=', 1256218, 'template/datasheet/initial/602.png', 'png', 1, 543, 977);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222322744918024, 'KUboT7U6fTobeT18ugAizQ==', 'iVBORw0KGgoAAAANSUhEUgAAA1wAAAI7CAYAAAD4Y5o=', 869574, 'template/datasheet/initial/701.png', 'png', 1, 571, 860);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222322744918025, 'Ww9/ImPtttPGs0XJuvJE+g==', 'iVBORw0KGgoAAAANSUhEUgAAA8wAAAIfCAYAAACl9VU=', 542739, 'template/datasheet/initial/702.png', 'png', 1, 543, 972);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222358660743175, 'voDyClEncEhMVppimhp17A==', 'iVBORw0KGgoAAAANSUhEUgAAA2AAAAI7CAYAAACKrPg=', 1109627, 'template/datasheet/initial/801.png', 'png', 1, 571, 864);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222358660743176, '9N2hQePHh+o8XfSyHGhd5Q==', 'iVBORw0KGgoAAAANSUhEUgAAA1kAAAI5CAYAAABTgvA=', 923795, 'template/datasheet/initial/802.png', 'png', 1, 569, 857);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222358664937480, 'Ek8Ui21ILXwpYYT4LFDP9A==', 'iVBORw0KGgoAAAANSUhEUgAAAvgAAAI2CAYAAAAlwPw=', 960855, 'template/datasheet/initial/803.png', 'png', 1, 566, 760);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222384640262152, 'qzL5mgVwGa80fHiX6r5lTw==', 'iVBORw0KGgoAAAANSUhEUgAAA18AAAImCAYAAACsHDA=', 1293184, 'template/datasheet/initial/901.png', 'png', 1, 550, 863);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222384640262153, 'Q0jTODwpCy6Jtqi9myvdkQ==', 'iVBORw0KGgoAAAANSUhEUgAAA4oAAAI2CAYAAAAW8nY=', 1162665, 'template/datasheet/initial/902.png', 'png', 1, 566, 906);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222384640262154, 'PO0ULBn6+X6EHYrCs9kfDA==', 'iVBORw0KGgoAAAANSUhEUgAAAvMAAAH3CAYAAAA2fNA=', 1069487, 'template/datasheet/initial/903.png', 'png', 1, 503, 755);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222413295747080, 'p0H9HGnWXmS6w2Il9XrASQ==', 'iVBORw0KGgoAAAANSUhEUgAAA1kAAAI6CAYAAADVFoI=', 1470237, 'template/datasheet/initial/1001.png', 'png', 1, 570, 857);
INSERT INTO `${table.prefix}asset`(`id`, `checksum`, `head_sum`, `file_size`, `file_url`, `extension_name`, `is_template`, `height`, `width`)
VALUES (1236222413295747081, 'FcBOTUpfKmRdfMx+UqsJAA==', 'iVBORw0KGgoAAAANSUhEUgAAAxAAAAI8CAYAAABh4E0=', 1266718, 'template/datasheet/initial/1002.png', 'png', 1, 572, 784);
