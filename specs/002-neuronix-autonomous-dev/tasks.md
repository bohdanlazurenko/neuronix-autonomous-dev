# Tasks: Neuronix - Autonomous Software Development System

**Input**: Design documents from `/specs/002-neuronix-autonomous-dev/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are included per constitution requirement (80% coverage minimum, TDD approach)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- Next.js 14 App Router structure
- `/app` for pages and API routes
- `/src` for business logic (agents, integrations, utilities)
- `/tests` for E2E and integration tests
- Colocated `__tests__` for unit tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 14 project with TypeScript in neuronix-autonomous-dev/ directory
- [x] T002 Install core dependencies (@anthropic-ai/sdk, @modelcontextprotocol/server-github, @modelcontextprotocol/server-filesystem, lucide-react)
- [x] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T004 [P] Configure Tailwind CSS 3.4.0 in tailwind.config.ts with dark theme
- [x] T005 [P] Setup ESLint and Prettier with pre-commit hooks (Husky) in .eslintrc.json and .prettierrc
- [x] T006 [P] Setup Jest 29 configuration in jest.config.js
- [x] T007 [P] Setup Playwright configuration in playwright.config.ts
- [x] T008 [P] Create .env.example with required environment variables (ANTHROPIC_API_KEY, GITHUB_TOKEN, GITHUB_OWNER)
- [x] T009 Create project directory structure (src/agents/, src/integrations/, src/lib/, app/components/, tests/e2e/, tests/integration/)
- [x] T010 [P] Create .gitignore with .env.local, node_modules/, .next/, coverage/
- [x] T011 [P] Setup GitHub workflow for CI/CD in .github/workflows/ci.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Create TypeScript types from contracts/types.ts in src/types/contracts.ts
- [x] T013 Implement SSE utilities (createEventStream, sendEvent, closeStream) in src/lib/sse.ts
- [x] T014 [P] Implement input validation utility (validateBrief, sanitizeInput) in src/lib/validation.ts
- [x] T015 [P] Implement error handling utilities (AppError, ErrorCode enum, handleError) in src/lib/errors.ts
- [x] T016 Create base agent interface (BaseAgent with execute method) in src/agents/base.ts
- [x] T017 Implement agent orchestrator skeleton (AgentOrchestrator class with workflow coordination) in src/lib/orchestrator.ts
- [x] T018 Setup Next.js root layout with dark theme in app/layout.tsx
- [x] T019 [P] Setup global Tailwind styles in app/globals.css
- [x] T020 Create health check API endpoint in app/api/ping/route.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Instant Project Creation from Brief (Priority: P1) 🎯 MVP

**Goal**: Users submit natural language briefs and receive complete deployed applications with repository URLs

**Independent Test**: Submit brief "Create a habit tracking app", wait for SSE stream completion, verify live app URL and GitHub repository URL are returned and accessible

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T021 [P] [US1] Contract test for POST /api/create endpoint in tests/integration/api-create.test.ts (verify SSE stream format, event types, progress values)
- [ ] T022 [P] [US1] Integration test for full brief-to-deployment workflow in tests/integration/full-workflow.test.ts (mock agents, verify orchestration)
- [ ] T023 [P] [US1] Unit test for brief validation in src/lib/__tests__/validation.test.ts (test min/max length, malicious content detection)

### Implementation for User Story 1

- [ ] T024 [P] [US1] Implement Product Manager Agent in src/agents/PMAgent.ts (analyzeBrief, generatePRD methods using Claude API)
- [ ] T025 [P] [US1] Implement Development Agent in src/agents/DevAgent.ts (generateCode method using Claude API with code generation prompts)
- [ ] T026 [P] [US1] Implement Integration Agent in src/agents/IntegrationAgent.ts (createRepository, deployToVercel methods using MCP)
- [ ] T027 [US1] Implement GitHub MCP client in src/integrations/GitHubMCP.ts (createRepo, commitFiles, getRepoUrl methods)
- [ ] T028 [US1] Implement agent orchestrator workflow in src/lib/orchestrator.ts (execute method coordinating PM → Dev → Integration agents)
- [ ] T029 [US1] Implement POST /api/create endpoint with SSE streaming in app/api/create/route.ts (validate brief, start orchestrator, stream progress events)
- [ ] T030 [US1] Add error handling with exponential backoff retry logic in src/lib/orchestrator.ts
- [ ] T031 [US1] Add request timeout (15 minutes max) and partial result handling in app/api/create/route.ts
- [ ] T032 [P] [US1] Create BriefForm component (textarea, submit button, character counter) in app/components/BriefForm.tsx
- [ ] T033 [P] [US1] Create ResultCard component (repo URL, deployment URL, copy buttons) in app/components/ResultCard.tsx
- [ ] T034 [US1] Implement main page with brief input form in app/page.tsx
- [ ] T035 [US1] Add WCAG 2.1 AA accessibility features (keyboard navigation, ARIA labels, proper focus management) to BriefForm and ResultCard

**Checkpoint**: At this point, User Story 1 should be fully functional - users can submit briefs and get deployed apps

---

## Phase 4: User Story 2 - Multi-Agent Intelligent Project Analysis (Priority: P1)

**Goal**: Specialized AI agents collaborate to analyze briefs, create PRDs, plans, and generate high-quality code

**Independent Test**: Submit ambiguous brief "Create a marketplace", verify PRD artifact is generated with reasonable assumptions documented, implementation plan lists all files, and generated code passes TypeScript validation

### Tests for User Story 2

- [ ] T036 [P] [US2] Unit test for PM Agent PRD generation in src/agents/__tests__/PMAgent.test.ts (verify PRD structure, feature extraction)
- [ ] T037 [P] [US2] Unit test for Dev Agent code generation in src/agents/__tests__/DevAgent.test.ts (verify syntax validation, file completeness)
- [ ] T038 [P] [US2] Integration test for agent handoff workflow in tests/integration/agent-workflow.test.ts (verify context passing between agents)

### Implementation for User Story 2

- [ ] T039 [US2] Enhance PM Agent with assumption documentation logic in src/agents/PMAgent.ts (detect ambiguity, document decisions in PRD)
- [ ] T040 [US2] Implement implementation plan generation in src/agents/PMAgent.ts (createImplementationPlan method listing all files)
- [ ] T041 [US2] Add syntax validation for generated code in src/agents/DevAgent.ts (run tsc --noEmit check on TypeScript files)
- [ ] T042 [US2] Implement agent failure handling with retry logic (max 3 retries with exponential backoff) in src/lib/orchestrator.ts
- [ ] T043 [US2] Add artifact streaming to UI (emit SSE events when PRD, plan, files are generated) in app/api/create/route.ts
- [ ] T044 [P] [US2] Create artifact viewer component in app/components/ArtifactViewer.tsx (display PRD, plan, file list with syntax highlighting)
- [ ] T045 [US2] Integrate artifact viewer into main page progress display in app/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users see intelligent analysis and quality code generation

---

## Phase 5: User Story 3 - Automatic Repository Creation and Deployment (Priority: P1)

**Goal**: System creates GitHub repositories with proper structure and deploys applications to live hosting with CI/CD

**Independent Test**: Complete project creation, verify GitHub repository exists with README and proper file structure, clone repository locally and run npm install && npm run dev successfully, access live deployment URL

### Tests for User Story 3

- [ ] T046 [P] [US3] Unit test for GitHub MCP integration in src/integrations/__tests__/GitHubMCP.test.ts (verify repo creation, file commits)
- [ ] T047 [P] [US3] Integration test for deployment workflow in tests/integration/deployment.test.ts (mock Vercel API, verify deployment triggers)
- [ ] T048 [P] [US3] Contract test for repository structure validation in tests/integration/repo-structure.test.ts (verify mandatory files exist)

### Implementation for User Story 3

- [ ] T049 [US3] Implement repository creation with proper .gitignore in src/integrations/GitHubMCP.ts (createRepo method with template .gitignore)
- [ ] T050 [US3] Implement multi-file commit logic in src/integrations/GitHubMCP.ts (commitFiles method batching files)
- [ ] T051 [US3] Add README generation with setup instructions in src/agents/DevAgent.ts (generateREADME method based on project type)
- [ ] T052 [US3] Implement Vercel deployment trigger in src/agents/IntegrationAgent.ts (deployToVercel method using Vercel API)
- [ ] T053 [US3] Add CI/CD configuration file generation (.github/workflows/ci.yml) in src/agents/DevAgent.ts
- [ ] T054 [US3] Implement deployment status polling (wait for "ready" status with 3-minute timeout) in src/agents/IntegrationAgent.ts
- [ ] T055 [US3] Add repository and deployment URL streaming to UI in app/api/create/route.ts (emit SSE events with URLs)
- [ ] T056 [US3] Update ResultCard component to show clone instructions and deployment status in app/components/ResultCard.tsx

**Checkpoint**: All P1 user stories complete - full end-to-end workflow functional

---

## Phase 6: User Story 4 - Real-Time Progress Streaming (Priority: P2)

**Goal**: Users see live, transparent updates about system progress including agent status and artifact generation

**Independent Test**: Submit brief, observe UI updates in real-time showing phase transitions (brief → PRD → code → deploy), see notifications when each artifact is created, verify error messages appear immediately if failure occurs

### Tests for User Story 4

- [ ] T057 [P] [US4] Unit test for SSE event formatting in src/lib/__tests__/sse.test.ts (verify event structure, timestamp format)
- [ ] T058 [P] [US4] Integration test for progress event sequencing in tests/integration/progress-events.test.ts (verify events fire in correct order)
- [ ] T059 [P] [US4] E2E test for real-time UI updates in tests/e2e/progress-streaming.spec.ts (Playwright test verifying UI updates without refresh)

### Implementation for User Story 4

- [ ] T060 [P] [US4] Create custom React hook for SSE consumption in src/hooks/useSSE.ts (connect to event stream, parse events, handle reconnection)
- [ ] T061 [P] [US4] Create ProgressFeed component (timeline view showing all events) in app/components/ProgressFeed.tsx
- [ ] T062 [US4] Implement progress state persistence (save to sessionStorage) in src/lib/progressPersistence.ts
- [ ] T063 [US4] Add progress state recovery on page refresh in app/page.tsx (restore from sessionStorage)
- [ ] T064 [US4] Implement estimated time remaining calculation in src/lib/orchestrator.ts (track phase durations, project completion time)
- [ ] T065 [US4] Add phase-specific progress messages to orchestrator in src/lib/orchestrator.ts (descriptive status for each agent)
- [ ] T066 [US4] Add error event handling with actionable error messages in app/components/ProgressFeed.tsx (show retry buttons, support links)
- [ ] T067 [US4] Integrate ProgressFeed component into main page in app/page.tsx
- [ ] T068 [US4] Add accessibility features to ProgressFeed (ARIA live region, screen reader announcements) in app/components/ProgressFeed.tsx

**Checkpoint**: User Story 4 complete - users have full transparency into system operations

---

## Phase 7: User Story 5 - Quick-Start Example Briefs (Priority: P3)

**Goal**: Pre-written example briefs for common projects that users can instantly try

**Independent Test**: Click "Habit Tracker" example button, verify brief text populates textarea, submit without modification, receive working habit tracker app with repository

### Tests for User Story 5

- [ ] T069 [P] [US5] Unit test for example brief loading in app/components/__tests__/ExampleBriefs.test.tsx (verify button clicks populate textarea)
- [ ] T070 [P] [US5] E2E test for example brief workflow in tests/e2e/example-briefs.spec.ts (click example, submit, verify result)

### Implementation for User Story 5

- [ ] T071 [P] [US5] Create example brief definitions in public/examples/briefs.json (Habit Tracker, Blog, Todo List, Landing Page)
- [ ] T072 [P] [US5] Create ExampleBriefs component (4-5 buttons with brief previews) in app/components/ExampleBriefs.tsx
- [ ] T073 [US5] Implement brief populating logic in BriefForm component (accept brief prop, populate on click) in app/components/BriefForm.tsx
- [ ] T074 [US5] Add example brief customization hint UI in app/components/ExampleBriefs.tsx (tooltip showing users can edit)
- [ ] T075 [US5] Integrate ExampleBriefs component into main page in app/page.tsx
- [ ] T076 [US5] Add keyboard navigation support to example buttons (arrow keys, Enter) in app/components/ExampleBriefs.tsx

**Checkpoint**: All user stories complete - full feature set implemented

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T077 [P] Create comprehensive README.md in project root (setup instructions, architecture overview, contribution guide)
- [ ] T078 [P] Add deployment guide documentation in docs/DEPLOYMENT.md (Vercel setup, environment variables)
- [ ] T079 [P] Create architecture documentation in docs/ARCHITECTURE.md (agent workflow diagram, data flow)
- [ ] T080 [P] Add JSDoc comments to all public functions and classes
- [ ] T081 [P] Run Lighthouse audit and optimize for ≥90 score (code splitting, image optimization, caching)
- [ ] T082 [P] Add bundle size analysis script in package.json ("npm run analyze")
- [ ] T083 [P] Implement performance monitoring (measure agent execution times, log slow operations) in src/lib/monitoring.ts
- [ ] T084 [P] Add security hardening (rate limiting, input sanitization, CORS configuration) in app/api/create/route.ts
- [ ] T085 [P] Create unit tests for utility functions in src/lib/__tests__/ (errors.test.ts, validation.test.ts)
- [ ] T086 Run E2E test for full workflow from quickstart.md instructions in tests/e2e/full-workflow.spec.ts
- [ ] T087 Verify 80% test coverage target with coverage report (npm run test:coverage)
- [ ] T088 [P] Add Russian language support for UI strings in src/lib/i18n.ts (brief form labels, progress messages)
- [ ] T089 [P] Create troubleshooting guide in docs/TROUBLESHOOTING.md (common errors, solutions)
- [ ] T090 Final code cleanup and refactoring (remove console.logs, fix linter warnings)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start after Foundational
  - User Story 2 (P1) can start after Foundational (independent of US1)
  - User Story 3 (P1) requires US1 orchestrator to be complete (depends on T028)
  - User Story 4 (P2) can start after Foundational (independent of US1-3)
  - User Story 5 (P3) requires BriefForm component from US1 (depends on T032)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core workflow implementation
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Enhances agent intelligence independently
- **User Story 3 (P1)**: Depends on US1 orchestrator (T028) - Extends workflow with deployment
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - UI enhancement, independent implementation
- **User Story 5 (P3)**: Depends on BriefForm from US1 (T032) - Adds convenience feature

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Unit tests (components, utilities) before integration
- Core agent logic before UI integration
- Story complete and independently testable before moving to next priority

### Parallel Opportunities

**Setup Phase (Phase 1)**:
```bash
# Can run simultaneously:
T003 (tsconfig), T004 (Tailwind), T005 (ESLint/Prettier), T006 (Jest), T007 (Playwright), T008 (.env.example), T010 (.gitignore), T011 (CI workflow)
```

**Foundational Phase (Phase 2)**:
```bash
# Can run simultaneously after T012:
T014 (validation), T015 (errors), T019 (global CSS), T020 (ping endpoint)
```

**User Story 1**:
```bash
# Tests in parallel:
T021, T022, T023

