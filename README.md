# 🏫 Campus Lost & Found Tracker

A minimal, high-performance React + TypeScript web application built with Vite to track missing and found items around campus. 

This system handles two core user roles: **Students** (who report items and file ownership claims) and **Security Admins** (who review details and verify claims).

---

## 🛠️ TypeScript Features Implemented (ITELECT4 Requirements)

This project demonstrates advanced TypeScript patterns integrated directly into the React architecture:

*   **App Interfaces**: Fully defined structures for `User`, `Item` (lost/found posts), and `Claim` matching the application domain.
*   **Generic Components/Interfaces**: Includes the reusable `ApiResponse<T>` layout and data-fetching helpers like `getById` and `getFirst`.
*   **Utility Type Configurations**: Leverages `Partial<T>` for asset updates, `Pick<T, K>` for fast item summaries, `Omit<T, K>` for public user profiles, and `Record<K, T>` for dashboard analytics.
*   **Enums**: Features strong status management via `ClaimStatus` (runtime tracking) and `Role` (compile-time inlining).
*   **Type Narrowing**: Uses strict `typeof` and `instanceof` guards to handle polymorphic data inputs safely.

---

## 🚀 Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone or open the project folder in VS Code.
2. Install the necessary dependencies:
   ```bash
   npm install