# Health-Mate API Architecture Plan

## 1. POINTS SYSTEM & GAMIFICATION

### Activity Points (Base Rewards)
```
Work Session Completion: 50 points
- Per 30-min work session completed

Hydration Logging: 10 points per log
- Each time user logs water intake
- Daily bonus: +20 points if daily goal met (2000ml target)

Exercise Logging: 30 points per session
- Beginner intensity: 30 points
- Medium intensity: 50 points
- High intensity: 75 points

Break Taking: 15 points per break
- Each micro-break counts
- Bonus: +10 points if all scheduled breaks taken in session

Smoking Avoidance: 25 points per day
- Tracked daily (not per log)
- If no smoking logged that day: +25 points

Streak Maintenance:
- 3-day streak: +50 points
- 7-day streak: +100 points
- 14-day streak: +200 points
- 30-day streak: +500 points
```

### Tier Thresholds
```
Bronze: 0-499 points (Default tier)
Silver: 500-1,999 points
Gold: 2,000-4,999 points
Platinum: 5,000+ points
```

---

## 2. ACHIEVEMENTS & BADGES

### Wellness Nudge Specific Achievements

```
1. "First Steps" - 10 pts
   Unlock: Create health profile

2. "Kickstarter" - 20 pts
   Unlock: Complete first work session

3. "Week Warrior" - 100 pts
   Unlock: Complete 7 work sessions in a week

4. "Hydration Hero" - 75 pts
   Unlock: Log water intake for 7 consecutive days

5. "Water Master" - 150 pts
   Unlock: Meet daily water goal (2000ml) for 30 consecutive days

6. "Break Master" - 100 pts
   Unlock: Take 50 breaks during work sessions

7. "Perfect Session" - 80 pts
   Unlock: Complete work session with 100% break compliance

8. "Exercise Enthusiast" - 100 pts
   Unlock: Log 10 exercise sessions

9. "Fitness Fanatic" - 250 pts
   Unlock: Log 50 exercise sessions

10. "Smoke-Free Week" - 150 pts
    Unlock: 7 consecutive days without smoking

11. "Smoke-Free Month" - 500 pts
    Unlock: 30 consecutive days without smoking

12. "Smoking Slayer" - 1000 pts
    Unlock: 100 consecutive days without smoking

13. "Streak Keeper" - 120 pts
    Unlock: Maintain any 7-day streak

14. "Perfect Week" - 200 pts
    Unlock: Meet all daily goals (hydration + breaks + no smoking) for 7 days

15. "Century Club" - 300 pts
    Unlock: Complete 100 work sessions

16. "Leaderboard Legend" - 250 pts
    Unlock: Reach top 10 in global leaderboard

17. "Local Champion" - 180 pts
    Unlock: Top rank in peer challenge group

18. "Consistency King" - 400 pts
    Unlock: 30-day streak on work sessions

19. "Rising Star" - 160 pts
    Unlock: Reach Silver tier

20. "Golden Guardian" - 200 pts
    Unlock: Reach Gold tier

21. "Platinum Elite" - 400 pts
    Unlock: Reach Platinum tier
```

---

## 3. REMINDER SYSTEM

### Reminder Types & Schedule

```
WORK SESSION REMINDERS:
- Send every 25 minutes during active work session (Pomodoro-style)
- Remind: "Time for a break! 2 min stretching recommended"

HYDRATION REMINDERS:
- Send every 2 hours (9 AM - 9 PM)
- Escalating messages:
  - 1st reminder: "Remember to drink water"
  - 2nd reminder: "You're halfway to your daily goal!"
  - 3rd reminder: "Just a bit more water to go!"

EXERCISE REMINDERS:
- Send daily at 6 PM
- Message: "Ready to move? Log a quick workout session"

SMOKING AVOIDANCE REMINDERS:
- Send 3x daily for smokers:
  - 9 AM: "You've got this! Stay strong today"
  - 2 PM: "Keeping up the great streak!"
  - 8 PM: "One more night of victory!"

ACHIEVEMENT REMINDERS:
- Trigger when close to milestone
- Example: "Only 2 more workouts to unlock Exercise Enthusiast!"
```

### Implementation Strategy
- Use `node-schedule` for cron jobs
- Store reminder preferences per user (disable/enable)
- Track reminder history (when sent, when acted on)
- Calculate impact: reminders → actions → points

---

## 4. REQUEST VALIDATION MIDDLEWARE

```typescript
// Pattern for all POST/PUT requests
validateRequest(ZodSchema) middleware
  ↓
Check req.body against schema
  ↓
If invalid: Return 400 with field errors
  ↓
If valid: Pass sanitized data to controller

Example:
POST /api/health-profile
Body: { height: "ABC" } (invalid)
Response: 400 { errors: { height: ["Expected number, received string"] } }
```

---

## 5. API ROUTING PLAN

### Base URL: `/api/v1`

### Health Profile Management
```
POST   /api/v1/health-profile           - Create health profile
GET    /api/v1/health-profile           - Get current user's profile
PUT    /api/v1/health-profile           - Update health profile
GET    /api/v1/health-profile/bmi       - Get BMI and category
```

### Work Sessions (Timers)
```
POST   /api/v1/work-sessions            - Start new work session
GET    /api/v1/work-sessions            - Get user's all sessions
GET    /api/v1/work-sessions/:id        - Get specific session
PUT    /api/v1/work-sessions/:id        - Update session (add breaks/hydration)
DELETE /api/v1/work-sessions/:id        - End/cancel session
```

