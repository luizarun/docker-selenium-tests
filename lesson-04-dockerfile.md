# Lesson 4: Creating Your First Dockerfile

## What You'll Learn

- What a Dockerfile is and why you need it
- Write your own Dockerfile from scratch
- Build a custom Docker image
- Run your test code inside a container

---

## Part 1: Why Create Your Own Image?

### So Far: Using Someone Else's Image

In previous lessons, you used images others created:

```bash
docker pull seleniarm/standalone-chromium   # Someone else made this
```

### The Problem

What if you need:
- Your test code inside the container?
- Specific tools installed?
- Custom configuration?

**You need to create your OWN image!**

---

## Part 2: What is a Dockerfile?

A **Dockerfile** is a text file with instructions to build a Docker image.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Dockerfile              docker build           Image       │
│  ┌─────────────┐         ┌─────────┐         ┌──────────┐  │
│  │ FROM node   │         │         │         │          │  │
│  │ COPY . .    │  ─────► │  Build  │  ─────► │ my-image │  │
│  │ RUN npm i   │         │         │         │          │  │
│  └─────────────┘         └─────────┘         └──────────┘  │
│                                                             │
│  Recipe (text file)       Cooking              Dish         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Think of it like a **recipe**:
- Dockerfile = Recipe written on paper
- `docker build` = Cooking
- Image = The finished dish

---

## Part 3: Dockerfile Instructions

A Dockerfile uses special commands. Here are the most important ones:

### FROM - Starting Point

```dockerfile
FROM node:20
```

**What it means:** "Start with the Node.js 20 image as base"

```
┌─────────────────────────────────────────────────────────────┐
│  FROM = "What image do I start with?"                       │
│                                                             │
│  FROM node:20                                               │
│       │    │                                                │
│       │    └── Version (tag)                                │
│       └── Image name                                        │
│                                                             │
│  Examples:                                                  │
│  FROM node:20           ← Start with Node.js 20             │
│  FROM python:3.11       ← Start with Python 3.11            │
│  FROM ubuntu:22.04      ← Start with Ubuntu Linux           │
└─────────────────────────────────────────────────────────────┘
```

**Every Dockerfile MUST start with FROM.**

---

### WORKDIR - Set Working Directory

```dockerfile
WORKDIR /app
```

**What it means:** "Create /app folder and work inside it"

```
┌─────────────────────────────────────────────────────────────┐
│  WORKDIR = "Where should I work inside the container?"      │
│                                                             │
│  WORKDIR /app                                               │
│          │                                                  │
│          └── All following commands run in this folder      │
│                                                             │
│  Like doing: mkdir /app && cd /app                          │
└─────────────────────────────────────────────────────────────┘
```

---

### COPY - Copy Files Into Container

```dockerfile
COPY . .
```

**What it means:** "Copy files from my computer into the container"

```
┌─────────────────────────────────────────────────────────────┐
│  COPY = "Copy files from my computer into the container"    │
│                                                             │
│  COPY . .                                                   │
│       │ │                                                   │
│       │ └── Destination (inside container): current folder  │
│       └── Source (your computer): current folder            │
│                                                             │
│  COPY . .         ← Copy everything from here to container  │
│  COPY src/ /app/  ← Copy src folder to /app in container    │
│  COPY package.json .  ← Copy just package.json              │
└─────────────────────────────────────────────────────────────┘
```

---

### RUN - Execute Commands

```dockerfile
RUN npm install
```

**What it means:** "Run this command while building the image"

```
┌─────────────────────────────────────────────────────────────┐
│  RUN = "Execute this command during build"                  │
│                                                             │
│  RUN npm install                                            │
│      │                                                      │
│      └── The command to run                                 │
│                                                             │
│  Examples:                                                  │
│  RUN npm install           ← Install Node packages          │
│  RUN pip install pytest    ← Install Python packages        │
│  RUN apt-get update        ← Update Linux packages          │
└─────────────────────────────────────────────────────────────┘
```

---

### CMD - Default Command When Container Starts

```dockerfile
CMD ["npm", "test"]
```

**What it means:** "When someone runs this container, execute this command"

```
┌─────────────────────────────────────────────────────────────┐
│  CMD = "What should happen when the container starts?"      │
│                                                             │
│  CMD ["npm", "test"]                                        │
│       │                                                     │
│       └── Run "npm test" when container starts              │
│                                                             │
│  Format: CMD ["command", "arg1", "arg2"]                    │
│                                                             │
│  Examples:                                                  │
│  CMD ["npm", "test"]           ← Run tests                  │
│  CMD ["python", "main.py"]     ← Run Python script          │
│  CMD ["node", "server.js"]     ← Start Node server          │
└─────────────────────────────────────────────────────────────┘
```

