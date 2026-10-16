---
title: SQL · PostgreSQL
short: SQL · PostgreSQL
description: Joins, classic query questions, window functions, indexes, EXPLAIN ANALYZE, stored procedures vs functions, transactions and design, all on PostgreSQL.
order: 6
icon: 🐘
color: blue
---

> [!tip] Sample tables used on this page
> ```sql
> employees(id, name, salary, dept_id, manager_id, joined_on)
> departments(id, name)
> ```
> | id | name | salary | dept_id | manager_id |
> |---|---|---|---|---|
> | 1 | Asha | 90000 | 1 | NULL |
> | 2 | Ravi | 70000 | 1 | 1 |
> | 3 | Meena | 70000 | 2 | 1 |
> | 4 | Tanay | 60000 | 2 | 3 |
> | 5 | Kiran | 50000 | NULL | 3 |
>
> Infosys SQL questions are usually **write-a-query** (2nd highest salary, duplicates, joins, group by) plus **theory on indexes, procedures and performance**: exactly where round 1 was weak.

## Basics

> [!question]- Q1. What are DDL, DML, DCL and TCL?
> **In simple words:** four families of SQL commands.
>
> | Family | Means | Commands |
> |---|---|---|
> | **DDL** | define structure | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
> | **DML** | change data | `INSERT`, `UPDATE`, `DELETE`, (`SELECT`) |
> | **DCL** | permissions | `GRANT`, `REVOKE` |
> | **TCL** | transactions | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT` |
>
> 💡 **Hack:** **D**efine, **M**anipulate, **C**ontrol, **T**ransact.

> [!question]- Q2. Primary key, foreign key, unique key, and other constraints ⭐
> **In simple words:**
> - **Primary key** → uniquely identifies each row; **not null**; one per table
> - **Foreign key** → a column that **points to** another table's primary key; keeps data consistent
> - **Unique** → no duplicates, but (unlike PK) can be null and you can have many
> - `NOT NULL`, `CHECK (salary > 0)`, `DEFAULT now()`
>
> ```sql
> CREATE TABLE departments (
>   id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
>   name TEXT NOT NULL UNIQUE
> );
> CREATE TABLE employees (
>   id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
>   name       TEXT NOT NULL,
>   email      TEXT UNIQUE,
>   salary     NUMERIC(12,2) CHECK (salary > 0),
>   dept_id    INT REFERENCES departments(id) ON DELETE SET NULL,
>   manager_id INT REFERENCES employees(id),
>   joined_on  DATE DEFAULT CURRENT_DATE
> );
> ```
>
> **Diagram:**
> ```mermaid
> erDiagram
>   DEPARTMENTS ||--o{ EMPLOYEES : "has"
>   EMPLOYEES ||--o{ EMPLOYEES : "manages"
>   DEPARTMENTS {
>     int id PK
>     text name
>   }
>   EMPLOYEES {
>     int id PK
>     text name
>     numeric salary
>     int dept_id FK
>     int manager_id FK
>   }
> ```
> 💡 **Hack:** **PK = Aadhaar number of the row; FK = "this row belongs to that row".**

> [!question]- Q3. DELETE vs TRUNCATE vs DROP ⭐
> **In simple words:**
> - `DELETE` → removes **chosen rows** (`WHERE`), row by row, fires triggers, can roll back
> - `TRUNCATE` → removes **all rows** at once, very fast, resets identity (with `RESTART IDENTITY`)
> - `DROP` → removes the **whole table** (structure + data)
>
> In PostgreSQL even `TRUNCATE` and `DROP` can be **rolled back inside a transaction**.
>
> 💡 **Hack:** **DELETE = erase some lines; TRUNCATE = tear out all pages; DROP = throw away the notebook.**

> [!question]- Q4. WHERE vs HAVING; the order SQL actually runs in ⭐
> **In simple words:** `WHERE` filters **rows before grouping**; `HAVING` filters **groups after** `GROUP BY` (so it can use `COUNT`, `SUM`…).
>
> ```sql
> SELECT dept_id, COUNT(*) AS headcount, AVG(salary) AS avg_sal
> FROM employees
> WHERE salary > 40000            -- row filter
> GROUP BY dept_id
> HAVING COUNT(*) >= 2            -- group filter
> ORDER BY avg_sal DESC;
> ```
>
> **Diagram (logical order):**
> ```mermaid
> flowchart LR
>   F["FROM / JOIN"] --> W["WHERE"] --> G["GROUP BY"] --> H["HAVING"] --> S["SELECT"] --> D["DISTINCT"] --> O["ORDER BY"] --> L["LIMIT / OFFSET"]
> ```
> That's why you **can't use a SELECT alias in WHERE**, but you can in ORDER BY.
>
> 💡 **Hack:** **"Fat Whales Grow Happily, Swimming Deep Over Lakes."**

> [!question]- Q5. How does NULL behave?
> **In simple words:** `NULL` means **unknown**, so `NULL = NULL` is **not true**. Use `IS NULL`. Aggregates like `COUNT(column)` and `AVG` **skip** nulls; `COUNT(*)` counts all rows.
>
> ```sql
> SELECT * FROM employees WHERE dept_id IS NULL;          -- ✅ (= NULL returns nothing)
> SELECT name, COALESCE(dept_id::text, 'Unassigned') FROM employees;   -- default for null
> SELECT COUNT(*), COUNT(dept_id) FROM employees;         -- 5, 4
> ```
> 💡 **Hack:** **NULL is "I don't know"**: nothing equals "I don't know", not even another "I don't know".

> [!question]- Q6. UNION vs UNION ALL; IN vs EXISTS
> **In simple words:** `UNION` stacks results and **removes duplicates** (slower). `UNION ALL` keeps **everything** (faster). `EXISTS` stops at the **first match** and handles NULLs safely; it's usually best for "is there a related row?".
>
> ```sql
> SELECT name FROM employees WHERE dept_id = 1
> UNION ALL
> SELECT name FROM contractors;
>
> -- departments that have at least one employee
> SELECT d.name FROM departments d
> WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);
> ```
> ⚠️ `NOT IN (subquery)` returns **nothing** if the subquery contains a NULL. Prefer `NOT EXISTS`.

## Joins

> [!question]- Q7. Explain all the joins ⭐
> **In simple words:** a join **combines rows from two tables** that match on a column.
>
> | Join | Returns |
> |---|---|
> | **INNER** | only rows that match **in both** |
> | **LEFT** | **all** from the left + matches from the right (else NULL) |
> | **RIGHT** | all from the right + matches from the left |
> | **FULL** | everything from both, NULL where no match |
> | **CROSS** | every combination (rows × rows) |
> | **SELF** | a table joined to itself (employee → manager) |
>
> ```sql
> SELECT e.name, d.name AS dept
> FROM employees e
> LEFT JOIN departments d ON d.id = e.dept_id;
> -- Kiran appears with dept = NULL (no department). With INNER JOIN, Kiran disappears.
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   subgraph INNER["INNER JOIN"]
>     I1["Asha–Eng"]
>     I2["Ravi–Eng"]
>     I3["Meena–Sales"]
>     I4["Tanay–Sales"]
>   end
>   subgraph LEFT["LEFT JOIN = INNER + unmatched left"]
>     L1["…same 4 rows…"]
>     L2["Kiran–NULL"]
>   end
> ```
> 💡 **Hack:** **INNER = intersection; LEFT = "keep everyone on my side".**

> [!question]- Q8. Self join: find employees who earn more than their manager ⭐
> **In simple words:** join the table **to itself**: one copy is "employee", the other is "manager".
>
> ```sql
> SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
> FROM employees e
> JOIN employees m ON m.id = e.manager_id
> WHERE e.salary > m.salary;
> ```
> Also: list each employee with their manager's name → `LEFT JOIN employees m ON m.id = e.manager_id` (keeps the top boss with NULL).

> [!question]- Q9. Find rows in one table that are NOT in another (anti-join)
> **In simple words:** "departments with no employees", "customers who never ordered".
>
> ```sql
> -- way 1: LEFT JOIN + IS NULL
> SELECT d.* FROM departments d
> LEFT JOIN employees e ON e.dept_id = d.id
> WHERE e.id IS NULL;
>
> -- way 2: NOT EXISTS (safe with NULLs, usually fastest)
> SELECT d.* FROM departments d
> WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);
> ```

## Classic query questions

> [!question]- Q10. Find the second highest salary (3 ways) ⭐
> **In simple words:** skip the top **distinct** salary and take the next one. Watch for **ties** (Ravi and Meena both earn 70000).
>
> ```sql
> -- 1) subquery (works everywhere)
> SELECT MAX(salary) FROM employees
> WHERE salary < (SELECT MAX(salary) FROM employees);            -- 70000
>
> -- 2) LIMIT / OFFSET on distinct values
> SELECT DISTINCT salary FROM employees
> ORDER BY salary DESC
> LIMIT 1 OFFSET 1;                                              -- 70000
>
> -- 3) window function (best for Nth, and to get the people too)
> SELECT name, salary FROM (
>   SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
>   FROM employees
> ) t
> WHERE rnk = 2;                                                 -- Ravi 70000, Meena 70000
> ```
> 💡 **Hack:** say **"I'd use DENSE_RANK so ties don't break it, and it generalises to the Nth highest."** Interviewers love that line.

> [!question]- Q11. Nth highest salary in each department ⭐
> **In simple words:** `PARTITION BY` restarts the ranking **for each department**.
>
> ```sql
> SELECT dept_id, name, salary
> FROM (
>   SELECT e.*, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
>   FROM employees e
> ) t
> WHERE rnk = 1;          -- top earner(s) per department; change 1 → N
> ```
> PostgreSQL shortcut for "one row per group": `SELECT DISTINCT ON (dept_id) * FROM employees ORDER BY dept_id, salary DESC;`

> [!question]- Q12. Find and delete duplicate rows ⭐
> **In simple words:** **find** = group by the columns that define "duplicate" and keep groups with count > 1. **Delete** = number the copies and delete everything except copy #1.
>
> ```sql
> -- find
> SELECT email, COUNT(*) FROM employees
> GROUP BY email
> HAVING COUNT(*) > 1;
>
> -- delete, keeping the lowest id
> DELETE FROM employees
> WHERE id IN (
>   SELECT id FROM (
>     SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
>     FROM employees
>   ) t
>   WHERE rn > 1
> );
> ```
> 💡 **Hack:** **"Number the twins, keep #1."** Then add a `UNIQUE` constraint so it can't happen again.

> [!question]- Q13. Department-wise count, total and max salary
> ```sql
> SELECT d.name AS dept,
>        COUNT(e.id)          AS headcount,
>        SUM(e.salary)        AS total_salary,
>        MAX(e.salary)        AS max_salary,
>        ROUND(AVG(e.salary)) AS avg_salary
> FROM departments d
> LEFT JOIN employees e ON e.dept_id = d.id      -- LEFT so empty depts still show (count 0)
> GROUP BY d.name
> ORDER BY total_salary DESC NULLS LAST;
> ```
> Postgres extra, conditional counts: `COUNT(*) FILTER (WHERE salary > 60000) AS high_earners`.

> [!question]- Q14. Employees earning more than their department's average
> ```sql
> -- correlated subquery
> SELECT e.name, e.salary, e.dept_id
> FROM employees e
> WHERE e.salary > (SELECT AVG(salary) FROM employees x WHERE x.dept_id = e.dept_id);
>
> -- window version (one pass)
> SELECT name, salary, dept_id FROM (
>   SELECT e.*, AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg FROM employees e
> ) t WHERE salary > dept_avg;
> ```

> [!question]- Q15. Running total and month-over-month change
> **In simple words:** window functions let you look at **other rows** without collapsing them.
>
> ```sql
> SELECT month, revenue,
>        SUM(revenue) OVER (ORDER BY month)              AS running_total,
>        revenue - LAG(revenue) OVER (ORDER BY month)    AS change_vs_last_month
> FROM monthly_sales;
> ```
> | month | revenue | running_total | change |
> |---|---|---|---|
> | Jan | 100 | 100 | NULL |
> | Feb | 150 | 250 | 50 |
> | Mar | 120 | 370 | −30 |

> [!question]- Q16. Date questions: joined in the last 30 days, count per month
> ```sql
> SELECT * FROM employees WHERE joined_on >= CURRENT_DATE - INTERVAL '30 days';
>
> SELECT date_trunc('month', joined_on) AS month, COUNT(*)
> FROM employees
> GROUP BY 1
> ORDER BY 1;
> ```
> Store timestamps as **`timestamptz`** (with time zone) in PostgreSQL.

## Subqueries, CTEs & views

> [!question]- Q17. Subquery vs CTE vs temp table
> **In simple words:** all three break a big query into steps.
> - **Subquery** → a query inside another
> - **CTE** (`WITH … AS`) → a **named** step at the top, much easier to read; can be **recursive**
> - **Temp table** → stores an intermediate result **physically** for the session; can be indexed, good for huge multi-step jobs
>
> ```sql
> WITH dept_avg AS (
>   SELECT dept_id, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id
> ),
> rich AS (
>   SELECT e.* FROM employees e JOIN dept_avg a USING (dept_id) WHERE e.salary > a.avg_sal
> )
> SELECT * FROM rich ORDER BY salary DESC;
> ```
> 💡 **Hack:** **CTE = naming your steps like variables.** (In round 1 you said "CTA": it's **CTE**, Common Table Expression.)

> [!question]- Q18. Recursive CTE: show the reporting hierarchy
> **In simple words:** start from the boss, then repeatedly add **people who report to someone already found**.
>
> ```sql
> WITH RECURSIVE org AS (
>   SELECT id, name, manager_id, 1 AS level
>   FROM employees WHERE manager_id IS NULL          -- anchor: the top boss
>   UNION ALL
>   SELECT e.id, e.name, e.manager_id, o.level + 1
>   FROM employees e JOIN org o ON e.manager_id = o.id   -- recursive step
> )
> SELECT repeat('  ', level - 1) || name AS tree, level FROM org ORDER BY level;
> ```
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   A["Asha (level 1)"] --> R["Ravi (2)"]
>   A --> M["Meena (2)"]
>   M --> T["Tanay (3)"]
>   M --> K["Kiran (3)"]
> ```

