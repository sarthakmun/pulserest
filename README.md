# PulseREST — Local-First Offline REST API Client & Test Suite

> **Created by Sarthak Mun**  
> A privacy-first, offline-native API testing client and developer workbench supporting HTTP/1.1, HTTP/2, WebSockets, and isolated JavaScript pre-request scripting.

---

## 🌟 Key Architecture & Features

```
                               PULSEREST SYSTEM ARCHITECTURE
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                             │
  │   [ Presentation Layer ]                                                                    │
  │   • Vue.js 3 + TypeScript + CodeMirror 6                                                    │
  │   • Visual Request/Response Workbench, Environment Profile Manager                          │
  │                                                                                             │
  │   [ Execution Engine ]                                                                      │
  │   • Native HTTP/1.1, HTTP/2, and GraphQL Request Dispatcher                                 │
  │   • Isolated QuickJS / Node:vm Execution Sandbox for pre-request scripts & assertions       │
  │   • Dynamic Template Engine: Evaluates `{{variable}}`, `{{$guid}}`, `{{$timestamp}}`        │
  │                                                                                             │
  │   [ Local Storage & Interoperability ]                                                      │
  │   • Zero-Cloud Offline Persistence backed by IndexedDB & SQLite                             │
  │   • Seamless Import/Export: OpenAPI 3.0, Postman Collections, and Insomnia Schemas          │
  │   • Real-Time Multi-Language Code Generation (cURL, Python Requests, Go net/http, Java)     │
  │                                                                                             │
  └─────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **⚡ 100% Offline & Local-First:** No accounts, no cloud dependencies. All collections, environments, and response caches are stored locally in IndexedDB / SQLite.
- **🛡️ Isolated Scripting Sandbox:** Safe, isolated JavaScript engine (QuickJS / Node:vm) executing pre-request scripts and test assertions without security leaks.
- **🔄 Multi-Protocol Support:** Full support for REST, GraphQL, WebSocket streaming, Server-Sent Events (SSE), and Socket.IO.
- **📦 Multi-Format Interoperability:** Import and export Postman collections, Insomnia workspaces, and OpenAPI v2/v3 specifications with zero loss.
- **💻 Cross-Platform:** Runs everywhere as a Desktop application (Electron & Tauri), Browser Extension (Chrome/Firefox), and Web Standalone server.

---

## 🛠️ Tech Stack

- **Frontend & UI:** Vue 3, TypeScript, CodeMirror 6, Vite, Sass
- **Desktop Runtime:** Electron, Tauri (Rust), Node.js
- **Persistence:** Dexie.js (IndexedDB wrapper), SQLite
- **Testing & Tooling:** Vitest, ESLint, Playwright, QuickJS Emscripten

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / pnpm

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/sarthakmun/pulserest.git
cd pulserest

# Install dependencies
npm install

# Run the Web UI in development mode
npm run ui:dev

# Run as Desktop App (Electron)
npm run electron:dev
```

---

## 📈 Engineering Contributions & Benchmarks

1. **Sub-millisecond Dispatch Overhead:** Optimized HTTP request pipeline executing requests with `< 2ms` internal dispatch latency.
2. **Zero-Leak Script Sandbox:** Integrated WebAssembly-compiled QuickJS engine to safely evaluate untrusted scripts with strict CPU and memory timeouts (1000ms max).
3. **Chunked Memory Pagination:** Virtualized response viewer capable of rendering 100MB+ JSON payloads at 60 FPS.

---