# Agents in parallel:
T024 (PMAgent), T025 (DevAgent), T026 (IntegrationAgent)

# UI components in parallel:
T032 (BriefForm), T033 (ResultCard)
```

**User Story 2**:
```bash
# Tests in parallel:
T036, T037, T038

# Implementation tasks build on US1, run sequentially
```

**User Story 3**:
```bash
# Tests in parallel:
T046, T047, T048

# Implementation extends US1 agents, mostly sequential
```

**User Story 4**:
```bash
# Tests in parallel:
T057, T058, T059

# Components in parallel:
T060 (useSSE hook), T061 (ProgressFeed)
```

**User Story 5**:
```bash
# Tests in parallel:
T069, T070

# Components in parallel:
T071 (briefs.json), T072 (ExampleBriefs)
```

**Polish Phase (Phase 8)**:
```bash
# Most tasks can run in parallel:
T077 (README), T078 (deployment docs), T079 (architecture docs), T080 (JSDoc), T081 (Lighthouse), T082 (bundle analysis), T083 (monitoring), T084 (security), T085 (unit tests), T088 (i18n), T089 (troubleshooting)
```

---

## Parallel Example: User Story 1 Core Implementation

```bash
# After tests pass, launch agent implementations in parallel:
Task T024: "Implement Product Manager Agent in src/agents/PMAgent.ts"
Task T025: "Implement Development Agent in src/agents/DevAgent.ts"
Task T026: "Implement Integration Agent in src/agents/IntegrationAgent.ts"