> [!question]- Q19. View vs materialized view
> **In simple words:** a **view** is a **saved query**: it runs every time you use it (always fresh). A **materialized view** **stores the result** like a table: very fast to read, but you must **refresh** it.
>
> ```sql
> CREATE VIEW v_active_deals AS SELECT * FROM deals WHERE status = 'ACTIVE';
>
> CREATE MATERIALIZED VIEW mv_region_totals AS
>   SELECT region, SUM(value) AS total FROM deals GROUP BY region;
> REFRESH MATERIALIZED VIEW CONCURRENTLY mv_region_totals;   -- needs a unique index
> ```
> 💡 **Hack:** **view = a live camera; materialized view = a photo you retake on schedule.** Great for **reporting dashboards**.

## Window functions

> [!question]- Q20. ROW_NUMBER vs RANK vs DENSE_RANK ⭐
> **In simple words:** all number rows by an order; they differ on **ties**.
>
> ```sql
> SELECT name, salary,
>   ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
>   RANK()       OVER (ORDER BY salary DESC) AS rnk,
>   DENSE_RANK() OVER (ORDER BY salary DESC) AS dense
> FROM employees;
> ```
> | name | salary | ROW_NUMBER | RANK | DENSE_RANK |
> |---|---|---|---|---|
> | Asha | 90000 | 1 | 1 | 1 |
> | Ravi | 70000 | 2 | 2 | 2 |
> | Meena | 70000 | 3 | **2** | **2** |
> | Tanay | 60000 | 4 | **4** (skips 3) | **3** (no gap) |
>
> 💡 **Hack:** **ROW_NUMBER = unique seats; RANK = Olympic medals (gaps after ties); DENSE_RANK = no gaps.**

