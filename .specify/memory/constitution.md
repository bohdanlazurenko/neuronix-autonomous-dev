<!--```markdown

Sync Impact Report:<!--

Version: 0.0.0 → 1.0.0 (Initial constitution ratification)Sync Impact Report:

Added Principles:Version: 0.0.0 → 1.0.0 (Initial constitution ratification)

  - I. Type Safety & Code QualityAdded Principles:

  - II. Testing Standards (NON-NEGOTIABLE)  - I. Type Safety & Code Quality

  - III. Accessibility First  - II. Testing Standards (NON-NEGOTIABLE)

  - IV. Performance Requirements  - III. Accessibility First

  - V. User Experience Consistency  - IV. Performance Requirements

  - VI. React Best Practices  - V. User Experience Consistency

Added Sections:  - VI. React Best Practices

  - Technology StandardsAdded Sections:

  - Quality Gates  - Technology Standards

Templates Status:  - Quality Gates

  ✅ plan-template.md - Constitution Check section updated with principle validation checklistTemplates Status:

  ✅ spec-template.md - Added Accessibility Requirements and Performance Requirements sections  ✅ plan-template.md - Constitution Check section ready for principles validation

  ✅ tasks-template.md - Test-first workflow already present  ✅ spec-template.md - Requirements section aligned with UX and accessibility principles

Follow-up TODOs: None  ✅ tasks-template.md - Test-first workflow and task categorization ready

-->Follow-up TODOs: None

-->

# AI IT Company Web Application Constitution

# AI IT Company Web Application Constitution

## Core Principles

## Core Principles

### I. Type Safety & Code Quality

### I. Type Safety & Code Quality

**All code MUST be written in TypeScript with strict mode enabled.**

**All code MUST be written in TypeScript with strict mode enabled.**

- No use of `any` type except in explicitly documented edge cases with justification

- All functions MUST have explicit return type annotations- No use of `any` type except in explicitly documented edge cases with justification

- All component props MUST use TypeScript interfaces or types- All functions MUST have explicit return type annotations

- ESLint and Prettier MUST be configured and enforced in pre-commit hooks- All component props MUST use TypeScript interfaces or types

- Code coverage MUST be visible and tracked (minimum 80% for new code)- ESLint and Prettier MUST be configured and enforced in pre-commit hooks

- All imports MUST follow consistent ordering (external → internal → types → styles)- Code coverage MUST be visible and tracked (minimum 80% for new code)

- All imports MUST follow consistent ordering (external → internal → types → styles)

**Rationale**: Type safety prevents entire classes of bugs at compile time, improves

developer experience with autocomplete, and serves as living documentation. Strict**Rationale**: Type safety prevents entire classes of bugs at compile time, improves

typing reduces runtime errors and makes refactoring safer.developer experience with autocomplete, and serves as living documentation. Strict

typing reduces runtime errors and makes refactoring safer.

### II. Testing Standards (NON-NEGOTIABLE)

### II. Testing Standards (NON-NEGOTIABLE)

**Test-Driven Development is MANDATORY for all new features and bug fixes.**

**Test-Driven Development is MANDATORY for all new features and bug fixes.**

- Tests MUST be written BEFORE implementation (Red-Green-Refactor cycle)

- All tests MUST fail initially to verify they test the right behavior- Tests MUST be written BEFORE implementation (Red-Green-Refactor cycle)

- Every component MUST have unit tests covering all states and interactions- All tests MUST fail initially to verify they test the right behavior

- Every user journey MUST have integration/E2E tests- Every component MUST have unit tests covering all states and interactions

- All API endpoints MUST have contract tests validating request/response schemas- Every user journey MUST have integration/E2E tests

- Edge cases and error states MUST be explicitly tested- All API endpoints MUST have contract tests validating request/response schemas

- Test files MUST be colocated with source files or follow `__tests__` convention- Edge cases and error states MUST be explicitly tested

- Test files MUST be colocated with source files or follow `__tests__` convention

**Testing Framework Requirements**:

- Unit tests: Jest + React Testing Library**Testing Framework Requirements**:

- E2E tests: Playwright or Cypress- Unit tests: Jest + React Testing Library

- Visual regression: Chromatic or Percy (for UI components)- E2E tests: Playwright or Cypress

- Coverage threshold: 80% minimum for new code- Visual regression: Chromatic or Percy (for UI components)

- Coverage threshold: 80% minimum for new code

**Rationale**: TDD ensures code is testable by design, catches regressions early,

documents expected behavior, and gives confidence for refactoring. Testing user**Rationale**: TDD ensures code is testable by design, catches regressions early,

journeys ensures features work end-to-end from user perspective.documents expected behavior, and gives confidence for refactoring. Testing user

journeys ensures features work end-to-end from user perspective.

### III. Accessibility First

### III. Accessibility First

**All UI components and features MUST meet WCAG 2.1 Level AA standards.**

**All UI components and features MUST meet WCAG 2.1 Level AA standards.**

- Semantic HTML MUST be used (proper heading hierarchy, landmarks, form labels)

- All interactive elements MUST be keyboard accessible (proper focus management)- Semantic HTML MUST be used (proper heading hierarchy, landmarks, form labels)

- All non-text content MUST have text alternatives (alt text, aria-labels)- All interactive elements MUST be keyboard accessible (proper focus management)

- Color MUST NOT be the only means of conveying information- All non-text content MUST have text alternatives (alt text, aria-labels)

- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text- Color MUST NOT be the only means of conveying information

- All forms MUST have proper error messaging and validation feedback- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text

- Screen reader testing MUST be performed for all new user-facing features- All forms MUST have proper error messaging and validation feedback

- Automated accessibility testing MUST run in CI (axe-core, Pa11y)- Screen reader testing MUST be performed for all new user-facing features

- Automated accessibility testing MUST run in CI (axe-core, Pa11y)

**Rationale**: Accessibility is not optional - it's a legal requirement and moral

imperative. Building accessible features from the start is easier than retrofitting.**Rationale**: Accessibility is not optional - it's a legal requirement and moral

Accessible design benefits all users, not just those with disabilities.imperative. Building accessible features from the start is easier than retrofitting.

Accessible design benefits all users, not just those with disabilities.

### IV. Performance Requirements

### IV. Performance Requirements

**Application MUST meet the following performance budgets:**

**Application MUST meet the following performance budgets:**

- Initial page load (FCP): < 1.5 seconds on 3G connection

- Time to Interactive (TTI): < 3 seconds on 3G connection- Initial page load (FCP): < 1.5 seconds on 3G connection

- Largest Contentful Paint (LCP): < 2.5 seconds- Time to Interactive (TTI): < 3 seconds on 3G connection

- First Input Delay (FID): < 100ms- Largest Contentful Paint (LCP): < 2.5 seconds

- Cumulative Layout Shift (CLS): < 0.1- First Input Delay (FID): < 100ms

- JavaScript bundle size: < 200KB (gzipped) for main bundle- Cumulative Layout Shift (CLS): < 0.1

- Image optimization: All images MUST use modern formats (WebP/AVIF) with fallbacks- JavaScript bundle size: < 200KB (gzipped) for main bundle

- Code splitting: Routes MUST be lazy-loaded, components > 50KB MUST be split- Image optimization: All images MUST use modern formats (WebP/AVIF) with fallbacks

- Performance monitoring: Lighthouse CI MUST run on every PR (score ≥ 90)- Code splitting: Routes MUST be lazy-loaded, components > 50KB MUST be split

- Performance monitoring: Lighthouse CI MUST run on every PR (score ≥ 90)

**Optimization Requirements**:

- React.memo MUST be used for expensive components**Optimization Requirements**:

- useMemo/useCallback MUST be used for expensive computations/callbacks- React.memo MUST be used for expensive components

- Virtualization MUST be used for lists > 100 items- useMemo/useCallback MUST be used for expensive computations/callbacks

- Debouncing/throttling MUST be used for frequent events (scroll, resize, input)- Virtualization MUST be used for lists > 100 items

- Debouncing/throttling MUST be used for frequent events (scroll, resize, input)

**Rationale**: Performance directly impacts user experience, SEO, and business metrics.

Slow applications lose users. Performance budgets prevent performance regression.**Rationale**: Performance directly impacts user experience, SEO, and business metrics.

Slow applications lose users. Performance budgets prevent performance regression.

### V. User Experience Consistency

### V. User Experience Consistency

**All UI components MUST follow a consistent design system and interaction patterns.**

**All UI components MUST follow a consistent design system and interaction patterns.**

- Design tokens MUST be used for all styling (colors, spacing, typography, shadows)

- Components MUST be built from a shared component library (no one-off components)- Design tokens MUST be used for all styling (colors, spacing, typography, shadows)

- Loading states MUST be shown for all async operations (skeleton screens preferred)- Components MUST be built from a shared component library (no one-off components)

- Error states MUST provide clear messaging and recovery actions- Loading states MUST be shown for all async operations (skeleton screens preferred)

- Success feedback MUST be shown for user actions (toasts, inline messages)- Error states MUST provide clear messaging and recovery actions

- All interactions MUST provide immediate visual feedback (button states, hover effects)- Success feedback MUST be shown for user actions (toasts, inline messages)

- Forms MUST provide inline validation with clear error messages- All interactions MUST provide immediate visual feedback (button states, hover effects)

- Empty states MUST provide guidance on next actions- Forms MUST provide inline validation with clear error messages

- Animations MUST respect `prefers-reduced-motion` user preference- Empty states MUST provide guidance on next actions

- Responsive breakpoints: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)- Animations MUST respect `prefers-reduced-motion` user preference

- Responsive breakpoints: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)

**Rationale**: Consistency reduces cognitive load, builds user trust, accelerates

development, and makes the application feel polished and professional.**Rationale**: Consistency reduces cognitive load, builds user trust, accelerates

development, and makes the application feel polished and professional.

### VI. React Best Practices

### VI. React Best Practices

**All React code MUST follow modern patterns and best practices.**

**All React code MUST follow modern patterns and best practices.**

- Functional components ONLY (no class components for new code)

- Hooks MUST follow Rules of Hooks (no conditional hooks, exhaustive dependencies)- Functional components ONLY (no class components for new code)

- Custom hooks MUST be created for reusable stateful logic- Hooks MUST follow Rules of Hooks (no conditional hooks, exhaustive dependencies)

- Prop drilling > 2 levels MUST use Context API or state management library- Custom hooks MUST be created for reusable stateful logic

- Side effects MUST be in useEffect with proper cleanup- Prop drilling > 2 levels MUST use Context API or state management library

- Component file structure MUST be: imports → types → component → exports → styles- Side effects MUST be in useEffect with proper cleanup

- Components MUST be single responsibility (< 250 lines, extract smaller components)- Component file structure MUST be: imports → types → component → exports → styles

- Props MUST be destructured in function signature- Components MUST be single responsibility (< 250 lines, extract smaller components)

- Event handlers MUST follow naming convention: handle[Event] (e.g., handleClick)- Props MUST be destructured in function signature

- No inline functions in JSX for event handlers (performance)- Event handlers MUST follow naming convention: handle[Event] (e.g., handleClick)

- No inline functions in JSX for event handlers (performance)

**State Management**:

- Local state: useState for component-specific state**State Management**:

- Shared state: Context API for theme, auth, user preferences- Local state: useState for component-specific state

- Complex state: useReducer or Zustand/Redux Toolkit for complex state machines- Shared state: Context API for theme, auth, user preferences

- Server state: React Query or SWR for API data caching- Complex state: useReducer or Zustand/Redux Toolkit for complex state machines

- Server state: React Query or SWR for API data caching

**Rationale**: Consistent patterns improve code readability, maintainability, and

onboarding. Modern React patterns leverage hooks for cleaner, more composable code.**Rationale**: Consistent patterns improve code readability, maintainability, and

onboarding. Modern React patterns leverage hooks for cleaner, more composable code.

## Technology Standards

## Technology Standards

**Primary Stack**:

- Language: TypeScript 5.0+**Primary Stack**:

- Framework: React 18+ with Vite for build tooling- Language: TypeScript 5.0+

- Styling: CSS Modules or Styled Components (team decision required)- Framework: React 18+ with Vite for build tooling

- State Management: React Query for server state, Context/Zustand for client state- Styling: CSS Modules or Styled Components (team decision required)

- Routing: React Router v6+- State Management: React Query for server state, Context/Zustand for client state

- Forms: React Hook Form with Zod schema validation- Routing: React Router v6+

- Testing: Jest, React Testing Library, Playwright- Forms: React Hook Form with Zod schema validation

- Linting: ESLint with TypeScript, Prettier- Testing: Jest, React Testing Library, Playwright

- Git Hooks: Husky + lint-staged- Linting: ESLint with TypeScript, Prettier

- Git Hooks: Husky + lint-staged

**Dependencies Management**:

- All dependencies MUST be reviewed for security vulnerabilities (npm audit)**Dependencies Management**:

- Dependencies MUST be kept up-to-date (Dependabot or Renovate)- All dependencies MUST be reviewed for security vulnerabilities (npm audit)

- Bundle size impact MUST be considered before adding new dependencies- Dependencies MUST be kept up-to-date (Dependabot or Renovate)

- Prefer native browser APIs over libraries when possible- Bundle size impact MUST be considered before adding new dependencies

- Prefer native browser APIs over libraries when possible

**Environment Configuration**:

- Environment variables MUST use VITE_ prefix**Environment Configuration**:

- Secrets MUST NEVER be committed to repository- Environment variables MUST use VITE_ prefix

- .env.example MUST be maintained with all required variables documented- Secrets MUST NEVER be committed to repository

- .env.example MUST be maintained with all required variables documented

## Quality Gates

## Quality Gates

**All code changes MUST pass the following gates before merging:**

**All code changes MUST pass the following gates before merging:**

1. **Code Review**: At least one approval from team member required

2. **Type Check**: `tsc --noEmit` MUST pass with zero errors1. **Code Review**: At least one approval from team member required

3. **Linting**: ESLint MUST pass with zero errors (warnings allowed with justification)2. **Type Check**: `tsc --noEmit` MUST pass with zero errors

4. **Tests**: All tests MUST pass, coverage MUST meet minimum threshold3. **Linting**: ESLint MUST pass with zero errors (warnings allowed with justification)

5. **Accessibility**: Automated a11y tests MUST pass4. **Tests**: All tests MUST pass, coverage MUST meet minimum threshold

6. **Performance**: Lighthouse CI score MUST be ≥ 905. **Accessibility**: Automated a11y tests MUST pass

7. **Build**: Production build MUST succeed without errors6. **Performance**: Lighthouse CI score MUST be ≥ 90

8. **Visual Review**: Screenshots/videos for UI changes MUST be provided7. **Build**: Production build MUST succeed without errors

8. **Visual Review**: Screenshots/videos for UI changes MUST be provided

**Branch Protection**:

- Main branch MUST require PR reviews**Branch Protection**:

- CI checks MUST pass before merge- Main branch MUST require PR reviews

- Force pushes MUST be disabled on main branch- CI checks MUST pass before merge

- Force pushes MUST be disabled on main branch

**Deployment**:

- Staging deployment MUST occur automatically on PR creation**Deployment**:

- Production deployment MUST require manual approval- Staging deployment MUST occur automatically on PR creation

- Rollback procedure MUST be documented and tested- Production deployment MUST require manual approval

- Rollback procedure MUST be documented and tested

## Governance

## Governance

**This constitution supersedes all other development practices and guidelines.**

**This constitution supersedes all other development practices and guidelines.**

**Amendment Procedure**:

- Amendments MUST be proposed via pull request to constitution.md**Amendment Procedure**:

- Amendments MUST include rationale and impact analysis- Amendments MUST be proposed via pull request to constitution.md

- Major changes (new principles, removed principles) require team consensus- Amendments MUST include rationale and impact analysis

- Version MUST be incremented following semantic versioning:- Major changes (new principles, removed principles) require team consensus

  - MAJOR: Backward incompatible governance/principle removals or redefinitions- Version MUST be incremented following semantic versioning:

  - MINOR: New principle/section added or materially expanded guidance  - MAJOR: Backward incompatible governance/principle removals or redefinitions

  - PATCH: Clarifications, wording improvements, typo fixes  - MINOR: New principle/section added or materially expanded guidance

  - PATCH: Clarifications, wording improvements, typo fixes

**Compliance Review**:

- All pull requests MUST verify compliance with constitution principles**Compliance Review**:

- Architecture Decision Records (ADRs) MUST reference constitution when making- All pull requests MUST verify compliance with constitution principles

  significant architectural choices- Architecture Decision Records (ADRs) MUST reference constitution when making

- Violations MUST be justified in PR description and approved by team lead  significant architectural choices

- Constitution compliance MUST be part of code review checklist- Violations MUST be justified in PR description and approved by team lead

- Constitution compliance MUST be part of code review checklist

**Enforcement**:

- Automated checks MUST enforce type safety, testing, accessibility, and performance**Enforcement**:

- Manual review MUST verify UX consistency and React best practices- Automated checks MUST enforce type safety, testing, accessibility, and performance

- Team retrospectives MUST review constitution effectiveness quarterly- Manual review MUST verify UX consistency and React best practices

- Team retrospectives MUST review constitution effectiveness quarterly

**Version**: 1.0.0 | **Ratified**: 2025-10-18 | **Last Amended**: 2025-10-18

**Version**: 1.0.0 | **Ratified**: 2025-10-18 | **Last Amended**: 2025-10-18

```
