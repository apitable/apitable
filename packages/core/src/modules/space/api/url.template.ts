/**
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

// =============== Template related =======================
export const CREATE_TEMPLATE = '/template/create';
export const OFFICIAL_TEMPLATE_CATEGORY = '/template/categoryList';
export const TEMPLATE_LIST = '/template/list';
/*
* Get official template category content
 */
export const TEMPLATE_CATEGORIES = '/template/categories/:categoryCode';
/*
* Load all templates of space station
 */
export const SPACE_TEMPLATES = '/spaces/:spaceId/templates';
export const DELETE_TEMPLATE = '/template/delete/';
export const TEMPLATE_DIRECTORY = '/template/directory';
/*
  * Template topic content
  */
export const TEMPLATE_ALBUMS = '/template/albums/:albumId';
/*
  * Template topic recommendation
  */
export const TEMPLATE_ALBUMS_RECOMMEND = '/template/albums/recommend';
export const USE_TEMPLATE = '/template/quote';
export const TEMPLATE_NAME_VALIDATE = '/template/validate';
export const TEMPLATE_RECOMMEND = '/template/recommend';
export const TEMPLATE_SEARCH = '/template/global/search';