> [!question]- Q21. What is a window function? GROUP BY vs OVER()
> **In simple words:** `GROUP BY` **squashes** rows into one per group. A **window function** computes over a group of rows but **keeps every row**.
>
> ```sql
> SELECT name, dept_id, salary,
>        SUM(salary) OVER (PARTITION BY dept_id) AS dept_total,     -- every row keeps its detail
>        salary * 100.0 / SUM(salary) OVER (PARTITION BY dept_id) AS pct_of_dept
> FROM employees;
> ```
> Useful ones: `ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, FIRST_VALUE, NTILE, SUM/AVG OVER`.
>
> 💡 **Hack:** **GROUP BY = a summary report; OVER() = each row + the summary next to it.**

## Indexes

> [!question]- Q22. What is an index and how does it work? ⭐
> **In simple words:** like the **index at the back of a book**: instead of reading every page (**sequential scan**), the DB jumps straight to the rows. PostgreSQL's default index is a **B-tree**, a sorted tree that finds a value in a few steps.
>
> **Cost:** extra disk space, and **slower INSERT / UPDATE / DELETE** (the index must be updated too).
>
> ```sql
> CREATE INDEX idx_employees_dept ON employees (dept_id);
> ```
>
> **Diagram (B-tree lookup for salary = 70000):**
> ```mermaid
> flowchart TD
>   R["root: < 65000 | ≥ 65000"] --> L["50000 · 60000"]
>   R --> RR["70000 · 70000 · 90000"]
>   RR --> ROWS["→ row pointers for Ravi, Meena"]
> ```
> 💡 **Hack:** **index = the book index; seq scan = reading the whole book.**

