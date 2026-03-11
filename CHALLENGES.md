# Challenges & Bugs Encountered

## 1. **Clerk → JWT Migration**
**Problem:** Initially implemented Clerk for authentication, but it added unnecessary complexity and vendor lock-in.

**Solution:** Migrated to JWT + bcrypt for self-managed authentication:
- Removed `@clerk/express` dependency
- Implemented custom JWT token generation/verification
- Added bcrypt password hashing with pre-save hook
- Updated all middleware to use JWT instead of Clerk
- **Result:** Simpler, lighter, fully controlled authentication ✓

---

## 2. **Mongoose Pre-Save Hook Issue**
**Problem:** Password hashing pre-save hook was calling `next()` parameter, causing incompatibility with Mongoose 9.3.

**Solution:** 
- Removed `next()` parameter call from async pre-save hook
- Mongoose 9.3 handles async hooks differently than older versions
- Hook now completes naturally without next callback
- **Result:** Password hashing works correctly ✓

---

## 3. **Zod Date String Parsing**
**Problem:** `z.date()` doesn't automatically parse ISO 8601 date strings from JSON requests, causing validation failures.

**Solution:**
- Replaced `z.date()` with `z.coerce.date()` across all schemas
- Applied to: Activity, WorkSession, HealthProfile models
- Now accepts both Date objects and ISO date strings
- **Result:** Flexible date input handling ✓

---

## 4. **Achievement Badge Type Enum Mismatch**
**Problem:** Achievement model enum had 10 values, but `ACHIEVEMENTS_CONFIG` constants defined 21 achievement types. Caused validation errors when awarding achievements.

**Solution:**
- Updated Achievement model enum to include all 21 badge types
- Aligned with constants: `first_steps`, `kickstarter`, `water_master`, `smoking_slayer`, etc.
- Fixed: `badgeType: 'first_steps' is not a valid enum value` error
- **Result:** All achievements can be awarded correctly ✓

---

## 5. **Request Body Validation vs JWT Extraction**
**Problem:** Zod schemas required `userId` in request body, but controller extracted it from JWT token. Caused "Invalid request body" errors.

**Solution:**
- Made `userId` optional in all request schemas
- Schemas now accept data without userId (extracted from JWT by controller)
- Applied to: HealthProfile, Activity, WorkSession, Achievement models
- **Result:** Cleaner API requests, token-based user identification ✓

---

## 6. **Missing Optional Field Defaults**
**Problem:** Activity and WorkSession endpoints failed because required fields weren't set when not provided in requests.

**Solution:**
- Made `date` optional in activity schemas (defaults to current date)
- Made `sessionId` optional for break logging (allows manual breaks)
- Set `workDuration` default to `duration` in controller
- **Result:** Flexible input, sensible defaults ✓

---

## Key Learnings

- **JWT + bcrypt > Clerk** for control and simplicity
- **z.coerce.date()** over z.date() for API flexibility  
- **Optional request fields** with JWT extraction is cleaner UX
- **Enum mismatches** between models and configs cause runtime errors
- **Mongoose 9.3** has different async hook behavior than older versions

All issues resolved. API fully functional with 38+ endpoints tested ✓
