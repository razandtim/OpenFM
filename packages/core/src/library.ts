// Library scanning for Local Mood Packs

import { promises as fs } from 'fs';
import path from 'path';
import type { LocalMood, MoodId, Track } from './types';
import { MOOD_ORDER } from './moods';

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];

export async function scanLibrary(rootPath: string): Promise<LocalMood[]> {
  const moods: LocalMood[] = [];

  try {
    const entries = await fs.readdir(rootPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const moodName = entry.name.toLowerCase();
      const moodId = MOOD_ORDER.find(m => m === moodName) as MoodId | undefined;
      
      if (!moodId) continue; // Skip non-mood directories
      
      const moodPath = path.join(rootPath, entry.name);
      const tracks = await scanMoodDirectory(moodPath, moodId);
      
      // Check for artwork
      let artwork: string | undefined;
      try {
        const artworkPath = path.join(moodPath, 'artwork.png');
        await fs.access(artworkPath);
        artwork = artworkPath;
      } catch {
        // No artwork.png found
      }
      
      moods.push({
        id: moodId,
        name: entry.name,
        path: moodPath,
        artwork,
        tracks,
        enabled: tracks.length > 0,
      });
    }
  } catch (error) {
    console.error('Error scanning library:', error);
  }

  return moods;
}

async function scanMoodDirectory(moodPath: string, moodId: MoodId): Promise<Track[]> {
  const tracks: Track[] = [];
  
  try {
    const files = await fs.readdir(moodPath);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!AUDIO_EXTENSIONS.includes(ext)) continue;
      
      const filePath = path.join(moodPath, file);
      const title = path.basename(file, ext).replace(/_/g, ' ');
      
      tracks.push({
        id: `${moodId}-${file}`,
        title,
        artist: 'OpenFM',
        mood: moodId,
        duration: 180, // Default 3 minutes, can be determined from audio metadata
        filePath,
      });
    }
  } catch (error) {
    console.error(`Error scanning mood directory ${moodPath}:`, error);
  }
  
  return tracks;
}

export async function getMoodArtwork(moodPath: string): Promise<string | null> {
  const artworkPath = path.join(moodPath, 'artwork.png');
  try {
    await fs.access(artworkPath);
    return artworkPath;
  } catch {
    return null;
  }
}

export function getDefaultArtwork(): string {
  return 'default_artwork.png';
}

