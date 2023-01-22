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

export function replaceSchemaByLanguage(language: string, source: any): any {
  if (Array.isArray(source)) {
    return source.map((item) => {
      return replaceSchemaByLanguage(language, item);
    });
  } else if (typeof source === 'object') {
    const copySource: any = {};
    Object.keys(source).forEach((key) => {
      copySource[key] = replaceSchemaByLanguage(language, source[key]);
    });
    return copySource;
  }
  return language[source] || source;
}

export function getTypeByItem(item: any, lang: string, type = 'action') {
  const language = item.i18n[lang];
  const inputSchema = item.inputJsonSchema;
  const outputSchema = item.outputJsonSchema;
  const serviceLanguage = item.serviceI18n[lang];
  const idFieldName = type === 'action' ? 'actionTypeId' : 'triggerTypeId';
  return {
    [idFieldName]: item[idFieldName],
    name: language[item.name] || item.name,
    description: language[item.description] || item.description,
    endpoint: item.endpoint,
    inputJsonSchema: replaceSchemaByLanguage(language, inputSchema),
    outputJsonSchema: replaceSchemaByLanguage(language, outputSchema),
    service: {
      serviceId: item.serviceId,
      name: serviceLanguage[item.serviceName],
      logo: item.serviceLogo,
      slug: item.serviceSlug
    }
  };
}