> [!question]- Q23. Index types in PostgreSQL
> | Type | Good for | Example |
> |---|---|---|
> | **B-tree** (default) | `=`, `<`, `>`, `BETWEEN`, `ORDER BY` | ids, dates, salaries |
> | **Hash** | only `=` | rare |
> | **GIN** | "contains": **JSONB**, arrays, full-text search | `WHERE tags @> '{angular}'` |
> | **GiST** | geometry, ranges, nearest-neighbour | maps |
> | **BRIN** | huge tables naturally sorted by time | logs, events |
>
> ```sql
> CREATE INDEX idx_deals_meta ON deals USING GIN (metadata);    -- JSONB
> ```

> [!question]- Q24. Composite, partial and covering indexes; when NOT to index
> **In simple words:**
> - **Composite** `(dept_id, salary)` → helps queries filtering on `dept_id`, or on `dept_id` + `salary`. **Not** on `salary` alone (**leftmost-prefix rule**).
> - **Partial** → index only some rows: `WHERE status = 'ACTIVE'` (smaller, faster)
> - **Covering** → `INCLUDE (name)` so the query is answered **from the index alone** (index-only scan)
>
> ```sql
> CREATE INDEX idx_emp_dept_sal ON employees (dept_id, salary);
> CREATE INDEX idx_active_deals ON deals (created_at) WHERE status = 'ACTIVE';
> CREATE INDEX idx_emp_email ON employees (email) INCLUDE (name);
> ```
> **Don't index:** tiny tables, columns with few distinct values (`gender`, `is_active`), columns rarely used in WHERE / JOIN / ORDER BY, write-heavy tables with too many indexes.
>
> **Index killers:** a function on the column (`WHERE LOWER(email) = …` → create an index on `LOWER(email)` instead), leading wildcard `LIKE '%abc'`, type mismatches.
>
> 💡 **Hack:** **composite index = a phone book sorted by surname, then first name**: useless if you only know the first name.

