# Quickstart Guide: Neuronix Autonomous Development System

**Last Updated**: 2025-10-18  
**Phase**: 1 - Design & Contracts  
**Purpose**: Get Neuronix running locally in <5 minutes

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v20.0.0 or higher (LTS recommended)
- **npm** v10.0.0 or higher
- **Git** installed and configured
- **GitHub Personal Access Token** with `repo` scope ([Create token](https://github.com/settings/tokens/new))
- **Anthropic API Key** for Claude ([Get key](https://console.anthropic.com/settings/keys))
- **Vercel Account** (optional, for deployment) ([Sign up](https://vercel.com/signup))

## Quick Setup (5 Steps)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/neuronix.git
cd neuronix

# Install dependencies
npm install
```

**Expected output**:
```
added 245 packages in 12s
```

---

### 2. Configure Environment

Create `.env.local` file in project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Anthropic API Configuration
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here...

# GitHub Integration (Model Context Protocol)
GITHUB_TOKEN=ghp_...your-token-here...
GITHUB_OWNER=your-username

# Optional: Vercel Deployment
VERCEL_TOKEN=your-vercel-token  # Only needed for auto-deployment

# Application Settings
NODE_ENV=development
PORT=3000
```

**Important**: Never commit `.env.local` to version control!

---

### 3. Verify Configuration

```bash
# Check environment variables are loaded
npm run check-env
```

**Expected output**:
```
✅ ANTHROPIC_API_KEY found
✅ GITHUB_TOKEN found
✅ GITHUB_OWNER found
⚠️  VERCEL_TOKEN not found (deployment disabled)
✅ All required variables configured
```

---

### 4. Start Development Server

```bash
npm run dev
```

**Expected output**:
```
   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000

 ✓ Ready in 1.8s
```

Open browser to **http://localhost:3000**

---

### 5. Test the System

#### Option A: Use Web UI

1. Open http://localhost:3000
2. Enter project brief:
   ```
   Create a habit tracker app where users can add daily habits,
   track their progress, and see streak counts. Include reminders.
   ```
3. Click **"Create Project"**
4. Watch real-time progress updates
5. Get repository URL + live deployment URL

#### Option B: Use cURL

```bash
curl -N http://localhost:3000/api/create \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "brief": "Create a simple todo app with task management",
    "language": "en"
  }'
```

**Expected SSE stream**:
```
data: {"type":"phase_start","phase":"brief","progress":0,"message":"Validating brief..."}

data: {"type":"phase_complete","phase":"brief","progress":10,"message":"Brief validated"}

data: {"type":"phase_start","phase":"prd","progress":10,"message":"PM Agent generating PRD..."}

...

data: {"type":"complete","progress":100,"message":"✅ Project completed!","artifact":{"type":"deployment","data":{"url":"https://your-app.vercel.app"}}}
```

---

## Project Structure

After setup, your directory should look like:

```
neuronix/
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── create/
│   │   │   └── route.ts      # Main creation endpoint (SSE)
│   │   └── ping/
│   │       └── route.ts      # Health check
│   ├── page.tsx              # Home page UI
│   └── layout.tsx            # Root layout
├── lib/
│   ├── agents/               # AI Agent implementations
│   │   ├── pm-agent.ts       # Product Manager Agent
│   │   ├── dev-agent.ts      # Developer Agent
│   │   └── integration-agent.ts # Integration Agent
│   ├── mcp/                  # Model Context Protocol
│   │   ├── github-client.ts  # GitHub integration
│   │   └── filesystem-client.ts # File operations
│   └── utils/
│       ├── stream.ts         # SSE helpers
│       └── validation.ts     # Input validation
├── components/
│   ├── ui/                   # Reusable UI components
│   └── progress-viewer.tsx   # Real-time progress display
├── specs/                    # Specification files
│   └── 002-neuronix-autonomous-dev/
│       ├── spec.md           # Business requirements
│       ├── plan.md           # Technical plan
│       ├── data-model.md     # Entity definitions
│       └── contracts/        # API contracts
├── .env.example              # Template environment file
├── .env.local                # Your secrets (DO NOT COMMIT)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
└── README.md                 # Project documentation
```

---

## Common Tasks

### Run Tests

```bash
# Unit tests (Jest + React Testing Library)
npm test

# E2E tests (Playwright)
npm run test:e2e

# Test coverage report
npm run test:coverage
```

**Expected coverage**: ≥80% per constitution requirements

---

### Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

---

### Deploy to Vercel

#### Option 1: Automatic (via CLI)

```bash
npm install -g vercel
vercel --prod
```

#### Option 2: Manual (via Dashboard)

1. Push code to GitHub
2. Import repo in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
4. Click **"Deploy"**

---

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY not found"

**Solution**: Ensure `.env.local` exists and contains valid API key:
```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env.local
```

---

### Issue: "GitHub authentication failed"

**Solution**: Verify token has `repo` scope:
```bash
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

Expected response: Your GitHub user details

---

### Issue: "Port 3000 already in use"

**Solution**: Change port in `.env.local`:
```env
PORT=3001
```

Or kill existing process:
```bash
lsof -ti:3000 | xargs kill -9
```

---

### Issue: "Build timeout during deployment"

**Solution**: Deployment can take up to 3 minutes. If timeout occurs:
1. Check repository was created (GitHub URL in logs)
2. Deploy manually from Vercel dashboard
3. Check Vercel build logs for errors

---

## Development Workflow

### 1. Make Changes

```bash
# Create feature branch
git checkout -b feature/new-agent

# Edit code
code lib/agents/custom-agent.ts

# Test changes
npm test
```

---

### 2. Validate Constitution Compliance

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Accessibility check
npm run a11y
```

All checks must pass before committing!

---

### 3. Commit & Push

```bash
git add .
git commit -m "feat: add custom agent for X"
git push origin feature/new-agent
```

---

### 4. Create Pull Request

1. Open PR on GitHub
2. Ensure CI checks pass:
   - ✅ Type check
   - ✅ Tests (≥80% coverage)
   - ✅ Linting
   - ✅ Accessibility
   - ✅ E2E tests
3. Get review approval
4. Merge to main

---

## Performance Expectations

Per constitution requirements:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Lighthouse Performance** | ≥90 | `npm run lighthouse` |
| **First Contentful Paint** | <1.5s | Chrome DevTools |
| **Time to Interactive** | <3.5s | Chrome DevTools |
| **Bundle Size** | <200KB gzipped | `npm run analyze` |
| **API Response Time** | <500ms (health check) | `curl -w "@curl-format.txt"` |
| **SSE Latency** | <100ms per event | Browser Network tab |

---

## Accessibility Compliance

All UI components must meet **WCAG 2.1 AA** standards:

```bash
# Run axe accessibility audit
npm run a11y

# Test with screen reader (macOS)
VoiceOver: Cmd+F5

# Test keyboard navigation
Tab through all interactive elements
```

---

## Next Steps

- ✅ Complete this quickstart → You're ready to use Neuronix!
- 📖 Read [Architecture Guide](./architecture.md) → Understand system design
- 🧪 Review [Testing Strategy](./testing.md) → Write quality tests
- 🎨 Check [UI Guidelines](./ui-guidelines.md) → Maintain consistency
- 🚀 See [Deployment Guide](./deployment.md) → Production best practices

---

## Support

- **Issues**: https://github.com/your-org/neuronix/issues
- **Discussions**: https://github.com/your-org/neuronix/discussions
- **Docs**: https://neuronix.dev/docs
- **Email**: support@neuronix.dev

---

**Total Setup Time**: ~5 minutes  
**First Project Creation**: ~2-3 minutes  
**Ready to build autonomous software!** 🚀
