import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface EnvEntry {
  key: string;
  value: string;
  comment: string;
}

/**
 * Read the key-value pairs and their comments from the .env file and return an array of EnvEntry objects.
 */
function readEnvFile(envFilePath: string): EnvEntry[] {
  const envEntries: EnvEntry[] = [];

  const data = fs.readFileSync(envFilePath, { encoding: 'utf-8' });

  const lines = data.split('\n');
  let currentComment = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      // If it's an empty line or a comment line, add the comment to the current comment.
      currentComment += line + '\n';
    } else if (trimmedLine.indexOf('=') !== -1) {
      // Otherwise, add the current comment and the key-value pair to the EnvEntry array, and reset the current comment.
      const [kv, comment] = trimmedLine.split('#');
      if (comment) {
        currentComment += '#' + comment + '\n';
      }
      const [key, ...valueParts] = kv.split('=');
      const value = valueParts.join('=').trim();
      envEntries.push({
        key,
        value,
        comment: currentComment.trim(),
      });
      currentComment = '';
    }
  }

  return envEntries;
}

/**
 * Write an array of EnvEntry objects to a .env file.
 */
function writeEnvFile(envFilePath: string, envEntries: EnvEntry[]) {
  const lines = envEntries.map(entry => {
    const comment = entry.comment ? `${entry.comment.replace(/\n/g, '\n')}\n` : '';
    return `\n${comment}${entry.key}=${entry.value}`;
  });
  const data = lines.join('\n');

  fs.writeFileSync(envFilePath, data + '\n', { encoding: 'utf-8' });
}

/**
 * Recursively traverse all .env files under a directory and read the key-value pairs and their comments.
 */
function traverseEnvFiles(dirPath: string): EnvEntry[] {
  if (!dirPath) {
    return [];
  }
  const envEntries: EnvEntry[] = [];

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // If it's a subdirectory, recursively traverse it.
      envEntries.push(...traverseEnvFiles(filePath));
    } else if (file.endsWith('.env')) {
      // If it's a .env file, read the key-value pairs and their comments.
      envEntries.push(...readEnvFile(filePath));
    }
  }

  return envEntries;
}

/**
 * Merge multiple arrays of EnvEntry objects into one, and remove duplicate keys.
 */
function mergeEnvEntries(envEntriesList: EnvEntry[][]): EnvEntry[] {
  const envEntriesMap = new Map<string, EnvEntry>();
  for (const envEntries of envEntriesList) {
    for (const envEntry of envEntries) {
      if (envEntriesMap.has(envEntry.key)) {
        const oldComment = envEntriesMap.get(envEntry.key)!.comment;
        const newComment = envEntry.comment;
        if (oldComment != newComment) {
          envEntry.comment = oldComment + (newComment ? '\n' : '') + newComment;
        }
      }
      envEntriesMap.set(envEntry.key, envEntry);
    }
  }

  const sortedEntries = Array.from(envEntriesMap.values()).sort((a, b) => {
    return a.key.localeCompare(b.key);
  });

  return sortedEntries;
}

/**
 * Main function
 */
function main() {
  const [outPath, dirPath1, dirPath2] = process.argv.slice(2);

  // Read the keys, values, and comments from the ".env" files in the two directories specified
  const envEntries1 = traverseEnvFiles(dirPath1);
  const envEntries2 = traverseEnvFiles(dirPath2);

  // Combine multiple EnvEntry arrays into a single array, removing any duplicate keys
  const envEntries = mergeEnvEntries([envEntries1, envEntries2]);

  // Write the merged EnvEntry array to a new ".env" file located in the ".setting" directory
  const settingDirPath = path.join(process.cwd(), outPath);
  if (!fs.existsSync(settingDirPath)) {
    fs.mkdirSync(settingDirPath);
  }
  const envFilePath = path.join(settingDirPath, '.env');
  writeEnvFile(envFilePath, envEntries);

  console.log(`Environment variables have been successfully merged to ${envFilePath}`);
}

main();
