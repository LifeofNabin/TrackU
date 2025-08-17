

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

