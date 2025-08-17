

```
             +----------------+
             |      main      |
             | (stable code)  |
             +----------------+
                     ^
                     |
           Merge tested features
                     |
    -----------------------------------
    |                 |               |
+-----------+   +-----------+   +-----------+
| frontend  |   | backend   |   | database  |
| (UI/UX)   |   | (API)     |   | (DB logic)|
+-----------+   +-----------+   +-----------+
    |                 |               |
 Pull/Pull/Pull       Pull/Pull/Pull  Pull/Pull/Pull
    |                 |               |
 Work locally -> commit -> push -> merge into main
```

---

## **Workflow Steps**

1. **Start your day / task**

   * `git checkout <branch>` (frontend, backend, database)
   * `git pull origin <branch>` (always pull first)

2. **Work locally**

   * Edit files, add features, fix bugs.

3. **Stage & commit**

   ```bash
   git add .
   git commit -m "Descriptive message"
   ```

4. **Push to remote**

   ```bash
   git push origin <branch>
   ```

5. **Merging into main**

   * Only merge tested and stable code.

   ```bash
   git checkout main
   git pull origin main
   git merge frontend   # or backend/database
   git push origin main
   ```

6. **Switch branches safely**

   * Commit changes first or stash them:

   ```bash
   git stash
   git checkout backend
   git stash pop
   ```

---

✅ **Rules to follow**

* **Never work directly on main.**
* **Pull before starting work.**
* **Push after finishing work.**
* **Merge only tested code into main.**

---

1️⃣ Initial Setup (once)
# Clone the repo (if not already)
git clone https://github.com/LifeofNabin/TrackU.git
cd TrackU

# List remote branches
git branch -r

# Create local branches tracking remote branches
git checkout -b frontend origin/frontend
git checkout -b backend origin/backend
git checkout -b database origin/database

# Switch to main branch
git checkout main

2️⃣ Start Your Day / Task

Always pull the latest changes first

# Switch to the branch you will work on
git checkout frontend
git pull origin frontend


Work on the code in this branch (frontend, backend, or database)

Make small commits often

3️⃣ Stage & Commit Your Changes
# Stage all changed files
git add .

# Commit with a descriptive message
git commit -m "Implemented Register page API integration"


Commit messages should clearly describe what you did.

4️⃣ Push Changes to Remote
git push origin frontend


This updates your remote branch and keeps work safe.

5️⃣ Switch Branches Safely

If you need to move to another branch:

# Stash changes if not committed
git stash

# Switch to another branch
git checkout backend
git pull origin backend

# Apply stashed changes (if needed)
git stash pop

6️⃣ Merge into Main

Only merge tested and stable code into main.

# Switch to main branch
git checkout main
git pull origin main

# Merge your feature branch (frontend/backend/database)
git merge frontend   # resolve conflicts if any

# Push main branch after merge
git push origin main


Conflicts must be resolved before pushing.

7️⃣ Keeping Everything Synced

Always pull before starting work: git pull origin <branch>

Commit often

Push often

Merge only stable code into main
