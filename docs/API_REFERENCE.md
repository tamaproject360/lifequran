# LifeQuran - API & Component Reference

Quick reference untuk semua komponen dan utilities yang baru dibuat.

---

## 📖 Reading Screen

### Import
```typescript
import { useRouter } from 'expo-router';
```

### Navigation
```typescript
// Navigate to surah
router.push('/reading?surah=1');

// Navigate to juz
router.push('/reading?juz=1');

// Navigate to specific ayah
router.push('/reading?surah=2&ayah=255');
```

### Features
- Font size control (A+/A-)
- Translation toggle
- Screen always-on
- Smooth 60fps scrolling
- Verse number indicators

---

## 🌊 WavyShape Component

### Import
```typescript
import { WavyShape } from '@/components';
```

### Usage
```tsx
<WavyShape 
  variant="top"        // 'top' | 'bottom' | 'floating'
  width={400}          // number
  height={200}         // number
  opacity={0.15}       // number (0-1)
/>
```

### Props
- `variant`: Position variant
- `width`: Width in pixels
- `height`: Height in pixels
- `opacity`: Opacity (0-1)

---

## 🔔 Notification Manager

### Import
```typescript
import { notificationManager } from '@/utils/notificationManager';
```

### Request Permissions
```typescript
const granted = await notificationManager.requestPermissions();
// Returns: boolean
```

### Schedule Daily Reminder
```typescript
const notificationId = await notificationManager.scheduleDailyReminder(
  7,  // hour (0-23)
  30  // minute (0-59)
);
// Returns: string | null
```

### Cancel Daily Reminder
```typescript
await notificationManager.cancelDailyReminder();
```

### Get Saved Reminder Time
```typescript
const time = await notificationManager.getReminderTime();
// Returns: { hour: number, minute: number } | null
```

### Send Achievement Notification
```typescript
await notificationManager.sendAchievementNotification(
  'Badge Name',
  '🎉'  // emoji
);
```

### Send Level Up Notification
```typescript
await notificationManager.sendLevelUpNotification(
  5,           // new level
  'Hafizh Muda'  // level name
);
```

### Schedule Streak Protection
```typescript
await notificationManager.scheduleStreakProtectionReminder();
// Schedules daily at 9 PM
```

### Handle Notification Response (Deep Linking)
```typescript
const route = await notificationManager.handleNotificationResponse(response);
// Returns: string | null (route path)
```

### Get All Scheduled Notifications
```typescript
const notifications = await notificationManager.getAllScheduledNotifications();
// Returns: NotificationRequest[]
```

### Cancel All Notifications
```typescript
await notificationManager.cancelAllNotifications();
```

---

## 🔥 Streak Manager

### Import
```typescript
import { streakManager } from '@/utils/streakManager';
```

### Get Streak Data
```typescript
const streakData = await streakManager.getStreakData();
// Returns: StreakData
```

### StreakData Type
```typescript
type StreakData = {
  currentStreak: number;      // Current streak count
  longestStreak: number;      // Longest streak ever
  lastReadDate: string;       // Last read date (YYYY-MM-DD)
  freezeAvailable: boolean;   // Is freeze available?
  freezeUsedDate: string | null;  // When freeze was used
  totalDaysRead: number;      // Total days read
};
```

### Update Streak (After Reading)
```typescript
const updatedStreak = await streakManager.updateStreak();
// Returns: StreakData
```

### Activate Freeze Manually
```typescript
const success = await streakManager.activateFreeze();
// Returns: boolean
```

### Check if Streak at Risk
```typescript
const atRisk = await streakManager.isStreakAtRisk();
// Returns: boolean (true if user hasn't read today)
```

### Get Streak Bonus XP
```typescript
const bonusXP = streakManager.getStreakBonusXP(7);
// Returns: 100 (if streak is multiple of 7)
// Returns: 0 (otherwise)
```

### Reset Streak
```typescript
await streakManager.resetStreak();
// Resets all streak data
```

---

## 🔖 Bookmark List Screen

### Navigation
```typescript
router.push('/(tabs)/bookmarks');
```

### Features
- Display all bookmarks
- Long-press to delete
- Tap to navigate to verse
- Empty state
- Sorted by date (newest first)

---

## 📚 Juz List Screen

### Navigation
```typescript
router.push('/(tabs)/juz');
```

### Features
- All 30 Juz with metadata
- Surah range info
- Page numbers
- Staggered animations
- Navigate to reading screen

---

## 🔍 Search Screen

### Navigation
```typescript
router.push('/search');
router.push('/search?q=rahmat');  // With query
```