# Then launch UI components in parallel:
Task T032: "Create BriefForm component in app/components/BriefForm.tsx"
Task T033: "Create ResultCard component in app/components/ResultCard.tsx"

# Sequential tasks (dependencies):
Task T027: GitHub MCP (needed for T026)
Task T028: Orchestrator workflow (needs T024, T025, T026)
Task T029: API endpoint (needs T028)
Task T034: Main page (needs T032, T029)
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only - P1 Priority)

1. ✅ Complete Phase 1: Setup (~2 hours)
2. ✅ Complete Phase 2: Foundational (~3 hours) - **CRITICAL GATE**
3. ✅ Complete Phase 3: User Story 1 (~8 hours) - **Core workflow**
4. ✅ Complete Phase 4: User Story 2 (~4 hours) - **Agent intelligence**
5. ✅ Complete Phase 5: User Story 3 (~6 hours) - **Deployment**
6. **STOP and VALIDATE**: Test full workflow end-to-end
7. Deploy MVP to production for user testing

**MVP Total Time Estimate**: ~23 hours (~3 days)

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Project initialized, infrastructure ready
2. **+ User Story 1** → Users can submit briefs and get deployed apps (minimal intelligence)
3. **+ User Story 2** → Intelligent analysis, quality code (production-ready)
4. **+ User Story 3** → Full automation with GitHub + Vercel (complete P1 scope)
5. **+ User Story 4** → Real-time transparency (P2 - usability enhancement)
6. **+ User Story 5** → Example briefs (P3 - onboarding improvement)
7. **+ Polish** → Production-grade quality (docs, security, performance)

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