---

### Summary of Instructions

| Instruction | Purpose | Example |
|-------------|---------|---------|
| `FROM` | Base image to start with | `FROM node:20` |
| `WORKDIR` | Set working directory | `WORKDIR /app` |
| `COPY` | Copy files into container | `COPY . .` |
| `RUN` | Run command during build | `RUN npm install` |
| `CMD` | Default command when container starts | `CMD ["npm", "test"]` |

---

## Part 4: Your First Dockerfile

Let's create a Dockerfile for your Selenium test!

### Step 1: Understand What We Need

```
┌─────────────────────────────────────────────────────────────┐
│  What we want in our container:                             │
│                                                             │
│  1. Node.js (to run TypeScript)                             │
│  2. Our test code files                                     │
│  3. npm packages installed (selenium-webdriver, etc.)       │
│  4. Run the test when container starts                      │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Write the Dockerfile

Create a file called `Dockerfile` (no extension!) in your test folder:

```
docker-selenium-test/
├── Dockerfile              ← Create this!
├── package.json
├── tsconfig.json
└── test_docker_selenium.ts
```

**Dockerfile contents:**

```dockerfile
# Step 1: Start with Node.js
FROM node:20

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files first (for better caching)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of our code
COPY . .

# Step 6: Command to run when container starts
CMD ["npx", "ts-node", "test_docker_selenium.ts"]
```

---

### Step 3: Line-by-Line Explanation

```dockerfile
FROM node:20
```
| Part | Meaning |
|------|---------|
| `FROM` | Start with this base image |
| `node:20` | Official Node.js image, version 20 |

This gives us: Linux + Node.js + npm already installed.

---

```dockerfile
WORKDIR /app
```
| Part | Meaning |
|------|---------|
| `WORKDIR` | Set working directory |
| `/app` | Create and use /app folder inside container |

Everything after this happens inside `/app`.

---

```dockerfile
COPY package*.json ./
```
| Part | Meaning |
|------|---------|
| `COPY` | Copy files from your computer |
| `package*.json` | package.json and package-lock.json (the * is wildcard) |
| `./` | To current directory in container (/app) |

We copy package files first for better caching (optimization).

---

```dockerfile
RUN npm install
```
| Part | Meaning |
|------|---------|
| `RUN` | Execute this during build |
| `npm install` | Install all packages from package.json |

This installs selenium-webdriver, typescript, etc.

---

```dockerfile
COPY . .
```
| Part | Meaning |
|------|---------|
| `COPY` | Copy files |
| `. ` (first dot) | From current folder on your computer |
| `.` (second dot) | To current folder in container (/app) |

This copies your test code into the container.

---

```dockerfile
CMD ["npx", "ts-node", "test_docker_selenium.ts"]
```
| Part | Meaning |
|------|---------|
| `CMD` | Run this when container starts |
| `["npx", "ts-node", "test_docker_selenium.ts"]` | Run your test |

---

## Part 5: Build Your Image

### The Command

```bash
docker build -t my-selenium-test .
```

**Let's break it down:**

| Part | Meaning |
|------|---------|
| `docker build` | Build an image from Dockerfile |
| `-t my-selenium-test` | Name (tag) the image "my-selenium-test" |
| `.` | Look for Dockerfile in current directory |

---

### What Happens During Build

```
docker build -t my-selenium-test .

Step 1/6 : FROM node:20
 ---> Downloading node:20 image...

Step 2/6 : WORKDIR /app
 ---> Creating /app directory...

Step 3/6 : COPY package*.json ./
 ---> Copying package files...

Step 4/6 : RUN npm install
 ---> Installing packages...

Step 5/6 : COPY . .
 ---> Copying test code...

Step 6/6 : CMD ["npx", "ts-node", "test_docker_selenium.ts"]
 ---> Setting default command...

