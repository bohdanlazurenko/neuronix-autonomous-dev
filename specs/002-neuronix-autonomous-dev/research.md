# Research & Technical Decisions: Neuronix Autonomous Development System

**Created**: 2025-10-18  
**Phase**: 0 - Outline & Research  
**Purpose**: Resolve technical unknowns and establish best practices for implementation

## Overview

This document captures research findings and technical decisions for building Neuronix, an autonomous software development system that converts natural language briefs into deployed applications using AI agents.

## Key Technical Decisions

### 1. AI Agent Framework: Claude Agent SDK

**Decision**: Use Anthropic's Claude Agent SDK with Claude Sonnet 4.5 model for all AI agents

**Rationale**:
- **Superior code generation**: Claude Sonnet 4.5 excels at generating production-ready code with proper structure
- **Function calling**: Native support for tools and function calling enables MCP integration
- **Context window**: 200K tokens allows processing large codebases and complex briefs
- **Streaming support**: Real-time token streaming for progress updates via SSE
- **TypeScript SDK**: First-class TypeScript support aligns with our tech stack

**Alternatives Considered**:
- **OpenAI GPT-4**: Less reliable for structured code generation, weaker function calling
- **Google Gemini**: Limited availability, less mature SDK ecosystem
- **Local models (Llama, Mistral)**: Insufficient code generation quality, high infrastructure cost

**Best Practices**:
- Use system prompts to enforce strict JSON output format
- Set max_tokens appropriately: 8192 for PRD, 16000 for code generation
- Implement retry logic with exponential backoff for API failures
- Cache responses when possible to reduce API costs

---

### 2. Model Context Protocol (MCP) for Integrations

**Decision**: Use MCP servers (@modelcontextprotocol/server-github, @modelcontextprotocol/server-filesystem) for external integrations

**Rationale**:
- **Standardized protocol**: MCP provides uniform interface for tools/integrations
- **AI-native**: Designed specifically for AI agents to interact with external systems
- **Official servers**: GitHub and filesystem servers maintained by Anthropic
- **Composability**: Multiple MCP servers can be used simultaneously
- **Security**: Proper credential isolation and access control

**Alternatives Considered**:
- **Direct API calls**: More boilerplate, harder to maintain, no AI optimization
- **Custom tool implementations**: Reinventing the wheel, less maintainable
- **Third-party SDKs**: Not AI-optimized, varying quality

**Best Practices**:
- Initialize MCP clients once and reuse across agent calls
- Configure MCP servers with minimal required permissions
- Use environment variables for sensitive credentials (GitHub tokens)
- Implement proper error handling for MCP server failures

---

### 3. Real-Time Communication: Server-Sent Events (SSE)

**Decision**: Use Server-Sent Events for streaming progress updates from backend to frontend

**Rationale**:
- **Unidirectional**: Perfect fit for status updates (server → client only)
- **Native browser support**: No additional client libraries needed
- **Automatic reconnection**: Built-in reconnection logic in EventSource API
- **HTTP/1.1 compatible**: Works with standard HTTP infrastructure
- **Simple implementation**: Easier than WebSockets for one-way communication

**Alternatives Considered**:
- **WebSockets**: Overkill for unidirectional updates, more complex setup
- **Long polling**: Inefficient, higher latency, more server load
- **GraphQL subscriptions**: Unnecessary complexity for simple progress streaming

**Best Practices**:
- Send heartbeat events every 15 seconds to keep connection alive
- Use `data:` prefix for event payloads, `event:` for event types
- Implement proper error boundaries and reconnection logic on client
- Close SSE connection explicitly when processing completes
- Handle browser connection limits (6 per domain)

---

### 4. Frontend Framework: Next.js 14 with App Router

**Decision**: Use Next.js 14 with App Router for full-stack React application

**Rationale**:
- **App Router**: Modern React Server Components architecture
- **API Routes**: Built-in API handling without separate backend
- **TypeScript**: First-class TypeScript support out of the box
- **Performance**: Automatic code splitting, image optimization, caching
- **Developer Experience**: Hot reload, error overlays, built-in linting
- **Deployment**: Optimized for Vercel (instant deployment)

