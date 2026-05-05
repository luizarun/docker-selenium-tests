# Docker Learning Guide for QA Automation Engineers

> A hands-on, step-by-step guide to learning Docker from scratch.

---

## Prerequisites

- [ ] macOS, Windows, or Linux computer
- [ ] Docker Desktop installed (we'll do this in Lesson 1)
- [ ] Basic command line knowledge

---

## Learning Path

| Lesson | Topic | Status |
|--------|-------|--------|
| 1 | Installing Docker & First Container | ⬜ |
| 2 | Understanding Images vs Containers | ⬜ |
| 3 | Essential Docker Commands | ⬜ |
| 4 | Running Selenium in Docker | ⬜ |
| 5 | Creating Your First Dockerfile | ⬜ |
| 6 | Docker Compose Basics | ⬜ |
| 7 | Building a Test Environment | ⬜ |

---

## Quick Reference

### Most Used Commands

```bash
# See what's running
docker ps

# See all containers (including stopped)
docker ps -a

# Run a container
docker run <image-name>

# Stop a container
docker stop <container-name>

# Remove a container
docker rm <container-name>

# See downloaded images
docker images

# View logs
docker logs <container-name>
```

---

## Glossary

| Term | Simple Explanation |
|------|-------------------|
| **Container** | A running instance of an image - like a lightweight mini-computer |
| **Image** | A template/blueprint used to create containers |
| **Dockerfile** | A recipe file with instructions to build an image |
| **Docker Hub** | Online store where you download images (like an app store) |
| **Volume** | A way to save data outside the container |
| **Port Mapping** | Connecting container's ports to your computer's ports |

---

## Lessons

Each lesson is in its own file in this folder. Complete them in order!