### Activity Logging
```
POST   /api/v1/activities/hydration     - Log water intake
GET    /api/v1/activities/hydration     - Get hydration history
PUT    /api/v1/activities/hydration/:id - Update hydration log

POST   /api/v1/activities/exercise      - Log exercise
GET    /api/v1/activities/exercise      - Get exercise history
PUT    /api/v1/activities/exercise/:id  - Update exercise log

POST   /api/v1/activities/breaks        - Log break taken
GET    /api/v1/activities/breaks        - Get break history

POST   /api/v1/activities/smoking       - Log smoking/avoidance
GET    /api/v1/activities/smoking       - Get smoking history
```

### Achievements & Points
```
GET    /api/v1/achievements             - Get user's unlocked achievements
GET    /api/v1/achievements/available   - Get achievements to unlock
GET    /api/v1/points                   - Get user's total points
GET    /api/v1/streaks                  - Get all user's streaks
PUT    /api/v1/streaks/:type            - Update streak
```

### Leaderboards
```
GET    /api/v1/leaderboards/global      - Get global leaderboard (paginated)
GET    /api/v1/leaderboards/global/tier/:tier - Get leaderboard by tier
GET    /api/v1/leaderboards/global/:userId    - Get user's global rank

POST   /api/v1/leaderboards/local       - Create peer challenge group
GET    /api/v1/leaderboards/local/:groupId    - Get local leaderboard
GET    /api/v1/leaderboards/local/user/:groupId - Get user's rank in group
```

### Peer Challenges
```
POST   /api/v1/peer-challenges          - Create new challenge
GET    /api/v1/peer-challenges          - Get user's challenges
PUT    /api/v1/peer-challenges/:id      - Update challenge
POST   /api/v1/peer-challenges/:id/join - Join challenge
GET    /api/v1/peer-challenges/:id      - Get challenge details
```

### Reminders (Admin/Settings)
```
GET    /api/v1/reminders/schedule       - Get user's reminder settings
PUT    /api/v1/reminders/schedule       - Update reminder preferences
POST   /api/v1/reminders/test           - Send test reminder
```

---

## 6. UTILITY/SERVICE LAYER STRUCTURE

```
src/utils/
├── errorHandler.ts          (✓ Already created)
├── gameEngine.ts            (NEW)
│   ├── calculatePoints()
│   ├── awardAchievements()
│   ├── updateStreaks()
│   ├── updateLeaderboard()
│   └── determineTier()
├── reminderEngine.ts        (NEW)
│   ├── scheduleReminders()
│   ├── sendReminder()
│   └── trackReminderResponse()
├── validators.ts            (NEW)
│   ├── Custom validation helpers
│   └── Business rule validators
└── constants.ts             (NEW)
    ├── POINTS_CONFIG
    ├── ACHIEVEMENT_RULES
    ├── REMINDER_SCHEDULE
    └── TIER_THRESHOLDS
```

---

## 7. MIDDLEWARE LAYER

```
src/middleware/
├── errorMiddleware.ts       (✓ Already created)
├── authMiddleware.ts        (NEW)
│   ├── requireAuth() - Protect routes
│   └── extractUserId() - Get user from Clerk
├── validationMiddleware.ts  (NEW)
│   └── validateRequest(zodSchema)
└── corsMiddleware.ts        (Already in app.ts)
```

---

## 8. CONTROLLER LAYER PATTERN

```typescript
// Example pattern for all controllers

class HealthProfileController {
  // POST /api/v1/health-profile
  async createProfile(req, res, next) {
    try {
      const { userId } = req.auth; // From Clerk middleware
      const validatedData = req.body; // Already validated
      
      // Business logic
      // Save to DB
      // Award achievement if first profile
      
      sendSuccessResponse(res, 201, data, "Profile created");
    } catch (error) {
      next(error); // Pass to error middleware
    }
  }
  
  // Similar pattern for other methods
}

export default new HealthProfileController();
```

---

## 9. BUILD SEQUENCE (When You Say "Build")

1. **Constants & Config** - `src/config/constants.ts`
2. **Game Engine** - `src/utils/gameEngine.ts`
3. **Reminder Engine** - `src/utils/reminderEngine.ts`
4. **Auth Middleware** - `src/middleware/authMiddleware.ts`
5. **Validation Middleware** - `src/middleware/validationMiddleware.ts`
6. **Routes** - `src/routes/*.ts` (all route files)
7. **Controllers** - `src/controllers/*.ts` (all controller files)
8. **Update app.ts** - Wire all routes
9. **Integration** - Test everything together

---

## 10. KEY DECISIONS

✅ **Clerk Integration:** Using Clerk's `req.auth.userId` for authentication
✅ **Points Allocation:** Activity-based (each action = points)
✅ **Reminders:** Scheduled via `node-schedule` (server-side)
✅ **Streaks:** Calculated daily, stored in DB
✅ **Leaderboards:** Real-time updates via point changes
✅ **Validation:** All requests validated against Zod schemas
✅ **Error Handling:** Centralized middleware catches all errors

---

## 🎯 SUMMARY

This plan provides:
- 21 unique achievements with creative names
- Comprehensive points system for all activities
- Intelligent reminder scheduling
- Clean API with consistent patterns
- Type-safe validation
- Modular, scalable architecture

**Ready to build when you give the signal!**