**Alternatives Considered**:
- **Vite + Express**: Requires separate backend setup, more configuration
- **Create React App**: Deprecated, no SSR, poor performance
- **Remix**: Less mature ecosystem, steeper learning curve

**Best Practices**:
- Use Server Components for static content, Client Components for interactivity
- Implement proper error boundaries (`error.tsx`, `not-found.tsx`)
- Use Next.js Image component for optimized image loading
- Configure Tailwind CSS via `tailwind.config.ts`
- Use `middleware.ts` for request validation if needed

---

### 5. Styling: Tailwind CSS with Dark Theme

**Decision**: Use Tailwind CSS 3.4.0 for styling with dark theme (bg-gray-900)

**Rationale**:
- **Utility-first**: Rapid UI development without context switching
- **Consistency**: Design tokens enforced via configuration
- **Performance**: Purges unused CSS in production
- **Dark mode**: Built-in dark mode support via `dark:` prefix
- **Responsive**: Mobile-first responsive design utilities

**Alternatives Considered**:
- **CSS Modules**: More boilerplate, harder to maintain
- **Styled Components**: Runtime overhead, larger bundle size
- **Plain CSS**: No design system, consistency issues

**Best Practices**:
- Define custom colors in `tailwind.config.ts` for brand consistency
- Use `@apply` directive sparingly (only for repeated patterns)
- Implement responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Use `clsx` or `cn()` utility for conditional classes
- Configure content paths properly to avoid purge issues

---

### 6. Testing Strategy

**Decision**: Multi-layer testing with Jest (unit), React Testing Library (component), Playwright (E2E)

**Rationale**:
- **Jest**: Industry standard for TypeScript/JavaScript unit testing
- **React Testing Library**: Tests components from user perspective
- **Playwright**: Modern, reliable E2E testing with browser automation
- **Coverage**: Comprehensive coverage across all layers

**Alternatives Considered**:
- **Cypress**: Slower than Playwright, less reliable
- **Vitest**: Less mature, smaller ecosystem
- **Testing Library alone**: Insufficient for E2E scenarios

**Best Practices**:
- Write tests BEFORE implementation (TDD)
- Unit test: All agents, orchestrator logic, SSE utilities
- Component test: Form submission, progress display, result rendering
- Integration test: API routes with mocked AI responses
- E2E test: Full workflow from brief submission to deployment
- Target 80% minimum code coverage
- Use `@testing-library/user-event` for realistic interactions

---

### 7. Agent Architecture: Sequential Multi-Agent Pipeline

**Decision**: Implement 3 specialized agents (PM, Dev, Integration) orchestrated sequentially

**Rationale**:
- **Separation of concerns**: Each agent has single, well-defined responsibility
- **Quality**: Specialized agents produce better results than monolithic AI
- **Debuggability**: Easier to identify and fix issues in specific phases
- **Scalability**: Can parallelize or distribute agents in future

**Agent Responsibilities**:
1. **PM Agent (Product Manager)**:
   - Input: Natural language brief
   - Output: PRD (JSON) + Implementation plan
   - Model: Claude Sonnet 4.5
   - Max tokens: 8192

2. **Dev Agent (Developer)**:
   - Input: Implementation plan
   - Output: Complete source code files (JSON array)
   - Model: Claude Sonnet 4.5
   - Max tokens: 16000
   - Validates: All files, no TODOs, working imports

3. **Integration Agent (GitHub/Deployment)**:
   - Input: Generated files
   - Output: Repository URL + deployment URL
   - Tools: MCP GitHub + filesystem servers
   - Operations: Create repo, commit files, trigger deploy

**Orchestration Flow**:
```
Brief → PM Agent → Dev Agent → Integration Agent → Results
         ↓           ↓              ↓
        PRD        Code          Repo URL
```

**Best Practices**:
- Validate output format from each agent before proceeding
- Implement retry logic (max 3 attempts) for agent failures
- Log all agent inputs/outputs for debugging
- Pass complete context between agents (no information loss)
- Set reasonable timeouts (60s per agent, 5min total)

---

### 8. Error Handling & Resilience

**Decision**: Implement comprehensive error handling at all layers

