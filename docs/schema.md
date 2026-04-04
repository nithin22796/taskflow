# TaskFlow — Database Schema

## Models

### User
| Field | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID | No | Primary key |
| email | String | No | Unique |
| name | String | No | |
| hashedPassword | String | No | Never return this in API responses |
| isVerified | Boolean | No | Default: false |
| isActive | Boolean | No | Default: true — soft delete |
| createdAt | DateTime | No | Auto-set |
| updatedAt | DateTime | No | Auto-updated |

### Project
| Field | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID | No | Primary key |
| name | String | No | |
| description | String | Yes | |
| isActive | Boolean | No | Default: true — soft delete |
| createdAt | DateTime | No | Auto-set |
| updatedAt | DateTime | No | Auto-updated |

### ProjectMember *(join table)*
| Field | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID | No | Primary key |
| projectId | UUID | No | FK → Project |
| userId | UUID | No | FK → User |
| userRole | Enum | No | OWNER \| MEMBER. Default: MEMBER |
| createdAt | DateTime | No | Auto-set |
| updatedAt | DateTime | No | Auto-updated |

**Constraint:** `(projectId, userId)` must be unique — a user can only be in a project once.

### Task
| Field | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID | No | Primary key |
| title | String | No | |
| description | String | Yes | |
| status | Enum | No | TODO \| IN_PROGRESS \| DONE. Default: TODO |
| priority | Enum | No | LOW \| MEDIUM \| HIGH. Default: MEDIUM |
| projectId | UUID | No | FK → Project |
| reportedById | UUID | No | FK → User |
| assignedToId | UUID | Yes | FK → User — nullable, assigned later |
| resolvedById | UUID | Yes | FK → User — nullable, set on resolution |
| verifiedById | UUID | Yes | FK → User — nullable, set on verification |
| isActive | Boolean | No | Default: true — soft delete |
| createdAt | DateTime | No | Auto-set |
| updatedAt | DateTime | No | Auto-updated |

### Comment
| Field | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID | No | Primary key |
| body | String | No | |
| taskId | UUID | No | FK → Task |
| userId | UUID | No | FK → User |
| isActive | Boolean | No | Default: true — soft delete |
| createdAt | DateTime | No | Auto-set |
| updatedAt | DateTime | No | Auto-updated |

---

## Enums

| Enum | Values |
|---|---|
| TaskStatus | TODO, IN_PROGRESS, DONE |
| TaskPriority | LOW, MEDIUM, HIGH |
| ProjectRole | OWNER, MEMBER |

---

## Relationships

| From | To | Type | Via |
|---|---|---|---|
| User ↔ Project | Many-to-many | Join table | ProjectMember |
| Project → Task | One-to-many | FK on Task | projectId |
| User → Task | One-to-many ×4 | FK on Task | reportedById, assignedToId, resolvedById, verifiedById |
| Task → Comment | One-to-many | FK on Comment | taskId |
| User → Comment | One-to-many | FK on Comment | userId |

---

## Design Decisions

- **Soft deletes** — nothing is hard deleted. `isActive: false` flags deleted records. This preserves history and audit trails.
- **Owner stored in join table** — `ProjectRole.OWNER` lives in `ProjectMember`, not as a column on `Project`. This allows multiple owners in the future without schema changes.
- **Multiple User relations on Task** — each relation (reportedBy, assignedTo, resolvedBy, verifiedBy) is named explicitly to avoid ambiguity in Prisma.
- **No organization/tenant model** — kept simple for this version. Can be added later by introducing an `Organization` model and linking `User` and `Project` to it.
