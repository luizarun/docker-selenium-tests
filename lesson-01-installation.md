# Lesson 1: Installing Docker & Your First Container

## Why Docker Matters for QA Automation Engineers

Before we start, here's **why you're learning this**:

```
WITHOUT DOCKER (The Problem):
┌─────────────────────────────────────────────────────────────┐
│ Your CI/CD Pipeline (Jenkins/GitHub Actions)               │
│                                                             │
│  Test Run #1: ✅ Passed (Chrome 120, Java 17)              │
│  Test Run #2: ❌ Failed (Chrome 121 auto-updated!)         │
│  Test Run #3: ❌ Failed (Someone changed Java version)     │
│                                                             │
│  "It works on my machine!" → But fails in CI/CD            │
└─────────────────────────────────────────────────────────────┘

WITH DOCKER (The Solution):
┌─────────────────────────────────────────────────────────────┐
│ Your CI/CD Pipeline                                         │
│                                                             │
│  Test Run #1: ✅ Passed (Docker: Chrome 120, Java 17)      │
│  Test Run #2: ✅ Passed (Same Docker image = same setup)   │
│  Test Run #3: ✅ Passed (Always consistent!)               │
│                                                             │
│  Same environment everywhere = Reliable tests              │
└─────────────────────────────────────────────────────────────┘
```

**In CI/CD pipelines**, Docker ensures your tests run in the exact same environment every time - whether it's on your laptop, your colleague's machine, or the CI server.

---

## Goal of This Lesson

By the end, you will:
- ✅ Have Docker installed
- ✅ Run your first container
- ✅ Understand the difference between Image and Container

---

## Part 1: Understanding Image vs Container

**Before installing, let's understand what we're working with.**

Think about your CI/CD pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│                        DOCKER HUB                           │
│            (Online storage - like GitHub for Docker)        │
│                                                             │
│  📦 selenium/standalone-chrome  (Chrome + Selenium ready)   │
│  📦 maven:3.9-eclipse-temurin-17 (Java 17 + Maven)          │
│  📦 mysql:8.0                    (Database for tests)       │
└─────────────────────────────────────────────────────────────┘
                              │
                        You download
                         (one time)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     YOUR COMPUTER                           │
│                                                             │
│  📦 IMAGE = A saved snapshot (like a .zip file)            │
│     - Not running, just stored on your disk                │
│     - Contains: OS + Chrome + Selenium + all settings      │
│     - Downloaded once, used many times                     │
│                                                             │
│                         │                                   │
│                   docker run                                │
│                         ▼                                   │
│                                                             │
│  🟢 CONTAINER = A running instance (like unzipping & running)
│     - Actually running Chrome browser                      │
│     - Your tests connect to this                           │
│     - Stops when tests finish                              │
│     - You can run multiple containers from 1 image         │
└─────────────────────────────────────────────────────────────┘
```

### Simple Comparison

| Concept | What It Is | Real-Life Analogy |
|---------|-----------|-------------------|
| **Image** | A frozen template saved on disk | A recipe card |
| **Container** | A running instance from that template | The actual dish you cooked |

**Key Point:** One image → Many containers (like one recipe → many dishes)

---

## Part 2: Install Docker Desktop

### Step 1: Download

1. Go to: https://www.docker.com/products/docker-desktop/
2. Click **"Download for Mac"**
3. Choose your chip:
   - **Apple Silicon** → M1, M2, M3, M4 Macs
   - **Intel** → Older Macs

> **Not sure which chip?** Click Apple menu () → "About This Mac" → Check "Chip"

### Step 2: Install

1. Open the downloaded `.dmg` file
2. Drag Docker icon to Applications folder
3. Open Docker from Applications
4. Wait for startup (whale icon appears in menu bar 🐳)
5. May ask for password - this is normal

### Step 3: Verify Installation

Open **Terminal** and type:

```bash
docker --version
```

**What you should see:**
```
Docker version 24.0.6, build ed223bc
```

(Your version number may be different - that's okay)

**If you see a version number, Docker is installed! ✅**

---

## Part 3: Run Your First Container

Now let's see Docker in action.

### Step 1: Run the hello-world Container

Type this in Terminal:

```bash
docker run hello-world
```

### Step 2: Watch What Happens

```
Unable to find image 'hello-world:latest' locally    ← Step 1: Looks on your computer
latest: Pulling from library/hello-world             ← Step 2: Downloads from Docker Hub
...
Status: Downloaded newer image for hello-world:latest ← Step 3: Saves image locally

Hello from Docker!                                    ← Step 4: Container runs & prints this
This message shows that your installation appears to be working correctly.
```

### Step 3: Understand the Process

```
What just happened:

┌──────────────────────────────────────────────────────────┐
│ 1. docker run hello-world                                │
│    ↓                                                     │
│ 2. Docker checks: "Do I have this image locally?"        │
│    → No                                                  │
│    ↓                                                     │
│ 3. Docker downloads image from Docker Hub                │
│    ↓                                                     │
│ 4. Docker creates a CONTAINER from the IMAGE             │
│    ↓                                                     │
│ 5. Container runs → prints message → exits               │
└──────────────────────────────────────────────────────────┘
```

---

## Part 4: Useful Commands to Try

Now let's learn commands you'll use every day:

### See All Containers (Including Stopped Ones)

```bash
docker ps -a
```

**What you'll see:**
```
CONTAINER ID   IMAGE         COMMAND    STATUS                     NAMES
a1b2c3d4e5f6   hello-world   "/hello"   Exited (0) 2 minutes ago   friendly_name
```

**Translation:**
- A container was created from `hello-world` image
- It ran and exited (status code 0 = success)
- Docker gave it a random name (`friendly_name`)

### See Only Running Containers

```bash
docker ps
```

**What you'll see:** Nothing! (because hello-world already exited)

### See Downloaded Images

```bash
docker images
```

**What you'll see:**
```
REPOSITORY    TAG       IMAGE ID       SIZE
hello-world   latest    d2c94e258dcb   13.3kB
```

This shows the `hello-world` image is now saved on your computer.

---

## Part 5: CI/CD Preview

Here's how this connects to your work as a QA automation engineer.

### First: What is YAML?

**YAML** = A simple text file format for writing configuration/settings

Think of it like filling out a form, but in a text file:

```
REGULAR FORM:                         YAML VERSION:
┌─────────────────────────┐           
│ Name: [John           ] │           name: John
│ Age:  [30             ] │           age: 30
│ City: [New York       ] │           city: New York
└─────────────────────────┘           
```

**Key rules:**
- `key: value` format (colon + space between them)
- Indentation (spaces) shows what belongs to what
- No special symbols needed - just plain text

### Now: A Real GitHub Actions Example

In a **GitHub Actions** workflow file, you might see:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container: maven:3.9-eclipse-temurin-17
    
    steps:
      - name: Run tests
        run: mvn test
```

### Line-by-Line Explanation

| Line | What It Means |
|------|---------------|
| `jobs:` | "Here are the jobs to do" |
| `  test:` | Job name is "test" (indented = belongs to jobs) |
| `    runs-on: ubuntu-latest` | Run on Ubuntu Linux machine |
| `    container: maven:3.9...` | **USE THIS DOCKER IMAGE!** |
| `    steps:` | "Here are the steps for this job" |
| `      - name: Run tests` | Step 1's display name (- means list item) |
| `        run: mvn test` | The actual command to execute |

### Visual Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS                          │
│                                                             │
│  "Hey GitHub, when code is pushed..."                       │
│                                                             │
│  jobs:                                                      │
│    └── test:                    (create a job called test)  │
│          │                                                  │
│          ├── runs-on: ubuntu    (use Linux machine)         │
│          │                                                  │
│          ├── container: maven:3.9...  ← DOCKER IMAGE!       │
│          │   │                                              │
│          │   └── This downloads the Docker image and        │
│          │       runs everything inside a container         │
│          │                                                  │
│          └── steps:                                         │
│                └── run: mvn test  (run Maven tests)         │
└─────────────────────────────────────────────────────────────┘
```

### What Happens When This Runs

1. CI/CD pipeline starts
2. Downloads `maven:3.9-eclipse-temurin-17` **image** from Docker Hub
3. Creates a **container** from that image
4. Runs `mvn test` inside that container
5. Container stops when done

**This is exactly what you did with `docker run hello-world`** - just automated in a pipeline!

### Why This Matters

Same environment every time = No more "it works on my machine" problems

---

## Checkpoint: Self-Test

Answer these before moving to Lesson 2:

| Question | Your Answer |
|----------|-------------|
| 1. Where do Docker images come from? | Docker Hub (online storage) |
| 2. What's the difference between image and container? | Image = saved template, Container = running instance |
| 3. What command shows all containers? | `docker ps -a` |
| 4. What command shows only running containers? | `docker ps` |
| 5. Why use Docker in CI/CD? | Consistent test environment every time |

---

## Summary

What you learned:
- **Image** = A saved snapshot/template (downloaded from Docker Hub)
- **Container** = A running instance created from an image
- **docker run** = Creates and runs a container
- **docker ps** = Shows running containers
- **docker ps -a** = Shows all containers
- **docker images** = Shows downloaded images

---

## Next Lesson

**Lesson 2: Working with Real Images**
- Pull the Selenium Chrome image
- Run a browser in a container
- Connect to it from your test code

---

## Quick Reference Card

```
┌────────────────────────────────────────────────┐
│            LESSON 1 CHEAT SHEET               │
├────────────────────────────────────────────────┤
│ Check Docker installed:  docker --version     │
│ Run a container:         docker run <image>   │
│ See running containers:  docker ps            │
│ See all containers:      docker ps -a         │
│ See downloaded images:   docker images        │
├────────────────────────────────────────────────┤
│ Image = Template (stored on disk)             │
│ Container = Running instance                   │
└────────────────────────────────────────────────┘
```
