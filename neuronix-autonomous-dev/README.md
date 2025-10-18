# Neuronix - Autonomous Software Development System

Transform your ideas into deployed applications in minutes with AI-powered autonomous development.

## 🚀 Features

- **Natural Language Input**: Describe your project in plain English or Russian
- **Multi-Agent System**: Specialized AI agents handle product management, development, and deployment
- **Real-Time Progress**: Watch as your project is created step-by-step
- **Instant Deployment**: Get a live URL and GitHub repository
- **Production-Ready Code**: Generated code follows best practices

## 📋 Prerequisites

- Node.js 20.0.0 or higher
- npm 10.0.0 or higher
- Anthropic API Key ([Get one here](https://console.anthropic.com/settings/keys))
- GitHub Account (for repository creation)
- Vercel Account (optional, for deployment)

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd neuronix-autonomous-dev
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Optional (for full functionality)
GITHUB_TOKEN=ghp_your-token-here
GITHUB_OWNER=your-github-username
VERCEL_TOKEN=your-vercel-token-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Create Your First Project

1. Enter a project description (e.g., "Create a habit tracking app")
2. Select language (English or Russian)
3. Click "Create Project"
4. Watch the magic happen!

## 🏗️ Project Structure

```
neuronix-autonomous-dev/
├── app/
│   ├── components/          # UI components
│   │   ├── BriefForm.tsx    # Project brief input
│   │   └── ResultCard.tsx   # Results display
│   ├── api/
│   │   ├── create/          # Main creation endpoint
│   │   └── ping/            # Health check
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── src/
│   ├── agents/              # AI Agents
│   │   ├── base.ts          # Base agent interface
│   │   ├── PMAgent.ts       # Product Manager
│   │   ├── DevAgent.ts      # Developer
│   │   └── IntegrationAgent.ts # Integration
│   ├── lib/
│   │   ├── orchestrator.ts  # Agent coordinator
│   │   ├── sse.ts           # Server-Sent Events
│   │   ├── validation.ts    # Input validation
│   │   └── errors.ts        # Error handling
│   └── types/
│       └── contracts.ts     # TypeScript types
└── tests/
    ├── e2e/                 # Playwright tests
    └── integration/         # Integration tests
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🎯 Development Workflow

### Type Check

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Or use the [Vercel Dashboard](https://vercel.com/new):
1. Import this repository
2. Add environment variables
3. Deploy!

## 🏛️ Architecture

### Agent Workflow

```
User Brief → PM Agent → Dev Agent → Integration Agent → Deployed App
```

1. **PM Agent**: Analyzes brief, creates PRD and implementation plan
2. **Dev Agent**: Generates complete source code
3. **Integration Agent**: Creates repository and deploys

### Technologies

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **AI**: Claude Sonnet 4.5 via Anthropic SDK
- **Integration**: Model Context Protocol (MCP)
- **Streaming**: Server-Sent Events (SSE)
- **Testing**: Jest, React Testing Library, Playwright

## 📊 Constitution Compliance

This project follows strict quality standards:

- ✅ **TypeScript Strict Mode**: No `any` types allowed
- ✅ **80% Test Coverage**: Comprehensive unit, integration, and E2E tests
- ✅ **WCAG 2.1 AA**: Full accessibility compliance
- ✅ **Performance**: Lighthouse score ≥90
- ✅ **TDD Approach**: Tests written before implementation

## 🐛 Troubleshooting

### "ANTHROPIC_API_KEY not found"

Ensure `.env.local` exists with your API key:
```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
```

### "Port 3000 already in use"

Change the port:
```bash
PORT=3001 npm run dev
```

### Build Errors

Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📧 Support

- Issues: https://github.com/your-org/neuronix/issues
- Discussions: https://github.com/your-org/neuronix/discussions
- Email: support@neuronix.dev

---

**Built with ❤️ using Next.js, Claude AI, and autonomous agents**