1. **Team completes Setup + Foundational together** (~5 hours)
2. **Once Foundational is done**:
   - **Developer A**: User Story 1 (core workflow)
   - **Developer B**: User Story 2 (agent intelligence) - starts after A has T028
   - **Developer C**: User Story 4 (progress streaming) - fully independent
3. **After User Story 1**:
   - **Developer A**: User Story 3 (deployment) - extends US1
   - **Developer B**: User Story 5 (examples) - after A completes T032
   - **Developer C**: Polish tasks (docs, tests)

**Parallel Total Time Estimate**: ~12-15 hours (~2 days with 3 developers)

---

## Task Summary

- **Total Tasks**: 90
- **Setup Tasks** (Phase 1): 11
- **Foundational Tasks** (Phase 2): 9
- **User Story 1** (P1 - Core): 15 tasks
- **User Story 2** (P1 - Intelligence): 10 tasks
- **User Story 3** (P1 - Deployment): 11 tasks
- **User Story 4** (P2 - Progress): 12 tasks
- **User Story 5** (P3 - Examples): 8 tasks
- **Polish Tasks** (Phase 8): 14 tasks
- **Parallel Opportunities**: 38 tasks marked [P]

---

## Constitution Compliance Checklist

- [x] **TypeScript Strict Mode**: T003 configures strict mode, all code uses strict types
- [x] **80% Test Coverage**: T021-T090 include comprehensive unit, integration, and E2E tests across all user stories
- [x] **TDD Approach**: Test tasks written BEFORE implementation tasks in every user story phase
- [x] **WCAG 2.1 AA**: T035, T068, T076 add accessibility features (keyboard nav, ARIA, screen readers)
- [x] **Performance Budgets**: T081-T083 implement Lighthouse audit, bundle analysis, performance monitoring
- [x] **React Best Practices**: All component tasks follow functional component pattern, custom hooks (T060)
- [x] **Code Quality**: T005 sets up linting/formatting, T080 adds JSDoc, T090 cleanup pass

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests MUST fail before implementing corresponding features (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Focus on MVP (P1 stories) first, then enhance with P2/P3
- Constitution compliance validated at multiple checkpoints
