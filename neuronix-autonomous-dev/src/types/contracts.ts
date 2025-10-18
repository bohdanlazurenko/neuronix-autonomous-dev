/**
 * API Contract Types: Neuronix Autonomous Development System
 * 
 * This file defines all TypeScript types for API contracts.
 * Auto-generated from spec.md on 2025-10-18.
 */

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface CreateProjectRequest {
  /** Natural language project description (10-5000 characters) */
  brief: string;
  
  /** Optional language hint. Auto-detected if omitted. */
  language?: 'en' | 'ru';
}

// ============================================================================
// SSE EVENT TYPES
// ============================================================================

export type EventType =
  | 'phase_start'        // New phase beginning
  | 'phase_complete'     // Phase finished successfully
  | 'artifact_generated' // New artifact created
  | 'error'              // Error occurred
  | 'complete';          // Entire project finished

export type Phase =
  | 'brief'   // Validating brief
  | 'prd'     // Generating product requirements
  | 'plan'    // Creating implementation plan
  | 'code'    // Generating source code
  | 'repo'    // Creating GitHub repository
  | 'deploy'; // Deploying to hosting

export interface ProgressEvent {
  /** Unique event ID (UUID) */
  id: string;
  
  /** Type of event */
  type: EventType;
  
  /** Associated project request ID */
  projectId: string;
  
  /** Current phase */
  phase: Phase;
  
  /** Progress percentage (0-100) */
  progress: number;
  
  /** Human-readable status message */
  message: string;
  
  /** Optional artifact data */
  artifact?: Artifact;
  
  /** ISO 8601 timestamp */
  timestamp: string;
}

// ============================================================================
// ARTIFACT TYPES
// ============================================================================

export type Artifact =
  | PRDArtifact
  | PlanArtifact
  | FileArtifact
  | RepositoryArtifact
  | DeploymentArtifact;

export interface PRDArtifact {
  type: 'prd';
  data: ProductRequirementsDocument;
}

export interface PlanArtifact {
  type: 'plan';
  data: ImplementationPlan;
}

export interface FileArtifact {
  type: 'file';
  data: {
    path: string;
    size: number;
  };
}

export interface RepositoryArtifact {
  type: 'repository';
  data: {
    url: string;
    name: string;
  };
}

export interface DeploymentArtifact {
  type: 'deployment';
  data: {
    url: string;
    status: 'pending' | 'building' | 'ready' | 'error';
  };
}

// ============================================================================
// DOMAIN ENTITIES (from data-model.md)
// ============================================================================

export interface ProductRequirementsDocument {
  id: string;
  projectName: string;
  goal: string;
  features: string[];
  techDecisions: TechDecisions;
  createdAt: string;
  generatedBy: 'PMAgent';
}

export interface TechDecisions {
  framework: string;     // e.g., "Next.js 14"
  language: string;      // e.g., "TypeScript"
  styling: string;       // e.g., "Tailwind CSS"
  dependencies: string[]; // Key libraries needed
}

export interface ImplementationPlan {
  id: string;
  projectName: string;
  stack: TechStack;
  files: FilePlan[];
  createdAt: string;
  generatedBy: 'PMAgent';
}

export interface TechStack {
  framework: string;
  language: string;
  styling: string;
  testing: string;
  deployment: string;
}

export interface FilePlan {
  path: string;          // Relative file path
  purpose: string;       // What this file does
  dependencies: string[]; // Other files it depends on
}

// ============================================================================
// HEALTH CHECK TYPES
// ============================================================================

export interface PingResponse {
  status: 'ok';
  timestamp: string;
  version: string;
  agents: AgentStatus;
}

export interface AgentStatus {
  pmAgent: 'available' | 'unavailable';
  devAgent: 'available' | 'unavailable';
  integrationAgent: 'available' | 'unavailable';
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export type ErrorCode =
  | 'INVALID_BRIEF'          // Brief validation failed
  | 'MALICIOUS_CONTENT'      // Security threat detected
  | 'AGENT_UNAVAILABLE'      // AI agent not responding
  | 'GENERATION_FAILED'      // Artifact generation failed
  | 'REPOSITORY_ERROR'       // GitHub API error
  | 'DEPLOYMENT_ERROR'       // Deployment failed
  | 'TIMEOUT'                // Request timeout (15 minutes)
  | 'INTERNAL_ERROR';        // Generic server error

// ============================================================================
// VALIDATION SCHEMAS (Zod-compatible)
// ============================================================================

export const CreateProjectRequestSchema = {
  brief: {
    type: 'string',
    minLength: 10,
    maxLength: 5000,
    pattern: '^(?!.*<script)(?!.*SELECT|INSERT|UPDATE|DELETE).*$', // No scripts/SQL
  },
  language: {
    type: 'string',
    enum: ['en', 'ru'],
    optional: true,
  },
} as const;

export const ProgressEventSchema = {
  id: { type: 'string', format: 'uuid' },
  type: { type: 'string', enum: ['phase_start', 'phase_complete', 'artifact_generated', 'error', 'complete'] },
  projectId: { type: 'string', format: 'uuid' },
  phase: { type: 'string', enum: ['brief', 'prd', 'plan', 'code', 'repo', 'deploy'] },
  progress: { type: 'number', minimum: 0, maximum: 100 },
  message: { type: 'string', minLength: 1, maxLength: 500 },
  artifact: { type: 'object', optional: true },
  timestamp: { type: 'string', format: 'date-time' },
} as const;