### Features
- Real-time search (min 3 chars)
- Search in Arabic & translation
- Text highlighting
- Limit 50 results
- Empty states

---

## 🎨 Design System Colors

```typescript
const theme = {
  primary: {
    emerald: '#22C55E',
    mint: '#ADFFD8',
  },
  secondary: {
    midnight: '#022C22',
    gold: '#D4AF37',
  },
  colors: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceElevated: '#FFFFFF',
    border: 'rgba(0,0,0,0.1)',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
  },
};
```

---

## 🎭 Animation Presets

```typescript
import { Duration, AnimationEasing } from '@/theme/animations';

// Durations
Duration.fast      // 200ms
Duration.normal    // 300ms
Duration.slow      // 500ms
Duration.slower    // 700ms
Duration.wave      // 8000ms

// Easings
AnimationEasing.easeOutExpo
AnimationEasing.easeOut
AnimationEasing.easeInOut
```

---

## 📱 Screen Navigation Map

```
/(tabs)/
  ├── home          → Home dashboard
  ├── quran         → Surah list
  ├── juz           → Juz list (NEW)
  ├── bookmarks     → Bookmark list (NEW)
  ├── progress      → Progress stats
  ├── gamification  → Achievements
  └── profile       → Settings

/reading            → Reading screen (NEW)
/search             → Search results (NEW)

/(onboarding)/
  ├── welcome
  ├── registration
  ├── dailyTarget
  ├── reminder
  └── tutorial
```

---

## 🗄️ Database Queries

### Get Verses by Surah
```sql
SELECT v.*, t.text as translation
FROM verses v
LEFT JOIN translations t 
  ON v.surah_number = t.surah_number 
  AND v.ayah_number = t.ayah_number
WHERE v.surah_number = ?
ORDER BY v.ayah_number ASC
```

### Get Verses by Juz
```sql
SELECT v.*, t.text as translation
FROM verses v
LEFT JOIN translations t 
  ON v.surah_number = t.surah_number 
  AND v.ayah_number = t.ayah_number
WHERE v.juz_number = ?
ORDER BY v.id ASC
```

### Search Verses
```sql
SELECT v.*, s.name as surah_name, t.text as translation
FROM verses v
JOIN surahs s ON v.surah_number = s.number
LEFT JOIN translations t 
  ON v.surah_number = t.surah_number 
  AND v.ayah_number = t.ayah_number
WHERE v.text LIKE ? OR t.text LIKE ?
ORDER BY v.surah_number ASC, v.ayah_number ASC
LIMIT 50
```

### Get Bookmarks
```sql
SELECT 
  b.id,
  b.surah_number,
  b.ayah_number,
  b.created_at,
  s.name as surah_name,
  v.text as verse_text
FROM bookmarks b
JOIN surahs s ON b.surah_number = s.number
JOIN verses v 
  ON b.surah_number = v.surah_number 
  AND b.ayah_number = v.ayah_number
ORDER BY b.created_at DESC
```

---

## 🔐 AsyncStorage Keys

```typescript
// Notifications
'notification_permission'  // 'granted' | null
'daily_reminder_id'       // string (notification ID)
'reminder_time'           // JSON: { hour, minute }

// Streak
'user_streak_data'        // JSON: StreakData

// User Preferences
'theme_mode'              // 'light' | 'dark'
'font_size'               // number
'show_translation'        // boolean
```

---

## 🎯 Common Patterns

### Navigate with Haptic Feedback
```typescript
import * as Haptics from 'expo-haptics';

const handlePress = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  router.push('/reading');
};
```

### Staggered List Animation
```tsx
import Animated, { FadeInDown } from 'react-native-reanimated';

{items.map((item, index) => (
  <Animated.View
    key={item.id}
    entering={FadeInDown.delay(index * 30).duration(300)}
  >
    {/* Content */}
  </Animated.View>
))}
```

### Scroll-based Fade Animation
```typescript
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const scrollY = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: interpolate(scrollY.value, [0, 100], [1, 0.1], 'clamp'),
}));

<ScrollView onScroll={(e) => {
  scrollY.value = e.nativeEvent.contentOffset.y;
}} />
```

---

## 📦 Export Summary

### Components
```typescript
export { WavyShape } from '@/components';
export { Card } from '@/components';
export { Button } from '@/components';
// ... other components
```

### Utilities
```typescript
export { notificationManager } from '@/utils/notificationManager';
export { streakManager } from '@/utils/streakManager';
```

### Types
```typescript
export type { StreakData } from '@/utils/streakManager';
export type { CardVariant, CardSize } from '@/components/Card';
export type { ButtonVariant, ButtonSize } from '@/components/Button';
```

---

**Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲**
