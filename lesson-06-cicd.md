# Lesson 6: CI/CD Integration - Automating Your Tests

## What You'll Learn

- What CI/CD is and why you need it
- How GitHub Actions works
- Run your Docker tests automatically on every push
- Create a real CI/CD pipeline

---

## Part 1: What is CI/CD?

### CI = Continuous Integration

**"Automatically test code every time someone pushes changes"**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  WITHOUT CI:                                                │
│                                                             │
│  Developer pushes code → Nothing happens                    │
│  Bug discovered 2 weeks later → Expensive to fix!           │
│                                                             │
│  ───────────────────────────────────────────────────────────│
│                                                             │
│  WITH CI:                                                   │
│                                                             │
│  Developer pushes code → Tests run automatically            │
│  Bug found immediately → Easy to fix!                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### CD = Continuous Deployment/Delivery

**"Automatically deploy code after tests pass"**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Push code → Tests pass → Deploy to production              │
│              (automatic)    (automatic)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### For QA Engineers

As a QA engineer, you'll mostly work with **CI** - running tests automatically.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Your Role in CI/CD:                                        │
│                                                             │
│  1. Write automated tests                                   │
│  2. Configure tests to run in CI pipeline                   │
│  3. Tests run automatically on every code push              │
│  4. Get notified if tests fail                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 2: What is GitHub Actions?

**GitHub Actions** = GitHub's built-in CI/CD tool.

When you push code to GitHub, it can automatically:
- Run your tests
- Build your application
- Deploy to servers
- Send notifications

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  You: Push code to GitHub                                   │
│         │                                                   │
│         ▼                                                   │
│  GitHub Actions: "I see new code! Let me run the tests"     │
│         │                                                   │
│         ▼                                                   │
│  GitHub's Server: Runs your Docker containers               │
│         │                                                   │
│         ▼                                                   │
│  Result: ✅ Pass or ❌ Fail (shown on GitHub)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 3: How GitHub Actions Works

### Workflow File

You create a YAML file in your repository:

```
your-project/
├── .github/
│   └── workflows/
│       └── test.yml    ← This file tells GitHub what to do
├── src/
├── tests/
└── ...
```

### Key Concepts

| Term | Meaning |
|------|---------|
| **Workflow** | The entire automation process (the .yml file) |
| **Job** | A set of steps that run on the same machine |
| **Step** | A single task (run a command, checkout code, etc.) |
| **Runner** | The machine that runs your job |
| **Trigger** | What starts the workflow (push, pull request, etc.) |

---

## Part 4: Anatomy of a Workflow File

```yaml
name: Run Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run tests
        run: docker-compose up --build --abort-on-container-exit
```

### Line-by-Line Explanation

```yaml
name: Run Tests
```
| Part | Meaning |
|------|---------|
| `name:` | Display name of this workflow |
| `Run Tests` | What you'll see in GitHub UI |

---

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```
| Part | Meaning |
|------|---------|
| `on:` | "When should this workflow run?" |
| `push:` | When code is pushed |
| `branches: [main]` | Only on main branch |
| `pull_request:` | When a PR is created |

**This means:** Run tests when someone pushes to main OR creates a pull request to main.

---

```yaml
jobs:
  test:
```
| Part | Meaning |
|------|---------|
| `jobs:` | "Here are the jobs to run" |
| `test:` | Name of this job (your choice) |

---

```yaml
    runs-on: ubuntu-latest
```
| Part | Meaning |
|------|---------|
| `runs-on:` | Which machine to use |
| `ubuntu-latest` | Latest Ubuntu Linux |

GitHub provides free Linux, Windows, and macOS machines.

---

```yaml
    steps:
```
"Here are the steps for this job"

---

```yaml
      - name: Checkout code
        uses: actions/checkout@v4
```
| Part | Meaning |
|------|---------|
| `name:` | Display name for this step |
| `uses:` | Use a pre-built action |
| `actions/checkout@v4` | Official GitHub action to download your code |

**Why needed?** The GitHub runner starts empty - it needs to download your code first!

---

```yaml
      - name: Run tests
        run: docker-compose up --build --abort-on-container-exit
