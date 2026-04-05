# 🌟 Family Kids Rewards System

A full-stack web application for families to manage kids' tasks, rewards, penalties, and a star-based wallet — built with ASP.NET Core 8 + Angular 17+ + SQL Server.

---

## 🏗️ Architecture

```
FamilyRewards/
├── FamilyRewards.Core/          # Entities, Interfaces, DTOs, Enums
├── FamilyRewards.Infrastructure/ # EF Core, Repositories, Services
├── FamilyRewards.API/           # ASP.NET Core Web API
├── family-rewards-ui/           # Angular 17+ Frontend
└── NuGet.Config                 # Overrides corporate NuGet feeds
```

**Clean Architecture + Repository Pattern + Unit of Work + JWT Authentication**

---

## ⚙️ Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| .NET SDK | 8.0+ | [Download](https://dotnet.microsoft.com/download) |
| SQL Server | Any | Instance: `.\SQLSERVER2025` |
| Node.js | 18+ | [Download](https://nodejs.org) |
| Angular CLI | 17+ | `npm i -g @angular/cli` |

---

## 🚀 Quick Start

### 1. Clone / Open the project

```
cd e:\FamilyRewards
```

### 2. Start the Backend API

```powershell
# From the solution root
dotnet run --project FamilyRewards.API
```

The API will:
- Apply EF Core migrations automatically
- Seed sample family data
- Start on `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`

### 3. Start the Angular Frontend

```powershell
cd family-rewards-ui
npm install      # first time only
npm run start
```

Frontend starts at `http://localhost:4200`

---

## 👤 Demo Accounts (seeded automatically)

| Role | Email | Password | Name |
|------|-------|----------|------|
| 👨 Admin | `father@family.com` | `Admin@123` | John Smith |
| 👩 Admin | `mother@family.com` | `Admin@123` | Jane Smith |
| 👧 Child | `emma@family.com` | `Child@123` | Emma Smith |
| 👦 Child | `liam@family.com` | `Child@123` | Liam Smith |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register family |
| POST | `/api/auth/login` | Public | Login |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/add-child` | Admin | Add child |
| GET | `/api/users/children` | Admin | List children |
| GET | `/api/users/leaderboard` | Any | Star rankings |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks` | Any | Get all tasks |
| GET | `/api/tasks/pending` | Admin | Pending approvals |
| POST | `/api/tasks/complete` | Child | Mark done |
| POST | `/api/tasks/approve` | Admin | Approve/Reject |

### Rewards
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/rewards` | Admin | Create reward |
| GET | `/api/rewards` | Any | List rewards |
| POST | `/api/rewards/redeem` | Child | Redeem reward |

### Wallet
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wallet/{childId}` | Any | Get balance |
| GET | `/api/wallet/my-wallet` | Child | Own balance |
| GET | `/api/wallet/transactions/{childId}` | Any | History |

### Penalties
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/penalties` | Admin | Issue penalty |
| GET | `/api/penalties/{childId}` | Any | Get penalties |

---

## 🗄️ Database

Connection string (in `appsettings.json`):
```json
"Server=.\\SQLSERVER2025;Database=FamilyRewardsDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

To manually run migrations:
```powershell
dotnet ef database update --project FamilyRewards.Infrastructure --startup-project FamilyRewards.API
```

---

## 🎨 Frontend Pages

### Admin
- `/admin/dashboard` — Stats overview + quick actions
- `/admin/children` — Manage children accounts
- `/admin/tasks` — Create tasks + approve completions
- `/admin/rewards` — Create rewards
- `/admin/penalties` — Issue penalties

### Child
- `/child/dashboard` — Stars balance + task overview
- `/child/tasks` — Available tasks + mark done + history
- `/child/rewards` — Rewards store + redeem
- `/child/wallet` — Balance + transaction history

### Shared
- `/leaderboard` — Family star rankings

---

## 🔧 Configuration

Edit `FamilyRewards.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLSERVER2025;Database=FamilyRewardsDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "FamilyRewards_SuperSecretKey_2024_!@#$%^&*()_AtLeast32Chars",
    "Issuer": "FamilyRewardsAPI",
    "Audience": "FamilyRewardsClient"
  }
}
```

---

## 🔑 JWT Authentication

- Tokens expire in **7 days**
- Include in requests: `Authorization: Bearer <token>`
- Roles: `Admin` (parents) and `Child`

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| API | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core 8 |
| DB | SQL Server |
| Auth | JWT Bearer Tokens + BCrypt |
| Frontend | Angular 17+ (Standalone) |
| UI | Angular Material |
| Fonts | Inter (Google Fonts) |