> [!question]- Q25. Clustered vs non-clustered index
> **In simple words:** a **clustered** index decides the **physical order** of rows (one per table: the SQL Server concept, usually the PK). A **non-clustered** index is a **separate structure** pointing to rows.
>
> **PostgreSQL note:** tables are **heaps**; every index is effectively non-clustered. The `CLUSTER` command reorders a table **once** by an index, but doesn't maintain it.
>
> 💡 **Hack:** **clustered = the dictionary itself is in order; non-clustered = an index card box pointing into it.**

## Performance

> [!question]- Q26. How do you find out why a query is slow? (EXPLAIN ANALYZE) ⭐ 🔥
> **In simple words:** **measure first, don't guess.** `EXPLAIN` shows the **plan** PostgreSQL will use; `EXPLAIN ANALYZE` **runs** the query and shows **real times and row counts**.
>
> ```sql
> EXPLAIN (ANALYZE, BUFFERS)
> SELECT * FROM deals WHERE customer_id = 42 AND status = 'ACTIVE';
> ```
> ```text
> Seq Scan on deals  (cost=0.00..18334.00 rows=12 width=96) (actual time=0.03..85.2 rows=9 loops=1)
>   Filter: ((customer_id = 42) AND (status = 'ACTIVE'))
>   Rows Removed by Filter: 799991          ← read 800k rows to return 9 😬
> Execution Time: 85.4 ms
> ```
> After `CREATE INDEX ON deals (customer_id, status);`:
> ```text
> Index Scan using deals_customer_id_status_idx on deals (actual time=0.02..0.05 rows=9 loops=1)
> Execution Time: 0.08 ms                   ← 1000× faster
> ```
> **What to look for:** **Seq Scan** on a big table with few rows returned, big **"Rows Removed by Filter"**, **estimated rows ≠ actual rows** (stale stats → `ANALYZE`), expensive **Sort** / **Hash** spilling to disk, **Nested Loop** over many rows.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   S["Slow query"] --> E["EXPLAIN ANALYZE"]
>   E --> Q1{"Seq Scan on<br/>big table?"}
>   Q1 -- "yes" --> I["add / fix index"]
>   E --> Q2{"estimates way off?"}
>   Q2 -- "yes" --> A["ANALYZE table"]
>   E --> Q3{"too many rows / columns?"}
>   Q3 -- "yes" --> R["filter earlier, select fewer columns"]
> ```
> 💡 **Hack:** **"EXPLAIN tells the plan; ANALYZE tells the truth."**

> [!question]- Q27. Checklist to optimise a slow query
> 1. **`EXPLAIN ANALYZE`** first
> 2. **Index** the columns in `WHERE`, `JOIN` and `ORDER BY` (composite in the right order)
> 3. **Select only needed columns**, no `SELECT *`
> 4. **Filter early**: `WHERE` before joining huge sets; avoid functions on indexed columns
> 5. **Replace correlated subqueries** with joins / window functions
> 6. **`EXISTS`** instead of `IN` for big subqueries; `UNION ALL` instead of `UNION`
> 7. **Keyset pagination** instead of large `OFFSET`
> 8. **Keep statistics fresh**: autovacuum, `ANALYZE`
> 9. **Materialized views** for heavy reports
> 10. Avoid **N+1** from the app (batch / join)
>
> 💡 **Hack:** **"Measure, Index, Trim, Filter early, Paginate, Refresh stats."**

> [!question]- Q28. How do you improve the performance of a stored procedure? 🔥
> **In simple words:** a procedure is just SQL inside a wrapper, so you speed up **the queries inside it**, and avoid row-by-row loops. ⚠️ In round 1 you said "transactions": transactions are about **correctness**, not speed. Lead with **measuring**.
>
> 1. **Measure:** run its inner queries with `EXPLAIN ANALYZE`; use **`pg_stat_statements`** to find the slowest statements
> 2. **Indexes** on columns used in its `WHERE` / `JOIN`
> 3. **Set-based, not loops:** one `UPDATE … FROM` instead of a `FOR` loop updating row by row (no cursors unless needed)
> 4. **Select only needed columns**; filter early
> 5. **CTEs / temp tables** to stage big intermediate results (index the temp table if it's large)
> 6. **Batch** huge updates / deletes (e.g. 10,000 rows at a time) and keep **transactions short** to reduce **locks**
> 7. **Fresh statistics** (`ANALYZE`), and check **locks / waits** in `pg_stat_activity` and `pg_locks`
>
> ```sql
> -- ❌ slow: loop, one UPDATE per row
> FOR r IN SELECT id FROM deals WHERE region = 'EMEA' LOOP
>   UPDATE deals SET discount = 0.1 WHERE id = r.id;
> END LOOP;
>
> -- ✅ fast: one set-based statement
> UPDATE deals SET discount = 0.1 WHERE region = 'EMEA';
> ```
> **Answer to say:**
> > "First I measure: `EXPLAIN ANALYZE` on the queries inside it and `pg_stat_statements` to see what's slow. Then usually indexes on the filter and join columns, replacing row-by-row loops with set-based SQL, selecting only needed columns, staging big intermediate data in CTEs or temp tables, and batching big updates with short transactions to avoid locking. I'd also check the statistics are fresh."
>
> 💡 **Hack:** **"Measure → Index → Set-based → Trim → Batch."**

> [!question]- Q29. OFFSET pagination vs keyset pagination
> **In simple words:** `OFFSET 100000` makes the DB **read and throw away** 100,000 rows first, so page 5,000 is slow. **Keyset** pagination remembers the **last seen value** and continues from there using an index.
>
> ```sql
> -- ❌ slows down as pages go deeper
> SELECT * FROM deals ORDER BY id LIMIT 50 OFFSET 100000;
>
> -- ✅ keyset / "seek": always fast
> SELECT * FROM deals WHERE id > 100050 ORDER BY id LIMIT 50;   -- 100050 = last id of previous page
> ```
> 🧑‍💻 Pairs with **infinite scroll** in an Angular table.
>
> 💡 **Hack:** **OFFSET = counting from page 1 every time; keyset = a bookmark.**

> [!question]- Q30. What are VACUUM and ANALYZE? (MVCC in one minute)
> **In simple words:** PostgreSQL never overwrites a row in place. An `UPDATE` writes a **new version** and marks the old one dead (**MVCC**, so readers and writers don't block each other). **VACUUM** cleans up the dead versions; **ANALYZE** refreshes the **statistics** the planner uses. **Autovacuum** does both automatically.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   U["UPDATE salary"] --> V1["old row version (dead)"]
>   U --> V2["new row version (live)"]
>   V1 --> VAC["VACUUM reclaims space"]
>   V2 --> AN["ANALYZE updates stats<br/>→ better query plans"]
> ```
> 💡 **Hack:** **VACUUM = taking out the trash; ANALYZE = updating the map.**