```
| Part | Meaning |
|------|---------|
| `run:` | Execute this shell command |
| `docker-compose up --build` | Start your containers and run tests |
| `--abort-on-container-exit` | Stop when test container exits |

---

## Part 5: Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│  WHAT HAPPENS WHEN YOU PUSH CODE:                           │
│                                                             │
│  1. You: git push                                           │
│         │                                                   │
│         ▼                                                   │
│  2. GitHub: "I see a push! Checking for workflows..."       │
│         │                                                   │
│         ▼                                                   │
│  3. GitHub: "Found .github/workflows/test.yml"              │
│         │                                                   │
│         ▼                                                   │
│  4. GitHub: Starts a fresh Ubuntu machine                   │
│         │                                                   │
│         ▼                                                   │
│  5. Runner: Checks out your code                            │
│         │                                                   │
│         ▼                                                   │
│  6. Runner: Runs docker-compose up                          │
│         │                                                   │
│         ▼                                                   │
│  7. Docker: Starts Selenium container                       │
│         │                                                   │
│         ▼                                                   │
│  8. Docker: Starts test container                           │
│         │                                                   │
│         ▼                                                   │
│  9. Test: Connects to Selenium, runs tests                  │
│         │                                                   │
│         ▼                                                   │
│  10. Result: ✅ or ❌ shown on GitHub                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 6: Our Complete Workflow

Here's the workflow file for your project:

```yaml
name: Selenium Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run Selenium tests with Docker Compose
        run: |
          cd docker-selenium-test
          docker-compose up --build --abort-on-container-exit
        
      - name: Show test logs on failure
        if: failure()
        run: |
          cd docker-selenium-test
          docker-compose logs test
```

### What Each Step Does

| Step | Purpose |
|------|---------|
| Checkout code | Download your repository |
| Run Selenium tests | Start containers and run tests |
| Show test logs on failure | If tests fail, show what went wrong |

---

## Part 7: Important - Update docker-compose.yml

GitHub Actions uses **Intel/AMD** machines (not Apple Silicon). We need to update the Selenium image:

```yaml
services:
  selenium:
    image: selenium/standalone-chrome:latest   # Intel/AMD version
    # NOT seleniarm/standalone-chromium (that's for Apple Silicon)
```

### Solution: Use Different Images

We'll create a **separate docker-compose file** for CI:

**docker-compose.ci.yml** (for GitHub Actions - Intel):
```yaml
services:
  selenium:
    image: selenium/standalone-chrome:latest
    ports:
      - "4444:4444"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4444/status"]
      interval: 5s
      timeout: 10s
      retries: 10
      start_period: 10s

  test:
    build: .
    depends_on:
      selenium:
        condition: service_healthy
    environment:
      - SELENIUM_URL=http://selenium:4444
```

**docker-compose.yml** (for your Mac - Apple Silicon):
```yaml
services:
  selenium:
    image: seleniarm/standalone-chromium:latest
    # ... rest stays the same
```

---

## Part 8: Updated Workflow for CI

```yaml
name: Selenium Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run Selenium tests
        working-directory: docker-selenium-test
        run: docker-compose -f docker-compose.ci.yml up --build --abort-on-container-exit
        
      - name: Show logs on failure
        if: failure()
        working-directory: docker-selenium-test
        run: docker-compose -f docker-compose.ci.yml logs
```

The `-f docker-compose.ci.yml` tells Docker Compose to use the CI-specific file.

---

## 🔨 Hands-On Exercise 1: Create CI Compose File

**Task:** Create the CI-specific docker-compose file.

Create `docker-compose.ci.yml` in your test folder:

```yaml
services:
  selenium:
    image: selenium/standalone-chrome:latest
    ports:
      - "4444:4444"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4444/status"]
      interval: 5s
      timeout: 10s
      retries: 10
      start_period: 10s

  test:
    build: .
    depends_on:
      selenium:
        condition: service_healthy
    environment:
      - SELENIUM_URL=http://selenium:4444
```

---

## 🔨 Hands-On Exercise 2: Create Workflow File

**Task:** Create the GitHub Actions workflow.

Create the folder structure:

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/test.yml`:

```yaml
name: Selenium Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run Selenium tests
        working-directory: docker-selenium-test
        run: docker-compose -f docker-compose.ci.yml up --build --abort-on-container-exit
        
      - name: Show logs on failure
        if: failure()
        working-directory: docker-selenium-test
        run: docker-compose -f docker-compose.ci.yml logs
```

---

## 🔨 Hands-On Exercise 3: Push to GitHub

**Task:** Create a GitHub repository and push your code.

1. Go to https://github.com/new
2. Create a new repository (e.g., "docker-selenium-tests")
3. Follow the instructions to push your code:

```bash
cd /Users/ludovicus/docker-learning-guide
git init
git add .
git commit -m "Add Docker Selenium tests with CI/CD"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/docker-selenium-tests.git
git push -u origin main
```

---

## 🔨 Hands-On Exercise 4: Watch It Run

**Task:** See your tests run automatically!

1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. Watch your workflow run!

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub Actions UI                                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✅ Selenium Tests                                   │   │
│  │    Run #1 - Triggered by push to main               │   │
│  │                                                     │   │
│  │    Jobs:                                            │   │
│  │    ✅ test (2m 34s)                                 │   │
│  │       ✅ Checkout code                              │   │
│  │       ✅ Run Selenium tests                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 9: Understanding CI Results

### Success

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ All checks have passed                                  │
│                                                             │
│  Your tests ran successfully. The code is good!             │
└─────────────────────────────────────────────────────────────┘
```

### Failure

```
┌─────────────────────────────────────────────────────────────┐
│  ❌ Some checks failed                                      │
│                                                             │
│  Click to see details → Find "Show logs on failure" step    │
│  → See what went wrong                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 10: Real-World CI/CD Tips

### 1. Run Tests on Pull Requests

```yaml
on:
  pull_request:
    branches: [main]
```

Tests run BEFORE code is merged → Catch bugs early!

### 2. Add Status Badge to README

Add this to your README.md:

```markdown
![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test.yml/badge.svg)
```

Shows test status on your repo page!

### 3. Parallel Tests

For faster runs, you can run multiple test containers:

```yaml
jobs:
  test:
    strategy:
      matrix:
        browser: [chrome, firefox]
```

---

## Summary

| Concept | Explanation |
|---------|-------------|
| **CI/CD** | Automatically test/deploy code on every push |
| **GitHub Actions** | GitHub's CI/CD tool |
| **Workflow** | YAML file that defines what to do |
| **Job** | A set of steps on one machine |
| **Step** | A single task |
| **Trigger** | What starts the workflow (push, PR, etc.) |

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│                   LESSON 6 CHEAT SHEET                         │
├────────────────────────────────────────────────────────────────┤
│ Workflow file location:                                        │
│   .github/workflows/your-workflow.yml                          │
├────────────────────────────────────────────────────────────────┤
│ Common triggers:                                               │
│   on: push           - Run on every push                       │
│   on: pull_request   - Run on PR                               │
│   on: schedule       - Run on schedule (cron)                  │
├────────────────────────────────────────────────────────────────┤
│ Common actions:                                                │
│   actions/checkout@v4    - Download your code                  │
│   actions/setup-node@v4  - Install Node.js                     │
├────────────────────────────────────────────────────────────────┤
│ Docker Compose in CI:                                          │
│   docker-compose -f docker-compose.ci.yml up --build           │
│   --abort-on-container-exit                                    │
└────────────────────────────────────────────────────────────────┘
```

---

## What You've Accomplished

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🎉 CONGRATULATIONS!                                        │
│                                                             │
│  You've completed the Docker Learning Guide!                │
│                                                             │
│  You can now:                                               │
│  ✅ Run Docker containers                                   │
│  ✅ Create your own Docker images                           │
│  ✅ Use Docker Compose for multi-container setups           │
│  ✅ Run Selenium tests in Docker                            │
│  ✅ Set up CI/CD pipelines                                  │
│                                                             │
│  These are essential skills for QA Automation Engineers!    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
