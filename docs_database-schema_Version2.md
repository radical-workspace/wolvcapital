# Database Schema

## users

| Field           | Type    | Description         |
|-----------------|---------|--------------------|
| id              | int     | Primary key        |
| name            | string  | User's name        |
| email           | string  | User's email       |
| password        | string  | Hashed password    |
| role            | string  | 'user' or 'admin'  |
| kyc_status      | string  | KYC status         |
| email_verified_at | timestamp | Email verification |
| remember_token  | string  |                    |
| created_at      | timestamp |                   |
| updated_at      | timestamp |                   |

## admin_approvals

| Field        | Type    | Description                  |
|--------------|---------|-----------------------------|
| id           | int     | Primary key                 |
| user_id      | int     | FK to users                 |
| type         | string  | kyc, large_investment, ...  |
| data         | json    | Request data (details)      |
| status       | string  | pending, approved, rejected |
| reviewed_by  | int     | FK to users (admin)         |
| reviewed_at  | timestamp | Review time                |
| comment      | text    | Admin comments              |
| created_at   | timestamp |                            |
| updated_at   | timestamp |                            |