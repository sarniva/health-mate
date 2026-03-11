# Agent Guidelines for Health-Mate

This document provides guidelines for AI agents working on the Health-Mate "Wellness Nudge" project.

## Project Overview

Health-Mate is a gamified wellness platform that:
- Tracks user health metrics (BMI, lifestyle habits)
- Reminds users for micro-breaks, hydration, and exercise
- Features global leaderboards (Bronze, Silver, Gold tiers) and local peer challenges
- Uses work timers with gamification mechanics

**Architecture:** Monorepo with `backend/` (Node.js/Express) and `mobile/` (frontend - empty, to be built)

---

## Build, Lint & Test Commands

### Backend Commands

```bash
# Install dependencies
bun install

# Development (hot reload)
bun run dev

# Production start
bun start

# Build
bun run build
```

**Note:** Bun is the JavaScript runtime used (faster than Node.js). All commands must use `bun` instead of `npm`.

### Running Tests
- **Current Status:** No test framework configured yet
- **Recommended Setup:** Use Bun's built-in test runner or Vitest for BDD-style tests
- When tests are added, structure as: `src/**/__tests__/**/*.test.ts` or `src/**/*.test.ts`
- Run single test: `bun test src/path/to/file.test.ts`
- Run all tests: `bun test`

### Code Quality
- **Linting:** No ESLint config yet - recommend adding when building features
- **Formatting:** No Prettier config - recommend Prettier with 2-space indentation
- **Type Checking:** Built into Bun - strict TypeScript already enabled in `tsconfig.json`

---

## Code Style Guidelines

### TypeScript & Strict Mode

✅ **Enabled (tsconfig.json):**
- `strict: true` - All strict type checking enabled
- `noUncheckedIndexedAccess: true` - Prevent unsafe index access
- `noImplicitOverride: true` - Force override keyword when overriding methods
- `noFallthroughCasesInSwitch: true` - Prevent switch case fallthrough

✅ **Relaxed for development:**
- `noUnusedLocals: false` - Allow unused variables (enable when code matures)
- `noUnusedParameters: false` - Allow unused params (enable when code matures)

### Imports & Module System

```typescript
// ✅ CORRECT: ESNext modules with named imports
import express, { type Request, type Response } from "express";
import mongoose, { Schema, type Document } from "mongoose";

// ✅ Import types explicitly with 'type' keyword
import type { IUser } from "./models/User";

// ❌ AVOID: Default imports for utilities
import utils from "./utils"; // Don't do this

// ❌ AVOID: Wildcard imports
import * as all from "./helpers";
```

**Rule:** Use named imports when possible. Use `type` keyword for type-only imports.

### File Structure & Naming

```
backend/
├── src/
│   ├── app.ts              # Express app initialization
│   ├── config/             # Configuration files
│   │   └── database.ts     # MongoDB connection
│   ├── models/             # Mongoose schemas & types
│   │   └── User.ts         # Schema + Interface
│   ├── controllers/        # Route handlers
│   │   └── userController.ts
│   ├── routes/             # Route definitions
│   │   └── userRoutes.ts
│   ├── middleware/         # Express middleware
│   │   └── authMiddleware.ts
│   ├── utils/              # Utility functions
│   │   └── validators.ts
│   └── scripts/            # One-off scripts (migrations, seeds)
├── index.ts                # Server entry point
└── tsconfig.json
```

**Naming Conventions:**
- **Files:** `camelCase.ts` for utilities, `PascalCase.ts` for models/schemas
- **Functions:** `camelCase` - e.g., `calculateBMI()`, `validateEmail()`
- **Classes/Interfaces:** `PascalCase` - e.g., `UserController`, `IUser`
- **Constants:** `UPPER_SNAKE_CASE` - e.g., `DEFAULT_PORT`, `BMI_CATEGORIES`
- **Database fields:** `camelCase` - e.g., `clerkId`, `createdAt`

