# 🏫 Campus Lost & Found Tracker

A high-performance React + TypeScript web application built with Vite to track, manage, and verify missing and found items around campus.

The system serves two core roles: **Students** (who report lost items, manage posts, and file ownership claims) and **Security Admins** (who review item reports and verify claims).

---

## 🛠️ Key Features & Architecture

### 1. TypeScript Design Patterns
* **App Interfaces**: Fully typed core entities (`User`, `Item`, and `Claim`).
* **Generic Utilities**: Reusable API contracts (`ApiResponse<T>`) and generic helpers (`getById`, `getFirst`).
* **Utility Types**: Leverages `Partial<T>` for asset updates, `Pick<T, K>` for summary views, `Omit<T, K>` for public profiles, and `Record<K, T>` for analytical metrics.
* **Type Narrowing**: Uses strict `typeof` and `instanceof` runtime guards to process polymorphic inputs.

### 2. Form Management & Validation
* **React Hook Form**: Replaces standard `useState` form handling to improve rendering performance and control `onBlur` field validation.
* **Zod Schemas**: Strict runtime validation schemas paired with `z.infer` for automated type safety.
* **Custom Refinements**: Built-in domain validation rules using `.refine()` (e.g., URL constraints).

### 3. UI & Project Configuration
* **Shadcn UI**: Accessible component primitives (`Button`, `Input`, `Label`) styled with Tailwind CSS across multiple app pages.
* **Path Aliases**: Modern `@/*` path mapping configured across `tsconfig.json`, `tsconfig.app.json`, and `vite.config.ts`.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd itelect4-project-IT4B