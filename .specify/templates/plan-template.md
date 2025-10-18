# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.0+ (strict mode enabled)
**Framework**: React 18+ with Vite
**Primary Dependencies**: [e.g., React Router, React Query, Zod, React Hook Form or NEEDS CLARIFICATION]  
**Styling**: [CSS Modules / Styled Components - NEEDS TEAM DECISION]
**State Management**: React Query (server state) + [Context API / Zustand for client state - NEEDS CLARIFICATION]
**Testing**: Jest + React Testing Library (unit), Playwright (E2E)
**Storage**: [if applicable, e.g., localStorage, IndexedDB, API backend or N/A]  
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: web (frontend application)
**Performance Goals**: FCP <1.5s, TTI <3s, LCP <2.5s, bundle <200KB (gzipped)
**Constraints**: WCAG 2.1 AA compliance, 80% test coverage, Lighthouse score ≥90
**Scale/Scope**: [e.g., number of routes, components, expected users or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with all principles from `.specify/memory/constitution.md`:

- [ ] **Type Safety & Code Quality**: TypeScript strict mode enabled, no `any` types, ESLint/Prettier configured
- [ ] **Testing Standards**: TDD approach planned, test files identified, coverage targets set (≥80%)
- [ ] **Accessibility First**: WCAG 2.1 AA compliance planned, semantic HTML, keyboard navigation, screen reader testing
- [ ] **Performance Requirements**: Performance budgets defined (FCP <1.5s, LCP <2.5s, bundle <200KB), optimization strategy outlined
- [ ] **UX Consistency**: Design tokens/component library planned, loading/error/empty states designed, responsive breakpoints defined
- [ ] **React Best Practices**: Functional components, proper hooks usage, state management strategy chosen, file structure defined

**Violations Requiring Justification**:
[List any principle violations with rationale and approval]

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