Successfully built abc123def456
Successfully tagged my-selenium-test:latest
```

---

## Part 6: Run Your Custom Image

### Important: Two Containers Needed!

Your test needs to connect to Selenium. So you need:

1. **Selenium container** (browser) - already running from Lesson 2
2. **Your test container** (your code) - we'll run this

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Container 1: Selenium          Container 2: Your Test      │
│  ┌───────────────────┐         ┌───────────────────┐       │
│  │                   │         │                   │       │
│  │  Chromium Browser │ ◄────── │  Your test code   │       │
│  │  (from Lesson 2)  │         │  (from Lesson 4)  │       │
│  │                   │         │                   │       │
│  │  Port: 4444       │         │  Connects to 4444 │       │
│  └───────────────────┘         └───────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The Problem: localhost Doesn't Work!

In your test code, you have:

```typescript
.usingServer('http://localhost:4444')
```

**This won't work!** Why?

```
┌─────────────────────────────────────────────────────────────┐
│  When running on YOUR COMPUTER:                             │
│                                                             │
│  localhost = your Mac                                       │
│  Your Mac has port 4444 mapped to Selenium container ✅     │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  When running INSIDE A CONTAINER:                           │
│                                                             │
│  localhost = the container itself (not your Mac!)           │
│  The container doesn't have Selenium on port 4444 ❌        │
└─────────────────────────────────────────────────────────────┘
```

### The Solution: Docker Network

We need to connect both containers and use the Selenium container's name.

For now, let's run the test differently - we'll learn Docker networking in Lesson 5 (Docker Compose).

---

## 🔨 Hands-On Exercise 1: Create the Dockerfile

**Task:** Create the Dockerfile

```bash
cd /Users/ludovicus/docker-learning-guide/docker-selenium-test
```

Create a file called `Dockerfile` (exactly this name, no extension) with this content:

```dockerfile
# Start with Node.js
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy test code
COPY . .

# Default command
CMD ["npx", "ts-node", "test_docker_selenium.ts"]
```

---

## 🔨 Hands-On Exercise 2: Build the Image

**Task:** Build your image

```bash
docker build -t my-selenium-test .
```

**What to look for:**
- Should see Steps 1/6 through 6/6
- Should end with "Successfully built" and "Successfully tagged"

---

## 🔨 Hands-On Exercise 3: Verify Your Image

**Task:** Check that your image was created

```bash
docker images
```

**You should see:**

```
REPOSITORY                     TAG       SIZE
my-selenium-test               latest    ~1GB
seleniarm/standalone-chromium  latest    ~2GB
node                           20        ~1GB
```

---

## Part 7: What You Built

```
┌─────────────────────────────────────────────────────────────┐
│  Your custom image: my-selenium-test                        │
│                                                             │
│  Contains:                                                  │
│  ├── Linux operating system (from node:20)                  │
│  ├── Node.js 20 (from node:20)                              │
│  ├── npm (from node:20)                                     │
│  ├── Your package.json                                      │
│  ├── node_modules/ (selenium-webdriver, typescript, etc.)   │
│  ├── Your tsconfig.json                                     │
│  └── Your test_docker_selenium.ts                           │
│                                                             │
│  When run: Executes "npx ts-node test_docker_selenium.ts"   │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 8: CI/CD Connection

In CI/CD (GitHub Actions), you would:

1. Build your test image
2. Run Selenium container
3. Run your test container
4. Tests connect to Selenium

```yaml
# Example GitHub Actions workflow (preview)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build test image
        run: docker build -t my-selenium-test .
      
      - name: Start Selenium
        run: docker run -d --name selenium selenium/standalone-chrome
      
      - name: Run tests
        run: docker run --network container:selenium my-selenium-test
```

We'll learn this properly in Lesson 5 (Docker Compose) and Lesson 6 (CI/CD).

---

## Summary

| Concept | Explanation |
|---------|-------------|
| **Dockerfile** | Text file with instructions to build an image |
| **FROM** | Base image to start with |
| **WORKDIR** | Set working directory in container |
| **COPY** | Copy files from your computer into container |
| **RUN** | Execute command during build |
| **CMD** | Default command when container starts |
| **docker build** | Create image from Dockerfile |
| **-t name** | Give the image a name |

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│                   LESSON 4 CHEAT SHEET                         │
├────────────────────────────────────────────────────────────────┤
│ Dockerfile format:                                             │
│   FROM node:20              # Base image                       │
│   WORKDIR /app              # Working directory                │
│   COPY package*.json ./     # Copy files                       │
│   RUN npm install           # Run during build                 │
│   COPY . .                  # Copy more files                  │
│   CMD ["npm", "test"]       # Run when container starts        │
├────────────────────────────────────────────────────────────────┤
│ Build image:      docker build -t image-name .                 │
│ List images:      docker images                                │
│ Remove image:     docker rmi image-name                        │
└────────────────────────────────────────────────────────────────┘
```

---

## Next Lesson

**Lesson 5: Docker Compose**
- Run multiple containers together
- Connect Selenium + your test automatically
- One command to start everything
