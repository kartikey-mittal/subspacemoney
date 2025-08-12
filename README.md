# Subspace ChatBOT: A Real-Time AI Chat Application

Subspace ChatBOT is a modern, full-stack chat application designed for seamless, real-time conversations with an intelligent AI assistant.  

---


## 🔗 Deployed Link

**[https://subspacemoney.netlify.app/](https://subspacemoney.netlify.app/)**

---
## 📸 Screenshots

### Authentication Page
![Authentication Page Screenshot](https://i.ibb.co/HTj473Jp/Screenshot-2025-08-12-230409.png)

### Main Chat Window
![Main Chat Window Screenshot](https://i.ibb.co/9kjw6sMv/Screenshot-2025-08-12-230332.png)

### NHost WorkFlow
![NHost WorkFlow](https://i.ibb.co/mVwGp5bb/Screenshot-2025-08-12-233029.png)

---

## 🛠️ Tech Stack & Architecture

This project follows a modern, decoupled architecture for scalability and maintainability.

| Category       | Technology         | Purpose                                                                 |
|----------------|-------------------|-------------------------------------------------------------------------|
| **Frontend**   | React.js          | Component-based, interactive UI                                        |
|                | Apollo Client     | GraphQL queries, mutations & subscriptions (real-time updates)         |
|                | Nhost React SDK   | Simplified authentication & session management                         |
|                | Inline CSS-in-JS  | Component-scoped styling for maintainable UI                            |
| **Backend**    | Nhost             | BaaS with PostgreSQL, Hasura GraphQL, Authentication & Serverless Funcs|
|                | GraphQL (Hasura)  | High-performance API layer                                              |
|                | PostgreSQL        | Relational database for users, chats, messages                          |
| **Auth**       | Nhost Auth        | JWT-based secure authentication                                         |
| **Functions**  | Serverless Funcs  | AI bot logic via Hasura Actions                                         |

---

## 🗄️ Database Schema

### 1. `users` Table  
Managed automatically by Nhost Auth.

| Column         | Type      | Description                                      |
|----------------|-----------|--------------------------------------------------|
| id             | uuid      | Primary key                                      |
| email          | text      | User email                                       |
| password_hash  | text      | Securely hashed password                         |
| created_at     | timestamp | Account creation timestamp                       |
| default_role   | text      | User role (`user`)                               |
| is_active      | boolean   | Account activation status                        |

---

### 2. `chats` Table  

| Column     | Type      | Description                                      |
|------------|-----------|--------------------------------------------------|
| id         | uuid      | Primary key                                      |
| user_id    | uuid      | Foreign key → `users.id`                         |
| created_at | timestamp | Chat session start time                          |

---

### 3. `messages` Table  

| Column     | Type      | Description                                      |
|------------|-----------|--------------------------------------------------|
| id         | uuid      | Primary key                                      |
| chat_id    | uuid      | Foreign key → `chats.id`                         |
| content    | text      | Message text                                     |
| sender     | text      | `"user"` or `"bot"`                              |
| created_at | timestamp | Message timestamp                                |

---

## ✨ Features

- 🔐 **Secure User Authentication** with Nhost Auth  
- ⚡ **Real-Time Messaging** using GraphQL Subscriptions  
- 🤖 **AI Bot Integration** via Hasura Actions + Serverless Functions  
- 🗂️ **Multi-Chat History** with persistent storage  
- 🎨 **Modern Dark UI/UX** with responsive design  
- ⏱ **Instant Updates** without page refresh  
- 🛠 **Automated User Verification** (no email verification needed)  

---

## ⚙️ Architectural Workflow

1. **User Authentication**
   - New user signs up → `users` entry created by Nhost  
   - Default role = `user` → auto-activated account

2. **Creating a Chat**
   - User triggers `insert_chats_one` mutation → New row in `chats` table linked to `user_id`

3. **Sending a Message**
   - User sends message → `insert_messages_one` mutation  
   - Bot Action triggered → Hasura Action calls serverless AI function

4. **Bot Response Generation**
   - Function processes message (e.g., via OpenAI API)  
   - Inserts bot reply into `messages` table

5. **Real-Time UI Update**
   - Apollo subscription on `messages` table auto-updates UI

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js & npm (or yarn)
- Nhost account

---

### **1. Backend Setup (Nhost)**

1. **Create a Project** in Nhost  
2. **Define Schema** in Hasura:
   - `chats` table
   - `messages` table  
3. **Configure Auth**:
   - Turn OFF `Require Verified Emails`
   - Set Default Role → `user`  
4. **Get Env Vars**:
   - `NHOST_SUBDOMAIN`
   - `NHOST_REGION`

---

### **2. Frontend Setup**

```bash
git clone https://your-repository-url.com/project.git
cd project
npm install
npm start
```

## 👤 Developer

**Kartikey Mital**
📧 [g6.kartikey@gmail.com](mailto:g6.kartikey@gmail.com)
🔗 [LinkedIn](https://linkedin.com/in/kartikey-mittal)
💻 [GitHub](https://github.com/kartikey-mittal/)
