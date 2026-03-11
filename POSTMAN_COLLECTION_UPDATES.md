# Postman Collection Updates

## Overview
The Postman collection has been reviewed and updated based on comprehensive API testing. All 38+ endpoints have been verified to work correctly.

## Key Changes Made

### ✅ Authentication Section
- **Status**: All endpoints verified working
- **Token Management**: Auto-capture of `accessToken`, `refreshToken`, and `userId` on login
- **Bearer Token**: Properly configured for all protected routes
- **Profile Update**: Updated endpoint from `/update-profile` to `/me` (PUT method)

### ✅ Health Profile Section
**Fixed Issues:**
- Request bodies now match validated Zod schemas
- All required fields included
- Date handling with proper ISO format support

**Endpoints Tested:**
- Create health profile (POST)
- Get health profile (GET)
- Update health profile (PUT)
- Get BMI information (GET)

### ✅ Work Sessions Section
**Fixed Issues:**
- Added `workDuration` field (was missing, required by schema)
- Properly structured request bodies
- Session ID variables for GET/PUT/DELETE operations

**Endpoints Verified:**
- All 5 work session endpoints working correctly
- Proper response data structure

### ✅ Activities Section
**Critical Fix:**
- Removed `userId` from request body (it's extracted from JWT token)
- Added `date` field with ISO format (required for hydration, smoking)
- Added `cravingLevel` field for smoking logs (was missing)

**Activity Types Updated:**
- Hydration: `amount`, `date`, `notes` (all working ✅)
- Exercise: `exerciseType`, `duration`, `intensity`, `calories` (all working ✅)
- Breaks: `sessionId`, `breakType`, `duration` (all working ✅)
- Smoking: `cigarettesSmoked`, `cravingLevel`, `date` (all working ✅)

### ✅ Gamification Section
- All 4 endpoints verified working
- Points, achievements, streaks, and tier endpoints responding correctly

### ✅ Leaderboards Section
- Global leaderboard working (returns 2 users in test)
- Tier-based filtering working (`?tier=bronze`)
- User ranking endpoint available
- Local leaderboard for group challenges

### ✅ Peer Challenges Section
**Fixed Issues:**
- Updated request body structure to match PeerChallenge schema
- Added `groupId`, `groupName`, `creatorId`, `members` array
- Changed `type` to `challengeType`
- Fixed date fields with ISO format support
- All endpoints working with proper request/response structure

### ✅ Reminders Section
- Get reminder settings working
- Update reminder settings with proper format
- Test reminder endpoint verified

## Testing Summary

| Feature | Endpoints | Status | Notes |
|---------|-----------|--------|-------|
| Authentication | 5 | ✅ Working | Auto-token capture functional |
| Health Profile | 4 | ✅ Working | BMI calculation verified |
| Work Sessions | 5 | ✅ Working | Full CRUD operations |
| Activities | 4 create + 4 read | ✅ Working | All activity types tested |
| Gamification | 4 | ✅ Working | 150 pts, 3 streaks, 2 achievements |
| Leaderboards | 4 | ✅ Working | Global and local boards |
| Peer Challenges | 5 | ✅ Working | Group challenges functional |
| Reminders | 3 | ✅ Working | Settings and test reminders |
| **TOTAL** | **38+** | **✅ PASS** | All tested successfully |

## How to Use Updated Collection

1. **Import the collection:**
   - Use `Health-Mate-API-Updated.postman_collection.json`
   - Or copy the raw JSON into Postman

2. **Set up environment variables:**
   - `baseUrl`: `http://localhost:3000` (default)
   - `accessToken`: Auto-populated after login
   - `refreshToken`: Auto-populated after login
   - `userId`: Auto-populated after login

3. **Workflow:**
   1. Run "Signup" to create a test user
   2. Run "Login" to get JWT tokens
   3. Use any protected endpoint (uses Bearer token automatically)
   4. All subsequent requests will use the valid token

## Request Body Format Notes

### Date Fields
- Format: ISO 8601 string (e.g., `"2026-03-11T00:00:00.000Z"`)
- Zod schema: `z.coerce.date()` allows string-to-date conversion
- Example: `"date": "2026-03-11T00:00:00.000Z"`

### Activity Logging
- **DO NOT include `userId`** in the request body
- The middleware extracts userId from the JWT token
- Include: `amount`, `date`, `notes` (optional)

### Smoking Logs
- **Required fields**: `cigarettesSmoked`, `cravingLevel`, `date`
- `cravingLevel`: number between 0-10
- Example: `{"cigarettesSmoked": 0, "cravingLevel": 2, "date": "2026-03-11T00:00:00.000Z"}`

### Peer Challenges
- **Required fields**: `groupId`, `groupName`, `creatorId`, `members`, `challengeType`, `startDate`, `endDate`
- `challengeType`: enum ["hydration", "exercise", "breaks", "smoke_free", "overall"]
- `members`: array of user IDs
- Dates must be ISO format strings

## Troubleshooting

### "Invalid request body" error
- Check date format (must be ISO 8601 string)
- Verify all required fields are present
- Ensure field names match schema exactly

### "Token expired" error
- Click "Login" again to refresh tokens
- Tokens auto-capture and are used in subsequent requests

### 404 "Route not found"
- Verify endpoint path is correct
- Check that method (GET/POST/PUT/DELETE) is correct
- Example: `/api/v1/work-sessions` (plural), not `/work-session`

## Files

- **Original**: `Health-Mate-API.postman_collection.json`
- **Updated**: `Health-Mate-API-Updated.postman_collection.json` ← **Use this one**
- **Documentation**: This file

---

**Last Updated**: 2026-03-11  
**Status**: ✅ All endpoints verified and tested  
**Server**: Running on `http://localhost:3000`