## Stored procedures, functions & triggers

> [!question]- Q31. Should we use stored procedures or normal queries? ⭐ 🔥
> **In simple words:** **it depends**, and say *on what*. Logic **in the database** (procedures / functions) vs logic **in the application** (queries / ORM).
>
> | Stored procedures / functions | Queries in the app (ORM) |
> |---|---|
> | ✅ fewer network round-trips for heavy, multi-step data work | ✅ logic lives with the rest of the code |
> | ✅ plans can be reused, data processed close to where it lives | ✅ easy to **unit test**, debug and version in Git |
> | ✅ permission control: grant EXECUTE, not table access | ✅ database-independent, simpler deployments |
> | ❌ harder to test, debug, version and review | ❌ chatty for heavy set-based processing |
> | ❌ business logic split across two places, vendor lock-in | |
>
> > "For straightforward CRUD I keep queries in the application with EF Core or parameterised SQL: easier to test and version. For **heavy, set-based data processing** close to the data, like the Postgres functions behind our OData APIs, a function or procedure is better because it avoids many round-trips. The decision depends on data volume, complexity and who owns the logic."
>
> 💡 **Hack:** **"CRUD in code, heavy crunching in the DB."**

> [!question]- Q32. Function vs procedure in PostgreSQL
> **In simple words:**
> - **Function** → **returns a value or a table**; can be used **inside SELECT**; runs inside the caller's transaction (can't `COMMIT`)
> - **Procedure** (PostgreSQL 11+) → called with **`CALL`**; doesn't return a result set the same way; **can `COMMIT` / `ROLLBACK` inside** (good for batch jobs)
>
> ```sql
> CREATE OR REPLACE FUNCTION fn_dept_total(p_dept INT)
> RETURNS NUMERIC LANGUAGE sql STABLE AS $$
>   SELECT COALESCE(SUM(salary), 0) FROM employees WHERE dept_id = p_dept;
> $$;
> SELECT name, fn_dept_total(id) FROM departments;          -- usable in SELECT
>
> CREATE OR REPLACE FUNCTION fn_deals_by_region(p_region TEXT)
> RETURNS TABLE (id INT, name TEXT, value NUMERIC) LANGUAGE sql STABLE AS $$
>   SELECT id, name, value FROM deals WHERE region = p_region;
> $$;
> SELECT * FROM fn_deals_by_region('EMEA');                  -- returns a table
>
> CREATE OR REPLACE PROCEDURE sp_archive_old_deals()
> LANGUAGE plpgsql AS $$
> BEGIN
>   INSERT INTO deals_archive SELECT * FROM deals WHERE closed_on < now() - INTERVAL '2 years';
>   DELETE FROM deals WHERE closed_on < now() - INTERVAL '2 years';
>   COMMIT;                                                  -- allowed in procedures
> END $$;
> CALL sp_archive_old_deals();
> ```
> 💡 **Hack:** **function = a calculator you use inside a query; procedure = a job you CALL.**

