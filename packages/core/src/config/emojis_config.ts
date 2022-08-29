import * as emojisJson from './emojis.auto.json';
import { privateTransform } from './private_transform';

const transformedEmojisJson = privateTransform(emojisJson, 'emojis', 'url');

export const EmojisConfig = transformedEmojisJson.emojis;