**Strategies**:
- **API Route**: Try-catch with detailed error messages sent via SSE
- **Agents**: Retry with exponential backoff (3 attempts)
- **MCP**: Fallback mechanisms for GitHub API failures
- **Frontend**: Error boundaries, toast notifications, graceful degradation

**Best Practices**:
- Never expose API keys or sensitive data in error messages
- Log errors to console with full context for debugging
- Return user-friendly messages to frontend
- Implement circuit breaker for repeated failures
- Set maximum timeout (5 minutes) for entire workflow

---

### 9. Environment Configuration

**Decision**: Use .env files for configuration with proper validation

**Required Environment Variables**:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx    # Claude API key
GITHUB_TOKEN=ghp_xxxxx            # GitHub personal access token
NODE_ENV=development|production    # Runtime environment
```

**Best Practices**:
- Provide `.env.example` with all variables (no values)
- Validate required env vars at startup
- Never commit `.env` to version control
- Use different tokens for development/production
- Document token creation steps in README

---

### 10. Performance Optimization

**Decision**: Implement code splitting, caching, and bundle optimization

**Optimizations**:
- **Code splitting**: Lazy load agent modules with `import()`
- **Bundle analysis**: Use `@next/bundle-analyzer` to identify bloat
- **Image optimization**: Next.js Image component for all images
- **Caching**: Cache AI responses for identical briefs (optional)
- **Compression**: Enable gzip/brotli in production

**Performance Targets**:
- Initial page load: <1.5s (FCP)
- Time to Interactive: <3s (TTI)
- Largest Contentful Paint: <2.5s (LCP)
- Bundle size: <200KB gzipped

**Best Practices**:
- Use React.memo for expensive components
- Implement proper loading states (Suspense, skeleton screens)
- Avoid blocking the main thread during SSE processing
- Monitor bundle size in CI/CD pipeline

---

## Security Considerations

### API Key Protection
- Store keys in environment variables only
- Never expose in client-side code
- Use Next.js API routes as proxy to AI services
- Rotate keys regularly

### GitHub Access
- Use fine-grained personal access tokens with minimal scopes
- Required scopes: `repo` (create repositories), `workflow` (optional for CI/CD)
- Document token creation in README

### Input Validation
- Sanitize brief input (remove malicious content)
- Limit brief length (max 5000 characters)
- Rate limit API endpoint (prevent abuse)
- Validate file paths from AI agents (prevent directory traversal)

---

## Deployment Strategy

**Decision**: Deploy to Vercel for zero-config hosting and automatic CI/CD

**Rationale**:
- **Next.js optimized**: Built by same team, perfect integration
- **Automatic deployments**: Push to GitHub → instant deploy
- **Serverless functions**: API routes auto-scale
- **Edge network**: Global CDN for fast response times
- **Free tier**: Generous limits for development/testing

**Alternatives Considered**:
- **AWS (Amplify, ECS)**: More complex setup, higher cost
- **Netlify**: Less Next.js optimization, slower builds
- **Self-hosted (Docker)**: High maintenance, infrastructure overhead

**Deployment Checklist**:
- [ ] Set environment variables in Vercel dashboard
- [ ] Configure custom domain (optional)
- [ ] Enable automatic GitHub deployments
- [ ] Set up preview deployments for PRs
- [ ] Configure build settings (Node.js 20+)

---

## Open Questions & Future Enhancements

### Resolved in This Research:
- ✅ AI model selection (Claude Sonnet 4.5)
- ✅ Integration approach (MCP servers)
- ✅ Real-time communication (SSE)
- ✅ Frontend framework (Next.js 14)
- ✅ Agent architecture (3 specialized agents)

### Deferred to Future Iterations:
- **Multi-language support**: Start with English + Russian, expand later
- **Authentication**: Start with public access, add auth later if needed
- **Project templates**: Start with dynamic generation, add templates later
- **Monitoring/Analytics**: Add Sentry/PostHog in production phase
- **Caching layer**: Implement Redis caching for repeated briefs if needed

---

## References

- [Claude Agent SDK Documentation](https://docs.anthropic.com/claude/docs/agents-overview)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Server-Sent Events API](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Playwright Testing Documentation](https://playwright.dev/)