> [!question]- Q33. What is a trigger? When would you use one?
> **In simple words:** code the DB runs **automatically** when a row is inserted, updated or deleted. Good for **audit logs** and `updated_at` columns. Don't hide important business logic in triggers (hard to find and debug).
>
> ```sql
> CREATE FUNCTION trg_set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
> BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
>
> CREATE TRIGGER deals_updated_at
> BEFORE UPDATE ON deals
> FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();
> ```

> [!question]- Q34. How do you prevent SQL injection?
> **In simple words:** **never build SQL by gluing strings with user input.** Use **parameters**: the DB treats the input as **data, never as code**.
>
> ```js
> // ❌ "'; DROP TABLE users; --" would be executed
> db.query(`SELECT * FROM users WHERE email = '${email}'`);
> // ✅ parameterised (node-postgres)
> db.query('SELECT * FROM users WHERE email = $1', [email]);
> ```
> In .NET: EF Core LINQ, `FromSql($"…{x}")` (auto-parameterised), or `NpgsqlParameter`. Also: least-privilege DB users.

## Transactions & concurrency

> [!question]- Q35. What is a transaction? Explain ACID ⭐
> **In simple words:** a group of statements that succeed **all together or not at all**. Classic example: a bank transfer.
>
> | Letter | Meaning | Transfer example |
> |---|---|---|
> | **A**tomicity | all or nothing | debit **and** credit both happen, or neither |
> | **C**onsistency | rules always hold | balance never goes below 0 (CHECK) |
> | **I**solation | transactions don't see each other's half-work | another query never sees money "in flight" |
> | **D**urability | once committed, it survives a crash | written to the WAL on disk |
>
> ```sql
> BEGIN;
>   UPDATE accounts SET balance = balance - 500 WHERE id = 1;
>   UPDATE accounts SET balance = balance + 500 WHERE id = 2;
> COMMIT;        -- or ROLLBACK; if anything failed
> ```
> 💡 **Hack:** **ACID = "All Committed, Isolated, Durable"**, and the transfer example says it all.

> [!question]- Q36. Isolation levels and the problems they prevent
> **In simple words:** how much one transaction can **see of another's unfinished or recent work**. Higher isolation = safer but more conflicts.
>
> | Level | Dirty read | Non-repeatable read | Phantom read |
> |---|---|---|---|
> | Read Uncommitted (*acts as Read Committed in Postgres*) | ❌ prevented in PG | possible | possible |
> | **Read Committed** (**Postgres default**) | ❌ | possible | possible |
> | Repeatable Read | ❌ | ❌ | ❌ in PG |
> | Serializable | ❌ | ❌ | ❌ (+ no anomalies) |
>
> - **Dirty read:** seeing data another transaction hasn't committed
> - **Non-repeatable read:** reading the same row twice gives different values
> - **Phantom read:** re-running a query returns **new rows**
>
> 💡 **Hack:** **Dirty → Non-repeatable → Phantom**: each level up blocks one more ghost.

