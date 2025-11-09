/**
 * Mood Pack downloader and updater
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import unzipper from 'unzipper';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const CATALOG_URL = process.env.OPENFM_CATALOG_URL || 'https://openfm.example.com/catalog.json';

export interface MoodPackInfo {
  id: string;
  name: string;
  version: string;
  downloadUrl: string;
  size: number;
}

export interface CatalogResponse {
  packs: MoodPackInfo[];
}

export async function checkForUpdates(): Promise<MoodPackInfo[]> {
  try {
    const response = await fetch(CATALOG_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.statusText}`);
    }

    const catalog = (await response.json()) as CatalogResponse;
    return catalog.packs || [];
  } catch (error) {
    console.error('Error checking for updates:', error);
    return [];
  }
}

export async function downloadMoodPack(
  moodId: string,
  downloadUrl: string
): Promise<void> {
  const tempDir = path.join(process.cwd(), '.moodpacks', 'temp');
  const targetDir = path.join(process.cwd(), '.moodpacks', moodId);

  // Create directories
  await fs.mkdir(tempDir, { recursive: true });
  await fs.mkdir(targetDir, { recursive: true });

  // Download ZIP
  console.log(`Downloading mood pack: ${moodId}`);
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const zipPath = path.join(tempDir, `${moodId}.zip`);
  const fileStream = createWriteStream(zipPath);

  if (!response.body) {
    throw new Error('Response body is null');
  }

  await pipeline(response.body, fileStream);

  // Extract ZIP
  console.log(`Extracting mood pack: ${moodId}`);
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: targetDir }))
    .promise();

  // Clean up temp file
  await fs.unlink(zipPath);

  console.log(`✓ Mood pack installed: ${moodId}`);
}

export async function installStarterPacks(): Promise<void> {
  const packs = await checkForUpdates();
  
  if (packs.length === 0) {
    console.warn('No starter packs available');
    return;
  }

  console.log(`Installing ${packs.length} starter packs...`);
  
  for (const pack of packs) {
    try {
      await downloadMoodPack(pack.id, pack.downloadUrl);
    } catch (error) {
      console.error(`Failed to install pack ${pack.id}:`, error);
    }
  }
  
  console.log('✓ Starter packs installed');
}

