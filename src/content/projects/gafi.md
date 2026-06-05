---
title: "GaFi"
description: "A gamified personal finance app that turns budgeting into a rewarding experience. Built with React Native and real-time Supabase backend."
tags: ["React Native", "Expo", "Supabase", "TypeScript", "Gamification"]
impact: "Full-stack mobile app — from concept to production"
role: "Full-Stack Developer"
order: 1
featured: true
# thumbnail: "/images/projects/gafi-thumb.webp"

challenge: |
  Personal finance apps are notoriously boring. Users download them, set up a budget once,
  and never return. The core challenge was designing a system that makes daily financial
  tracking feel rewarding rather than punishing — without trivializing real money decisions.

architecture: |
  The app is built on a React Native + Expo foundation for cross-platform delivery,
  with Supabase providing authentication, real-time database sync, and edge functions
  for gamification logic. The architecture separates the financial engine (pure calculations)
  from the gamification layer (XP, achievements, streaks) so each can evolve independently.

keyDecisions:
  - "Chose Supabase over Firebase for its PostgreSQL foundation — needed complex relational queries for financial reporting that NoSQL couldn't cleanly support"
  - "Implemented offline-first with optimistic updates — financial tracking must work without connectivity"
  - "Designed the gamification as a decoupled event system — financial actions emit events, the game engine consumes them independently"

results:
  - "Fully functional cross-platform app (iOS + Android)"
  - "Real-time budget sync across devices"
  - "Gamification system with XP, levels, and achievement tracking"
---

## Overview

GaFi reimagines personal finance management through gamification. Instead of spreadsheets and guilt,
users earn XP for staying on budget, unlock achievements for financial milestones, and maintain
streaks for consistent tracking habits.

## Process Highlights

### Financial Engine
The core financial logic is isolated into a pure TypeScript module with zero side effects.
Budget calculations, category allocations, and spending analysis are all deterministic functions
that can be unit-tested in isolation.

### Gamification Layer
The game engine operates as an event-driven system. When a user logs an expense or hits a budget
target, the financial engine emits a typed event. The gamification layer consumes these events
and applies rules (XP awards, achievement checks, streak updates) without knowledge of the
underlying financial logic.

### Real-time Sync
Supabase's real-time subscriptions power cross-device sync. When a user logs an expense on their
phone, their tablet's dashboard updates instantly. The optimistic update pattern ensures the UI
feels snappy even on slow connections.