> [!question]- Q37. What is a deadlock and how do you avoid it?
> **In simple words:** two transactions each hold a lock the other needs, so both wait forever. PostgreSQL **detects** it and **kills one** with an error.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   T1["Transaction 1<br/>locked row A"] -- "wants row B" --> B["row B"]
>   T2["Transaction 2<br/>locked row B"] -- "wants row A" --> A["row A"]
>   B -. "held by" .-> T2
>   A -. "held by" .-> T1
> ```
> **Avoid:** always lock / update rows **in the same order**, keep transactions **short**, add indexes so updates lock fewer rows, retry on deadlock errors. Investigate with `pg_locks` and `pg_stat_activity`.
>
> 💡 **Hack:** **two cars at a one-lane bridge**: agree on who goes first (same order).

> [!question]- Q38. Optimistic vs pessimistic locking
> **In simple words:** **pessimistic** = lock the row while editing (`SELECT … FOR UPDATE`). **Optimistic** = don't lock; check a **version** column when saving and fail if someone else changed it.
>
> ```sql
> UPDATE deals SET value = 500000, version = version + 1
> WHERE id = 7 AND version = 3;      -- 0 rows updated → someone else saved first → show "reload"
> ```
> EF Core supports optimistic concurrency with a **concurrency token** (PostgreSQL's `xmin` system column works well).

## Design

> [!question]- Q39. What is normalization? 1NF, 2NF, 3NF ⭐
> **In simple words:** organising tables so **each fact is stored once**, avoiding duplicate data and update mistakes.
>
> - **1NF** → each cell holds **one value** (no `"Angular, Node"` lists in a column), each row unique
> - **2NF** → 1NF + every column depends on the **whole** primary key (no partial dependency in composite keys)
> - **3NF** → 2NF + no column depends on **another non-key column** (no transitive dependency)
>
> **Example (not normalized):**
> | emp_id | name | dept_name | dept_location | skills |
> |---|---|---|---|---|
> | 1 | Tanay | Sales | Pune | Angular, Node |
>
> **Fix:** `employees(id, name, dept_id)` · `departments(id, name, location)` · `employee_skills(emp_id, skill)`.
>
> 💡 **Hack:** *"The key, the whole key, and nothing but the key."* **Denormalize** on purpose only for **read-heavy reporting** (or use a materialized view).

> [!question]- Q40. SQL vs NoSQL: PostgreSQL vs DynamoDB? 🧑‍💻
> **In simple words:** **SQL (PostgreSQL)** = tables with a fixed schema, **joins**, strong consistency, ACID transactions: great for related business data like pricing. **NoSQL (DynamoDB)** = key-value / documents, flexible schema, **massive scale with predictable speed**, but no joins: you design tables around your **access patterns**.
>
> | | PostgreSQL | DynamoDB |
> |---|---|---|
> | Model | relational tables | key-value / document |
> | Queries | any SQL, joins | by partition key (+ sort key, indexes) |
> | Scale | vertical + read replicas | horizontal, serverless |
> | You used it for | pricing data behind OData APIs | NoSQL storage in AWS |
>
> 💡 **Hack:** **SQL = a well-organised filing cabinet; NoSQL = a giant fast locker system where you must know your locker number.**

## PostgreSQL extras

> [!question]- Q41. PostgreSQL features worth mentioning
> ```sql
> -- UPSERT
> INSERT INTO targets (deal_id, amount) VALUES (7, 1000)
> ON CONFLICT (deal_id) DO UPDATE SET amount = EXCLUDED.amount;
>
> -- RETURNING: get the new id without a second query
> INSERT INTO deals (name) VALUES ('New deal') RETURNING id;
>
> -- JSONB
> SELECT metadata->>'owner' FROM deals WHERE metadata @> '{"region": "EMEA"}';
>
> -- case-insensitive search, string aggregation, series
> SELECT * FROM employees WHERE name ILIKE 'ta%';
> SELECT dept_id, string_agg(name, ', ') FROM employees GROUP BY dept_id;
> SELECT generate_series(1, 5);
> ```
> Also: **`GENERATED ALWAYS AS IDENTITY`** (modern replacement for `SERIAL`), arrays, `DISTINCT ON`, `FILTER (WHERE …)`, `LATERAL` joins, extensions (`pg_stat_statements`, `pgcrypto`, `PostGIS`).

> [!question]- Q42. CHAR vs VARCHAR vs TEXT; NUMERIC vs FLOAT for money
> **In simple words:** in PostgreSQL **`TEXT` and `VARCHAR` perform the same**; use `VARCHAR(n)` only when you want a length limit. `CHAR(n)` pads with spaces (rarely useful). For **money**, use **`NUMERIC(12,2)`**: `FLOAT` has rounding errors (the same `0.1 + 0.2` problem as JavaScript).
>
> 💡 **Hack:** **money → NUMERIC, never FLOAT.** Perfect line for a pricing developer.
