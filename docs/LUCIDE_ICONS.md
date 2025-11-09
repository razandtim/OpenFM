# 🎨 Lucide Icons Reference for OpenFM

**Package**: `lucide-react` ✅ Installed

Lucide icons are now available throughout the UI package. Here's a quick reference for commonly used icons.

---

## 🎵 Music & Playback Icons

```tsx
import {
  Play,           // ▶️ Play button
  Pause,          // ⏸️ Pause button
  PlayCircle,     // ⏯️ Play with circle (larger)
  PauseCircle,    // ⏸️ Pause with circle (larger)
  SkipForward,    // ⏭️ Next track
  SkipBack,       // ⏮️ Previous track
  FastForward,    // ⏩ Fast forward
  Rewind,         // ⏪ Rewind
  Repeat,         // 🔁 Repeat/loop
  Shuffle,        // 🔀 Shuffle
  Music,          // 🎵 Music note
  Music2,         // 🎶 Music notes
  Music3,         // 🎼 Alternative music icon
  Music4,         // 🎧 Another music variant
  Disc,           // 💿 CD/Disc
  Radio,          // 📻 Radio
} from 'lucide-react';

// Usage
<PlayCircle className="h-8 w-8" />
<Pause className="h-5 w-5 text-blue-500" />
```

---

## 🔊 Volume & Audio Icons

```tsx
import {
  Volume2,        // 🔊 Volume high
  Volume1,        // 🔉 Volume medium
  Volume,         // 🔈 Volume low
  VolumeX,        // 🔇 Muted
  Mic,            // 🎤 Microphone
  MicOff,         // 🎤❌ Mic muted
  Headphones,     // 🎧 Headphones
  Speaker,        // 🔊 Speaker
} from 'lucide-react';

// Dynamic volume icon
const VolumeIcon = volume > 0.5 ? Volume2 : volume > 0 ? Volume1 : VolumeX;
<VolumeIcon className="h-5 w-5" />
```

---

## 💖 Mood & Emotion Icons

```tsx
import {
  Heart,          // ❤️ Love/Like
  Smile,          // 😊 Happy
  Frown,          // ☹️ Sad
  Zap,            // ⚡ Energy/Epic
  Sparkles,       // ✨ Special/Magic
  Star,           // ⭐ Featured/Favorite
  Flame,          // 🔥 Hot/Trending
  Ghost,          // 👻 Spooky
  Cloud,          // ☁️ Dreamy/Calm
  Sun,            // ☀️ Bright/Cheerful
  Moon,           // 🌙 Night/Chill
  CloudRain,      // 🌧️ Sad/Melancholy
} from 'lucide-react';

// Example: Dynamic mood icon
const moodIcons = {
  epic: Zap,
  romantic: Heart,
  funny: Smile,
  scary: Ghost,
  sad: CloudRain,
};
```

---

## ⚙️ UI Controls Icons

```tsx
import {
  Settings,       // ⚙️ Settings
  Sliders,        // 🎚️ Controls/Adjust
  X,              // ✕ Close
  XCircle,        // ⊗ Close with circle
  Menu,           // ☰ Menu
  MoreVertical,   // ⋮ More options (vertical)
  MoreHorizontal, // ⋯ More options (horizontal)
  ChevronDown,    // ∨ Dropdown
  ChevronUp,      // ∧ Collapse
  ChevronLeft,    // ‹ Back
  ChevronRight,   // › Forward
  Search,         // 🔍 Search
  Filter,         // 🔍 Filter
  List,           // ≡ List view
  Grid,           // ▦ Grid view
  Eye,            // 👁️ Show/Visible
  EyeOff,         // 👁️❌ Hide/Hidden
  Lock,           // 🔒 Locked
  Unlock,         // 🔓 Unlocked
  Check,          // ✓ Checkmark
  CheckCircle,    // ✓○ Success
  AlertCircle,    // ⚠️ Warning
  Info,           // ℹ️ Information
  HelpCircle,     // ❓ Help
} from 'lucide-react';
```

---

## 📁 File & Library Icons

```tsx
import {
  Folder,         // 📁 Folder
  FolderOpen,     // 📂 Open folder
  File,           // 📄 File
  FileAudio,      // 🎵 Audio file
  Download,       // ⬇️ Download
  Upload,         // ⬆️ Upload
  Plus,           // ➕ Add
  Minus,          // ➖ Remove
  Trash,          // 🗑️ Delete
  Archive,        // 📦 Archive
  Database,       // 🗄️ Database
} from 'lucide-react';
```

---

## 🔗 Connection & Status Icons

