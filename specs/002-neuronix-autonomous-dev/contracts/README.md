# API Contracts: Neuronix Autonomous Development System

**Created**: 2025-10-18  
**Phase**: 1 - Design & Contracts  
**Purpose**: Define API endpoints, request/response schemas, and SSE event format

## Overview

Neuronix exposes a single REST API endpoint for project creation and uses Server-Sent Events (SSE) for real-time progress updates.

## Endpoint Index

1. **POST /api/create** - Create new project from brief
2. **GET /api/ping** - Health check endpoint

---

## Detailed Contracts

### POST /api/create

**Description**: Submit a project brief and receive SSE stream of progress updates

**Request**:
```typescript
{
  brief: string         // Natural language project description
  language?: 'en' | 'ru' // Optional language hint (auto-detected if omitted)
}
```

**Response**: Server-Sent Events stream

**SSE Event Format**:
```typescript
{
  id: string           // Unique event ID (UUID)
  type: EventType      // Event type (see below)
  projectId: string    // Associated project request ID
  phase: Phase         // Current phase
  progress: number     // 0-100 percentage
  message: string      // Human-readable status message
  artifact?: Artifact  // Optional artifact data
  timestamp: string    // ISO 8601 timestamp
}
```

**Event Types**:
```typescript
type EventType =
  | 'phase_start'        // New phase beginning
  | 'phase_complete'     // Phase finished successfully
  | 'artifact_generated' // New artifact created (PRD, file, URL)
  | 'error'              // Error occurred
  | 'complete'           // Entire project finished
```

**Phases**:
```typescript
type Phase =
  | 'brief'   // Validating brief
  | 'prd'     // Generating product requirements
  | 'plan'    // Creating implementation plan
  | 'code'    // Generating source code
  | 'repo'    // Creating GitHub repository
  | 'deploy'  // Deploying to hosting
```

**Artifact Types**:
```typescript
type Artifact =
  | { type: 'prd', data: ProductRequirementsDocument }
  | { type: 'plan', data: ImplementationPlan }
  | { type: 'file', data: { path: string, size: number } }
  | { type: 'repository', data: { url: string, name: string } }
  | { type: 'deployment', data: { url: string, status: string } }
```

**Example SSE Stream**:
```
event: message
data: {"id":"evt_001","type":"phase_start","projectId":"req_123","phase":"brief","progress":0,"message":"Validating project brief...","timestamp":"2025-01-18T10:00:00Z"}

event: message
data: {"id":"evt_002","type":"phase_complete","projectId":"req_123","phase":"brief","progress":10,"message":"Brief validated successfully","timestamp":"2025-01-18T10:00:01Z"}

event: message
data: {"id":"evt_003","type":"phase_start","projectId":"req_123","phase":"prd","progress":10,"message":"PM Agent generating product requirements...","timestamp":"2025-01-18T10:00:02Z"}

event: message
data: {"id":"evt_004","type":"artifact_generated","projectId":"req_123","phase":"prd","progress":30,"message":"Product Requirements Document created","artifact":{"type":"prd","data":{"projectName":"habit-tracker","goal":"Help users build healthy habits","features":["Daily habit tracking","Streak counter","Reminders"]}},"timestamp":"2025-01-18T10:00:15Z"}

event: message
data: {"id":"evt_005","type":"phase_complete","projectId":"req_123","phase":"prd","progress":40,"message":"PRD generation complete","timestamp":"2025-01-18T10:00:16Z"}

event: message
data: {"id":"evt_006","type":"phase_start","projectId":"req_123","phase":"code","progress":40,"message":"Dev Agent generating source code...","timestamp":"2025-01-18T10:00:17Z"}

event: message
data: {"id":"evt_007","type":"artifact_generated","projectId":"req_123","phase":"code","progress":60,"message":"Generated app/page.tsx","artifact":{"type":"file","data":{"path":"app/page.tsx","size":2048}},"timestamp":"2025-01-18T10:00:25Z"}

event: message
data: {"id":"evt_008","type":"phase_complete","projectId":"req_123","phase":"code","progress":70,"message":"All files generated successfully","timestamp":"2025-01-18T10:00:45Z"}

event: message
data: {"id":"evt_009","type":"phase_start","projectId":"req_123","phase":"repo","progress":70,"message":"Integration Agent creating GitHub repository...","timestamp":"2025-01-18T10:00:46Z"}

event: message
data: {"id":"evt_010","type":"artifact_generated","projectId":"req_123","phase":"repo","progress":80,"message":"Repository created","artifact":{"type":"repository","data":{"url":"https://github.com/user/habit-tracker","name":"habit-tracker"}},"timestamp":"2025-01-18T10:01:00Z"}

event: message
data: {"id":"evt_011","type":"phase_complete","projectId":"req_123","phase":"repo","progress":85,"message":"Repository ready","timestamp":"2025-01-18T10:01:01Z"}

event: message
data: {"id":"evt_012","type":"phase_start","projectId":"req_123","phase":"deploy","progress":85,"message":"Deploying to Vercel...","timestamp":"2025-01-18T10:01:02Z"}

event: message
data: {"id":"evt_013","type":"artifact_generated","projectId":"req_123","phase":"deploy","progress":95,"message":"Deployment live","artifact":{"type":"deployment","data":{"url":"https://habit-tracker.vercel.app","status":"ready"}},"timestamp":"2025-01-18T10:01:30Z"}

event: message
data: {"id":"evt_014","type":"complete","projectId":"req_123","phase":"deploy","progress":100,"message":"✅ Project completed successfully!","artifact":{"type":"deployment","data":{"url":"https://habit-tracker.vercel.app","status":"ready"}},"timestamp":"2025-01-18T10:01:31Z"}
```

**Error Handling**:
```
event: message
data: {"id":"evt_err","type":"error","projectId":"req_123","phase":"deploy","progress":90,"message":"Deployment failed: Build timeout exceeded","timestamp":"2025-01-18T10:05:00Z"}
```

**Status Codes**:
- `200 OK` - SSE stream established successfully
- `400 Bad Request` - Invalid brief (too short, malicious content)
- `500 Internal Server Error` - Server error during processing
- `503 Service Unavailable` - AI agent unavailable

**Request Validation**:
- `brief` must be 10-5000 characters
- `brief` must not contain script tags or SQL injection patterns
- `language` must be 'en' or 'ru' (defaults to auto-detection)

**Response Headers**:
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

---

### GET /api/ping

**Description**: Health check endpoint to verify service availability

**Request**: None (no body)

**Response**:
```typescript
{
  status: 'ok',
  timestamp: string,    // ISO 8601 timestamp
  version: string,      // API version (e.g., "1.0.0")
  agents: {
    pmAgent: 'available' | 'unavailable',
    devAgent: 'available' | 'unavailable',
    integrationAgent: 'available' | 'unavailable'
  }
}
```

**Example Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-18T10:00:00Z",
  "version": "1.0.0",
  "agents": {
    "pmAgent": "available",
    "devAgent": "available",
    "integrationAgent": "available"
  }
}
```

**Status Codes**:
- `200 OK` - Service healthy
- `503 Service Unavailable` - One or more agents unavailable

---

## TypeScript Definitions

See `contracts/types.ts` for complete TypeScript definitions:
- Request/Response schemas
- SSE event types
- Validation rules
- Error types