### Type Definitions & Interfaces

```typescript
// ✅ CORRECT: Define interface before schema
export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Generic Schema typing
const UserSchema = new Schema<IUser>({ /* ... */ });

// ✅ Export both types and models
export const User = mongoose.model("User", UserSchema);
export type UserDocument = IUser;
```

### Formatting & Spacing

```typescript
// ✅ 2-space indentation (Bun default)
const config = {
  key: "value",
  nested: {
    prop: "data"
  }
};

// ✅ Space around operators
const bmi = weight / (height * height);

// ✅ No trailing semicolons optional but consistent
// ✅ String literals: use double quotes by convention
const message = "User created successfully";
```

### Error Handling & Validation

```typescript
// ✅ CORRECT: Explicit error handling with try-catch
try {
  await mongoose.connect(mongoUri);
  console.log("DB connected successfully");
} catch (error) {
  console.error("DB connection failure:", error);
  process.exit(1);
}

// ✅ Validate env vars at startup
if (!process.env.DB_URI) {
  throw new Error("DB_URI is not set");
}

// ✅ Type-guard error messages
const errorMessage = error instanceof Error 
  ? error.message 
  : "Unknown error occurred";
```

### Environment Variables

- **Required for backend:** `PORT`, `DB_URI`
- **File:** `.env` (git-ignored, don't commit credentials)
- **Access:** `process.env.KEY`
- **Validation:** Check at module import/startup, fail fast with descriptive errors

### Database (MongoDB + Mongoose)

```typescript
// ✅ Always use schema generics
const schema = new Schema<IUser>({ /* ... */ });

// ✅ Timestamps helper
{ timestamps: true } // Auto-adds createdAt, updatedAt

// ✅ Unique + sparse for optional fields
{ type: String, unique: true, sparse: true }

// ✅ Trim strings by default
{ type: String, trim: true }

// ✅ Lowercase emails
{ type: String, lowercase: true }
```

### Comments & Documentation

```typescript
// ✅ Use JSDoc for functions
/**
 * Calculate BMI from weight and height
 * @param weight - Weight in kg
 * @param height - Height in meters
 * @returns BMI value
 */
export function calculateBMI(weight: number, height: number): number {
  return weight / (height * height);
}

// ✅ Inline comments for complex logic
// Bun uses TypeScript directly, no transpilation needed
```

---

## Development Workflow

### Before Making Changes
1. Create a feature branch: `git checkout -b feature/feature-name`
2. Write code following guidelines above
3. Test locally: `bun run dev`
4. Commit with clear messages: `feat: add user registration` or `fix: email validation`

### Adding New Features
- Create models in `src/models/`
- Create controllers in `src/controllers/`
- Create routes in `src/routes/`
- Wire routes in `src/app.ts`

### Key Decisions to Make (Later)
- Testing framework (Bun's native or Vitest)
- Error handling middleware (centralized error class)
- Validation library (Zod, Joi, or manual)
- Authentication (Clerk already partially integrated)
- Logging library (Winston, Pino)

---

## Technology Stack

- **Runtime:** Bun v1.3.5+ (ESNext, all-in-one JavaScript runtime)
- **Server:** Express 5.2.1
- **Database:** MongoDB + Mongoose 9.3.0
- **Language:** TypeScript 5+ (strict mode)
- **Auth:** Clerk (via `clerkId` in User schema)

---

## Notes for Agents

1. **Bun, not Node:** All commands use `bun`, not `npm` or `yarn`
2. **Type safety first:** Leverage strict TypeScript - design types before implementation
3. **Modular structure:** Keep models, controllers, routes separated
4. **Error handling:** Always wrap async operations in try-catch, validate early
5. **Environment:** Secrets go in `.env`, validate at startup
6. **Mobile frontend:** Empty directory - will be built after backend is feature-complete
7. **No custom rules yet:** Follow standard TypeScript + Express best practices