```tsx
import {
  Wifi,           // 📶 Connected
  WifiOff,        // 📶❌ Disconnected
  Link,           // 🔗 Link
  Unlink,         // 🔗❌ Unlink
  RefreshCw,      // 🔄 Refresh/Sync
  RotateCcw,      // ↶ Undo
  RotateCw,       // ↷ Redo
  Loader,         // ⟳ Loading
  Loader2,        // ⟳ Loading (animated)
  Circle,         // ○ Empty circle
  CircleDot,      // ⊙ Selected
  CheckCircle2,   // ✓ Success
  XCircle,        // ✗ Error
} from 'lucide-react';
```

---

## 🎨 Styling Examples

### Basic Usage
```tsx
<Play className="h-5 w-5" />
```

### With Color
```tsx
<Heart className="h-6 w-6 text-red-500" />
```

### With Custom Stroke Width
```tsx
<Music className="h-5 w-5" strokeWidth={2.5} />
```

### With Tailwind Hover
```tsx
<Settings className="h-5 w-5 text-white/60 hover:text-white transition" />
```

### Animated Spinner
```tsx
<Loader2 className="h-5 w-5 animate-spin" />
```

### Fill Icon
```tsx
<Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
```

---

## 📝 Example: Complete Button

```tsx
import { PlayCircle, Loader2 } from 'lucide-react';

function PlayButton({ isLoading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white transition hover:bg-accent/90 disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <PlayCircle className="h-5 w-5" />
      )}
      <span>Play</span>
    </button>
  );
}
```

---

## 🎯 Icon Sizing Guide

| Size | Class | Use Case |
|------|-------|----------|
| 16px | `h-4 w-4` | Small inline icons, badges |
| 20px | `h-5 w-5` | Default UI icons, buttons |
| 24px | `h-6 w-6` | Larger buttons, emphasis |
| 32px | `h-8 w-8` | Primary actions, hero buttons |
| 40px | `h-10 w-10` | Large feature icons |
| 48px | `h-12 w-12` | Extra large, landing pages |

---

## 🌈 Icon Color Palette (OpenFM)

```tsx
// Using Tailwind classes
<Music className="text-accent" />          // Primary accent color
<Heart className="text-red-500" />         // Romantic mood
<Zap className="text-yellow-500" />        // Epic mood
<Ghost className="text-purple-500" />      // Scary mood
<CloudRain className="text-blue-500" />    // Sad mood
<Smile className="text-orange-500" />      // Funny mood
<Settings className="text-white/60" />     // Muted UI
<CheckCircle className="text-green-500" /> // Success
<XCircle className="text-red-500" />       // Error
<AlertCircle className="text-yellow-500" />// Warning
```

---

## 🔍 Finding More Icons

**Browse all icons**: https://lucide.dev/icons

**Total icons**: 1,000+ and growing

**Tree-shakeable**: Only imports what you use ✅

---

## ✅ Migration Status

### Converted Components:
- ✅ **NowPlaying.tsx** - Uses Lucide icons
  - `PlayCircle`, `PauseCircle`, `SkipForward`, `SkipBack`, `X`, `List`

### Still Using HeroIcons:
- ⚠️ Other components (to be converted as needed)

### Recommended Next Steps:
1. Convert `Controls.tsx` - Add volume icons
2. Convert `Settings.tsx` - Add settings/sliders icons
3. Convert `Auth.tsx` - Add user/lock icons
4. Convert `Header.tsx` - Add menu/search icons

---

## 💡 Pro Tips

### 1. Use Semantic Names
```tsx
const PlayIcon = isPlaying ? PauseCircle : PlayCircle;
<PlayIcon className="h-8 w-8" />
```

### 2. Create Icon Components
```tsx
// components/icons/MoodIcon.tsx
import { Zap, Heart, Smile, Ghost, CloudRain } from 'lucide-react';

const moodIcons = {
  epic: Zap,
  romantic: Heart,
  funny: Smile,
  scary: Ghost,
  sad: CloudRain,
};

export function MoodIcon({ mood, className }) {
  const Icon = moodIcons[mood] || Music;
  return <Icon className={className} />;
}
```

### 3. Consistent Sizing
```tsx
// Create size presets
const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

<Play className={iconSizes.md} />
```

---

## 🎉 Benefits of Lucide Icons

✅ **Tree-shakeable** - Only bundle what you use  
✅ **Consistent design** - All icons match perfectly  
✅ **Customizable** - Size, color, stroke width  
✅ **TypeScript support** - Full type definitions  
✅ **Active development** - Regular updates  
✅ **Open source** - MIT licensed  
✅ **Great performance** - Optimized SVGs  

---

**Happy icon hunting! 🎨**

For questions or suggestions, check out: https://lucide.dev

