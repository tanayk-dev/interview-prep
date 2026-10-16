---
title: .NET Core & C#
short: .NET Core
description: C# and OOP basics, ASP.NET Core middleware and DI, Web APIs, EF Core with PostgreSQL, OData, auth and testing, explained simply.
order: 5
icon: 🟣
color: mauve
---

> [!warning] Round 1 signal
> The panel asked directly *"you don't have .NET Core MVC API exposure?"*. Expect follow-ups. Lead with what you built (**OData APIs in ASP.NET Core over PostgreSQL, C# pricing modules, feature flags**), then answer the basics below crisply. The most likely ones: **middleware, DI lifetimes, EF Core, async/await, CORS, JWT**.

## .NET & C# basics

> [!question]- Q1. .NET Framework vs .NET Core vs .NET (5+)? ⭐
> **In simple words:** **.NET Framework** is the old **Windows-only** version (last is 4.8). **.NET Core** was the **cross-platform, open-source rewrite**. From version 5 it's simply called **.NET** (8, 9, 10…). New projects use modern .NET.
>
> | | .NET Framework | .NET (Core) |
> |---|---|---|
> | Runs on | Windows only | Windows, Linux, macOS, containers |
> | Performance | good | much faster (Kestrel) |
> | Hosting | IIS | Kestrel, behind IIS / Nginx, Docker |
> | Status | maintenance only | active; **.NET 8 and 10 are LTS** |
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   F[".NET Framework 4.x<br/>Windows only"] -. "legacy" .-> X["maintenance"]
>   C[".NET Core 1–3.1<br/>cross-platform"] --> N[".NET 5, 6, 7, 8 LTS, 9, 10 LTS…<br/>one unified .NET"]
> ```
> 💡 **Hack:** **Framework = old Windows house; Core / .NET = new portable house.**

> [!question]- Q2. How does C# code run? (CLR, IL, JIT)
> **In simple words:** your C# is compiled to **IL** (an in-between language) inside a **.dll**. When the app runs, the **CLR** (Common Language Runtime) **JIT-compiles** IL into machine code for that computer, and manages **memory (garbage collection)**, type safety and exceptions. Code that runs this way is called **managed code**.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   CS["C# code"] -- "Roslyn compiler" --> IL["IL in a .dll"]
>   IL -- "app starts" --> CLR["CLR"]
>   CLR -- "JIT" --> MC["machine code"]
>   CLR --> GC["garbage collector<br/>frees memory"]
> ```
> 💡 **Hack:** **C# → IL → JIT → CPU.** Like Java: source → bytecode → JVM.

> [!question]- Q3. Value types vs reference types; stack vs heap ⭐
> **In simple words:** **value types** (`int`, `double`, `bool`, `struct`, `enum`) hold the **data itself** and are **copied** on assignment. **Reference types** (`class`, `string`, arrays, `record`) hold a **pointer to an object on the heap**; copying the variable **shares** the object.
>
> ```csharp
> int a = 5; int b = a; b = 10;          // a is still 5 (copied)
>
> var p1 = new Person { Name = "Tanay" };
> var p2 = p1;                            // same object
> p2.Name = "Rahul";                      // p1.Name is "Rahul" too
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   subgraph Stack
>     A["a = 5"]
>     B["b = 10"]
>     P1["p1 → ref"]
>     P2["p2 → ref"]
>   end
>   subgraph Heap
>     O["Person { Name = 'Rahul' }"]
>   end
>   P1 --> O
>   P2 --> O
> ```
> **Boxing** = putting a value type into an `object` (copies it to the heap); **unboxing** = taking it back out. Both cost performance.
>
> 💡 **Hack:** value = **photocopy**; reference = **sharing an address**. Same idea as JavaScript primitives vs objects.

> [!question]- Q4. class vs struct vs record
> **In simple words:**
> - **class** → reference type, the default for objects with behaviour
> - **struct** → small **value type** (e.g. a `Point`), copied on assignment
> - **record** → a class designed for **data**: compares by **value**, immutable-friendly, short syntax. Great for **DTOs**.
>
> ```csharp
> public record DealDto(int Id, string Name, decimal Value);
>
> var a = new DealDto(1, "A", 100);
> var b = new DealDto(1, "A", 100);
> a == b;                          // true → records compare by VALUE (classes would be false)
> var c = a with { Value = 200 };  // copy with one change
> ```
> 💡 **Hack:** **class = a person (identity); struct = a coordinate; record = a receipt (equal if the contents are equal).**

> [!question]- Q5. String vs StringBuilder
> **In simple words:** a `string` is **immutable**: every `+=` creates a **new** string. In a loop that's slow. `StringBuilder` edits **one buffer**.
>
> ```csharp
> var sb = new StringBuilder();
> foreach (var row in rows) sb.Append(row.Name).Append(',');
> var csv = sb.ToString();
> ```
> 💡 **Hack:** **many joins in a loop → StringBuilder.**

> [!question]- Q6. const vs readonly vs static
> **In simple words:**
> - `const` → fixed at **compile time**, never changes (`const int MaxRows = 100;`)
> - `readonly` → set **once**, in the declaration or constructor (e.g. from config)
> - `static` → belongs to the **class**, shared by all instances
>
> ```csharp
> public class PriceService {
>   private const decimal Gst = 0.18m;
>   private readonly ILogger<PriceService> _logger;     // set once in ctor (DI)
>   public static int InstanceCount;
>   public PriceService(ILogger<PriceService> logger) => _logger = logger;
> }
> ```

> [!question]- Q7. ref vs out vs in
> **In simple words:** ways to pass a variable **by reference**.
> - `ref` → must be set **before**; method **may** change it
> - `out` → **need not** be set before; method **must** set it (`int.TryParse`)
> - `in` → passed by reference but **read-only** (performance for big structs)
>
> ```csharp
> if (int.TryParse("42", out int n)) Console.WriteLine(n);   // classic `out`
> ```

> [!question]- Q8. What are nullable types and nullable reference types?
> **In simple words:** `int?` lets a value type be `null`. With **nullable reference types** enabled, the compiler **warns you** if something might be null: `string?` may be null, `string` shouldn't be.
>
> ```csharp
> int? discount = null;
> var d = discount ?? 0;                 // null-coalescing (same idea as JS ??)
> string? name = user?.Profile?.Name;    // null-conditional (same as JS ?.)
> ```

## OOP & SOLID

> [!question]- Q9. The 4 pillars of OOP with C# examples ⭐
> **In simple words:**
> - **Encapsulation** → hide internal data, expose safe methods (`private` field + public method)
> - **Abstraction** → show *what* it does, hide *how* (interfaces, abstract classes)
> - **Inheritance** → reuse a parent's code (`class Manager : Employee`)
> - **Polymorphism** → same call, different behaviour (`virtual` / `override`, interfaces)
>
> ```csharp
> public abstract class Discount {                      // abstraction
>   public abstract decimal Apply(decimal price);
> }
> public class FestiveDiscount : Discount {              // inheritance
>   public override decimal Apply(decimal p) => p * 0.9m;   // polymorphism
> }
> public class Account {
>   private decimal _balance;                            // encapsulation
>   public void Deposit(decimal amt) { if (amt > 0) _balance += amt; }
> }
> ```
> 💡 **Hack:** **"A PIE"**: Abstraction, Polymorphism, Inheritance, Encapsulation.

> [!question]- Q10. Abstract class vs interface ⭐
> **In simple words:** an **interface** is a **contract** (what you must do). An **abstract class** is a **partly built base class** (shared code + rules). A class can implement **many interfaces** but inherit **one class**.
>
> | | Interface | Abstract class |
> |---|---|---|
> | Code inside | only signatures (+ default methods since C# 8) | real methods and fields |
> | Constructor / state | no | yes |
> | Multiple? | ✅ implement many | ❌ inherit one |
> | Use when | "can do" ability (`IComparable`, `IRepository`) | "is a" family with shared code |
>
> 💡 **Hack:** **interface = job description; abstract class = a half-trained employee.**

> [!question]- Q11. Method overloading vs overriding; virtual, override, new, sealed
> **In simple words:** **overloading** = same name, **different parameters**, in the same class (compile time). **Overriding** = a child **replaces** a parent's `virtual` method (runtime).
>
> ```csharp
> public class Calc {
>   public int Add(int a, int b) => a + b;
>   public double Add(double a, double b) => a + b;     // overload
> }
> public class Animal { public virtual string Speak() => "..."; }
> public class Dog : Animal { public override string Speak() => "Woof"; }   // override
> public sealed class Puppy : Dog { }                     // sealed: can't be inherited
> ```
> `new` **hides** a parent method instead of overriding it (rarely what you want).
>
> 💡 **Hack:** **overload = same name, different inputs; override = child rewrites parent.**

> [!question]- Q12. Explain SOLID with simple examples ⭐
> **In simple words:** 5 rules for code that's easy to change.
>
> | Letter | Rule | Plain meaning | Example |
> |---|---|---|---|
> | **S** | Single responsibility | one class, one job | `PriceCalculator` doesn't send emails |
> | **O** | Open / closed | add new behaviour **without editing** old code | new `IDiscount` class instead of another `if` |
> | **L** | Liskov substitution | a child must work wherever the parent works | `Square : Rectangle` that breaks `SetWidth` is a violation |
> | **I** | Interface segregation | small, focused interfaces | `IReader` + `IWriter`, not one giant `IRepository` |
> | **D** | Dependency inversion | depend on **interfaces**, not concrete classes | controller takes `IDealService` via DI |
>
> ```csharp
> // O + D: add a new discount type without touching the calculator
> public interface IDiscount { decimal Apply(decimal price); }
> public class PriceCalculator(IEnumerable<IDiscount> discounts) {
>   public decimal Final(decimal p) => discounts.Aggregate(p, (acc, d) => d.Apply(acc));
> }
> ```
> 💡 **Hack:** **"Some Old Ladies Insist on Dancing."**

## C# language features

> [!question]- Q13. Delegates, Func, Action, events and lambdas
> **In simple words:** a **delegate** is a **variable that holds a method**. `Func<...>` returns a value, `Action<...>` returns nothing, `Predicate<T>` returns bool. **Lambdas** (`x => x * 2`) are the short way to write them. An **event** is a delegate others can subscribe to.
>
> ```csharp
> Func<int, int> square = x => x * x;        // like a JS arrow function
> Action<string> log = msg => Console.WriteLine(msg);
> Predicate<int> isEven = n => n % 2 == 0;
>
> public event EventHandler<Order>? OrderPlaced;  // publisher
> OrderPlaced?.Invoke(this, order);              // raise
> service.OrderPlaced += (s, o) => SendEmail(o); // subscribe
> ```
> 💡 **Hack:** **delegate = a callback in JavaScript.**

> [!question]- Q14. What is LINQ? What is deferred execution? ⭐
> **In simple words:** **LINQ** lets you query collections (and databases via EF Core) with C# methods like `Where`, `Select`, `OrderBy`, `GroupBy`, the same idea as JS `filter` / `map`. Most LINQ queries are **deferred**: nothing runs until you **loop** or call `ToList()`, `Count()`, `First()`.
>
> ```csharp
> var bigDeals = deals
>     .Where(d => d.Value > 100000)        // like filter
>     .OrderByDescending(d => d.Value)
>     .Select(d => new { d.Id, d.Name });  // like map
> // nothing has run yet ↑
> var list = bigDeals.ToList();            // runs now
>
> var byRegion = deals.GroupBy(d => d.Region)
>                     .Select(g => new { Region = g.Key, Total = g.Sum(d => d.Value) });
> ```
> 💡 **Hack:** **Where = filter, Select = map, Aggregate = reduce.** Deferred = **a recipe**, not the meal.

> [!question]- Q15. IEnumerable vs IQueryable vs List ⭐
> **In simple words:**
> - `IQueryable` → the query is turned into **SQL and runs in the database**. Filters added later still go to SQL.
> - `IEnumerable` → runs **in memory** in .NET. If you call it on a DB query, **everything is loaded first**, then filtered in C#.
> - `List` → an actual in-memory collection (already loaded).
>
> ```csharp
> IQueryable<Deal> q = db.Deals.Where(d => d.Region == "EMEA");
> var top = q.Take(10).ToList();   // ✅ SQL: ... WHERE region='EMEA' LIMIT 10
>
> IEnumerable<Deal> e = db.Deals.AsEnumerable();
> var top2 = e.Where(d => d.Region == "EMEA").Take(10).ToList();  // ❌ loads ALL deals, filters in C#
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   subgraph IQueryable
>     Q1["Where + Take"] --> SQL["translated to SQL"] --> DB1[("DB returns 10 rows")]
>   end
>   subgraph IEnumerable
>     DB2[("DB returns ALL rows")] --> MEM["filter in .NET memory 🐢"]
>   end
> ```
> 💡 **Hack:** **IQueryable = ask the shop for 10 apples; IEnumerable = buy the whole truck and pick 10 at home.** OData's `[EnableQuery]` needs `IQueryable` so `$filter` becomes SQL.

> [!question]- Q16. async / await and Task in C# ⭐
> **In simple words:** `await` **frees the thread** while waiting for slow I/O (database, HTTP), so the server can handle other requests meanwhile. An `async` method returns a **`Task`** (or `Task<T>`), which is C#'s Promise.
>
> ```csharp
> [HttpGet("{id}")]
> public async Task<ActionResult<DealDto>> Get(int id)
> {
>     var deal = await _db.Deals.FindAsync(id);   // thread goes back to the pool while waiting
>     return deal is null ? NotFound() : Ok(deal.ToDto());
> }
>
> // run independent calls in parallel (like Promise.all)
> await Task.WhenAll(LoadPricesAsync(), LoadTargetsAsync());
> ```
> ⚠️ Avoid `.Result` / `.Wait()`: they **block** the thread and can deadlock. Avoid `async void` except for event handlers.
>
> 💡 **Hack:** **Task = Promise, await = await, Task.WhenAll = Promise.all.**

> [!question]- Q17. Task vs Thread; what is the thread pool?
> **In simple words:** a **Thread** is a real OS worker (expensive to create). A **Task** is a **unit of work** that the runtime schedules on a shared **thread pool** (cheap). In ASP.NET Core you almost always use **Tasks + async/await**.
>
> 💡 **Hack:** **Thread = hiring a new employee; Task = giving a ticket to the existing team.**

> [!question]- Q18. Exception handling; throw vs throw ex
> **In simple words:** `try / catch / finally`. Catch **specific** exceptions first. Use `throw;` to rethrow: it **keeps the original stack trace**. `throw ex;` **resets** it, which hides where the error really happened.
>
> ```csharp
> try { await _repo.SaveAsync(deal); }
> catch (DbUpdateConcurrencyException) { return Conflict(); }
> catch (Exception ex)
> {
>     _logger.LogError(ex, "Save failed for {DealId}", deal.Id);
>     throw;                   // ✅ keeps the stack trace
> }
> finally { /* always runs: cleanup */ }
> ```
> 💡 **Hack:** **`throw;` keeps the crime scene; `throw ex;` wipes the fingerprints.**

> [!question]- Q19. IDisposable and the using statement
> **In simple words:** some objects hold **unmanaged resources** (DB connections, files, streams). `IDisposable.Dispose()` releases them. `using` calls `Dispose` **automatically**, even if an exception happens.
>
> ```csharp
> using var conn = new NpgsqlConnection(cs);   // disposed at the end of the scope
> await conn.OpenAsync();
> ```
> 💡 **Hack:** **using = "close the tap when you leave the room".**

> [!question]- Q20. How does garbage collection work in .NET?
> **In simple words:** the GC **automatically frees** heap objects nobody references any more. It uses **generations**: new objects start in **Gen 0** (collected often and fast); survivors move to **Gen 1**, then **Gen 2** (long-lived, collected rarely). Big objects (> ~85 KB) go to the **Large Object Heap**.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   N["new object"] --> G0["Gen 0<br/>collected often"]
>   G0 -- "survives" --> G1["Gen 1"]
>   G1 -- "survives" --> G2["Gen 2<br/>long-lived, rare GC"]
>   BIG["object > 85 KB"] --> LOH["Large Object Heap"]
> ```
> 💡 **Hack:** **most objects die young**, so cleaning the "young" area often is cheap.

> [!question]- Q21. Generics and extension methods
> **In simple words:** **generics** = reusable code with a type placeholder (`List<T>`, `Repository<T>`). **Extension methods** = add a method to an existing type without changing it.
>
> ```csharp
> public interface IRepository<T> where T : class { Task<T?> GetAsync(int id); }
>
> public static class DealExtensions {
>     public static DealDto ToDto(this Deal d) => new(d.Id, d.Name, d.Value);
> }
> var dto = deal.ToDto();   // looks like a built-in method
> ```

> [!question]- Q22. Common collections: List, Dictionary, HashSet, Queue
> | Collection | Use for | Lookup |
> |---|---|---|
> | `List<T>` | ordered list | O(n) search |
> | `Dictionary<K,V>` | key → value | O(1) |
> | `HashSet<T>` | unique items | O(1) contains |
> | `Queue<T>` / `Stack<T>` | FIFO / LIFO | |
> | `ConcurrentDictionary` | thread-safe map | O(1) |
>
> 💡 **Hack:** same as JS: **Dictionary = Map, HashSet = Set.**

## ASP.NET Core Web API

> [!question]- Q23. What happens in Program.cs? (startup)
> **In simple words:** two halves: **register services** (DI container), then **build the request pipeline** (middleware) and start **Kestrel**.
>
> ```csharp
> var builder = WebApplication.CreateBuilder(args);
>
> // 1) services (DI)
> builder.Services.AddControllers();
> builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("Db")));
> builder.Services.AddScoped<IDealService, DealService>();
> builder.Services.AddCors(o => o.AddPolicy("ui", p => p.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));
> builder.Services.AddAuthentication().AddJwtBearer();
>
> var app = builder.Build();
>
> // 2) middleware pipeline (ORDER MATTERS)
> app.UseExceptionHandler("/error");
> app.UseHttpsRedirection();
> app.UseCors("ui");
> app.UseAuthentication();
> app.UseAuthorization();
> app.MapControllers();
>
> app.Run();
> ```
> 💡 **Hack:** **"Add services, then Use middleware, then Map endpoints, then Run."**

> [!question]- Q24. What is middleware? Why does order matter? ⭐
> **In simple words:** middleware are **steps every request passes through**, in the **order you add them**. Each step can do work, **call the next one**, or **stop** and return a response. The response travels **back** through the same steps in reverse. Wrong order = bugs (e.g. authorization **before** authentication never knows who the user is).
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   REQ["Request"] --> EX["Exception handler"] --> HTTPS["HTTPS redirect"] --> CORS["CORS"] --> AUTHN["Authentication<br/>who are you?"] --> AUTHZ["Authorization<br/>are you allowed?"] --> EP["Controller / endpoint"]
>   EP -. "response flows back" .-> REQ
> ```
>
> ```csharp
> // custom middleware: time every request
> app.Use(async (context, next) =>
> {
>     var sw = Stopwatch.StartNew();
>     await next(context);                       // call the next middleware
>     _logger.LogInformation("{Path} took {Ms} ms", context.Request.Path, sw.ElapsedMilliseconds);
> });
> ```
> - `Use` → do something and call `next`
> - `Run` → **end** the pipeline (no next)
> - `Map` → branch by path
>
> 💡 **Hack:** **middleware = airport security lanes, in order**. Same idea as **Express middleware** in Node.

> [!question]- Q25. DI lifetimes: Singleton vs Scoped vs Transient ⭐
> **In simple words:** how long the DI container keeps an object.
>
> | Lifetime | One instance per… | Typical use |
> |---|---|---|
> | **Transient** | **every time** it's requested | lightweight, stateless helpers |
> | **Scoped** | **each HTTP request** | **DbContext**, repositories, services using it |
> | **Singleton** | **whole app lifetime** | config, caches, `HttpClient` factory, loggers |
>
> ```csharp
> builder.Services.AddTransient<IPriceFormatter, PriceFormatter>();
> builder.Services.AddScoped<IDealRepository, DealRepository>();
> builder.Services.AddSingleton<IFeatureFlags, FeatureFlags>();
> ```
>
> **Diagram:**
> ```mermaid
> flowchart TB
>   subgraph APP["App lifetime"]
>     S["Singleton: 1 for everyone"]
>     subgraph R1["Request 1"]
>       SC1["Scoped A"]
>       T1["Transient #1"]
>       T2["Transient #2"]
>     end
>     subgraph R2["Request 2"]
>       SC2["Scoped B"]
>       T3["Transient #3"]
>     end
>   end
> ```
> ⚠️ **Captive dependency:** never inject a **Scoped** service (like `DbContext`) into a **Singleton**: the singleton would keep one DbContext forever (not thread-safe, stale data).
>
> 💡 **Hack:** **Transient = paper cup (new each time); Scoped = your plate for this meal (one per request); Singleton = the restaurant's kitchen (one forever).**

> [!question]- Q26. Controllers vs minimal APIs
> **In simple words:** **controllers** = classes with action methods, attributes, filters: structured, good for big APIs. **Minimal APIs** = map a route straight to a lambda in `Program.cs`: less code, fast, good for small services.
>
> ```csharp
> // Controller
> [ApiController]
> [Route("api/[controller]")]
> public class DealsController(IDealService service) : ControllerBase
> {
>     [HttpGet("{id:int}")]
>     public async Task<ActionResult<DealDto>> Get(int id) =>
>         await service.GetAsync(id) is { } d ? Ok(d) : NotFound();
>
>     [HttpPost]
>     public async Task<ActionResult<DealDto>> Create(CreateDealDto dto)
>     {
>         var created = await service.CreateAsync(dto);
>         return CreatedAtAction(nameof(Get), new { id = created.Id }, created);   // 201 + Location header
>     }
> }
>
> // Minimal API
> app.MapGet("/api/deals/{id:int}", async (int id, IDealService s) =>
>     await s.GetAsync(id) is { } d ? Results.Ok(d) : Results.NotFound());
> ```
> 💡 **Hack:** **controllers = a full office; minimal APIs = a food truck.**

> [!question]- Q27. MVC vs Web API in ASP.NET Core
> **In simple words:** **MVC** returns **HTML views** (Model–View–Controller, server-rendered pages). **Web API** returns **data (JSON)** for clients like Angular. In ASP.NET Core both use the same controllers; Web API controllers inherit `ControllerBase` (no views) and use `[ApiController]`.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   B["Browser"] -- "GET /deals" --> C["Controller"]
>   C --> M["Model / service"]
>   C -- "MVC: View()" --> V["HTML page"]
>   C -- "Web API: Ok(data)" --> J["JSON"] --> NG["Angular app"]
> ```

> [!question]- Q28. Routing and model binding ([FromBody], [FromQuery]…)
> **In simple words:** **routing** maps a URL to an action. **Model binding** fills the action's parameters from the request automatically.
>
> ```csharp
> [HttpGet("{id:int}")]                       // route value: /api/deals/5
> public IActionResult Get(int id, [FromQuery] bool includeLines = false) { … }   // ?includeLines=true
>
> [HttpPost]
> public IActionResult Create([FromBody] CreateDealDto dto) { … }   // JSON body
>
> public IActionResult Upload([FromForm] IFormFile file, [FromHeader(Name = "X-Tenant")] string tenant) { … }
> ```
> With `[ApiController]`, complex types come `[FromBody]` by default.

> [!question]- Q29. How do you validate input?
> **In simple words:** put rules on the DTO; with `[ApiController]`, invalid input automatically returns **400 Bad Request** with the errors.
>
> ```csharp
> public class CreateDealDto
> {
>     [Required, StringLength(100)] public string Name { get; set; } = "";
>     [Range(1, 10_000_000)] public decimal Value { get; set; }
>     [EmailAddress] public string? OwnerEmail { get; set; }
> }
> ```
> For complex rules, teams often use **FluentValidation**.
>
> 💡 **Hack:** **validate at the door**: never trust the client, even your own Angular app.

> [!question]- Q30. IActionResult vs ActionResult&lt;T&gt;; common return helpers
> **In simple words:** both let you return **different status codes**. `ActionResult<T>` also says **what type** comes back on success (better Swagger docs, type safety).
>
> `Ok(x)` 200 · `CreatedAtAction(...)` 201 · `NoContent()` 204 · `BadRequest()` 400 · `Unauthorized()` 401 · `Forbid()` 403 · `NotFound()` 404 · `Conflict()` 409

> [!question]- Q31. Filters in ASP.NET Core
> **In simple words:** code that runs **around controller actions** (after routing), for cross-cutting work.
>
> | Filter | Runs | Use |
> |---|---|---|
> | Authorization | first | permission checks |
> | Resource | before model binding | caching |
> | **Action** | before / after the action | logging, validation |
> | **Exception** | when the action throws | error → response |
> | Result | before / after the result | headers, formatting |
>
> 💡 **Hack:** **middleware = for every request; filters = only around controller actions.**

> [!question]- Q32. Global error handling in a Web API
> **In simple words:** don't put `try/catch` in every action. Handle errors **once, centrally**, log them, and return a clean **ProblemDetails** JSON (never the stack trace).
>
> ```csharp
> builder.Services.AddProblemDetails();
> builder.Services.AddExceptionHandler<GlobalExceptionHandler>();   // .NET 8+
> app.UseExceptionHandler();
>
> public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> log) : IExceptionHandler
> {
>     public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct)
>     {
>         log.LogError(ex, "Unhandled error");
>         ctx.Response.StatusCode = ex is KeyNotFoundException ? 404 : 500;
>         await ctx.Response.WriteAsJsonAsync(new ProblemDetails { Title = "Something went wrong", Status = ctx.Response.StatusCode }, ct);
>         return true;
>     }
> }
> ```

> [!question]- Q33. Configuration: appsettings.json, environments, IOptions
> **In simple words:** settings come from **appsettings.json**, then **appsettings.{Environment}.json** overrides it, then **environment variables / secrets** override that. Read them **typed** with `IOptions<T>`.
>
> ```json
> // appsettings.json
> { "Pricing": { "MaxDiscount": 30 }, "ConnectionStrings": { "Db": "Host=…;Database=pricing" } }
> ```
> ```csharp
> builder.Services.Configure<PricingOptions>(builder.Configuration.GetSection("Pricing"));
> public class PriceService(IOptions<PricingOptions> opts) { int max = opts.Value.MaxDiscount; }
> ```
> ⚠️ Secrets (DB passwords) → **environment variables / Key Vault / AWS Secrets Manager**, never committed JSON.
>
> 💡 **Hack:** **later source wins**: json → env json → env vars → command line.

> [!question]- Q34. How do you configure CORS in .NET? 🔥
> **In simple words:** CORS is fixed **on the server**. Register a policy, then add `UseCors` **after routing and before auth**. (Full explanation of *why* CORS happens is on the JavaScript page.)
>
> ```csharp
> builder.Services.AddCors(o => o.AddPolicy("ui", p => p
>     .WithOrigins("http://localhost:4200", "https://pricing.company.com")  // exact origins
>     .AllowAnyHeader()
>     .AllowAnyMethod()
>     .AllowCredentials()));                  // ⚠️ never with AllowAnyOrigin()
>
> app.UseCors("ui");
> ```
> 💡 **Hack:** **"Allow exact origins, not everybody."**

> [!question]- Q35. How does JWT authentication and authorization work in ASP.NET Core? ⭐
> **In simple words:** **authentication** = *who are you?* (validate the JWT). **Authorization** = *what can you do?* (`[Authorize]`, roles, policies).
>
> ```csharp
> builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
>     .AddJwtBearer(o => o.TokenValidationParameters = new()
>     {
>         ValidateIssuer = true, ValidIssuer = "https://login.company.com",
>         ValidateAudience = true, ValidAudience = "pricing-api",
>         ValidateLifetime = true,
>         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
>     });
> builder.Services.AddAuthorization(o => o.AddPolicy("CanApprove", p => p.RequireRole("Manager")));
>
> [Authorize]                                    // must be logged in
> public class DealsController : ControllerBase
> {
>     [Authorize(Policy = "CanApprove")]         // must be a Manager
>     [HttpPost("{id}/approve")] public IActionResult Approve(int id) => Ok();
>     [AllowAnonymous, HttpGet("public")] public IActionResult Public() => Ok();
> }
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   R["Request + Bearer JWT"] --> AN{"Authentication<br/>signature, issuer, expiry valid?"}
>   AN -- "no" --> E401["401 Unauthorized"]
>   AN -- "yes → User" --> AZ{"Authorization<br/>role / policy ok?"}
>   AZ -- "no" --> E403["403 Forbidden"]
>   AZ -- "yes" --> OK["action runs"]
> ```
> 💡 **Hack:** **401 = "who are you?"; 403 = "I know you, but no."** AuthN before AuthZ, alphabetically too.

> [!question]- Q36. Logging in ASP.NET Core
> **In simple words:** inject `ILogger<T>` and log with **structured placeholders** (not string concatenation) so tools can search by field.
>
> ```csharp
> _logger.LogInformation("Deal {DealId} priced at {Price}", deal.Id, price);   // ✅ structured
> _logger.LogError(ex, "Pricing failed for {DealId}", deal.Id);
> ```
> Levels: Trace < Debug < Information < Warning < Error < Critical. Ship logs to **CloudWatch**, App Insights, or Serilog sinks.

> [!question]- Q37. Caching options in .NET
> - **`IMemoryCache`** → in-process, fastest, lost on restart, not shared across servers
> - **Distributed cache (Redis)** → shared across instances
> - **Output / response caching** → cache the whole HTTP response
>
> ```csharp
> var rates = await _cache.GetOrCreateAsync("fx-rates", e =>
> {
>     e.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
>     return _fx.LoadAsync();
> });
> ```

> [!question]- Q38. What is Kestrel? How is an ASP.NET Core app hosted?
> **In simple words:** **Kestrel** is ASP.NET Core's **built-in, cross-platform web server**. In production it usually sits behind a **reverse proxy** (IIS, Nginx, a load balancer) or runs in a **Docker container**.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   U["Users"] --> LB["Load balancer / Nginx / IIS<br/>HTTPS, routing"]
>   LB --> K1["Kestrel · instance 1"]
>   LB --> K2["Kestrel · instance 2"]
>   K1 --> DB[("PostgreSQL")]
>   K2 --> DB
> ```

> [!question]- Q39. How do you document and version an API?
> - **Swagger / OpenAPI**: `AddEndpointsApiExplorer()` + `AddSwaggerGen()` (or the built-in `AddOpenApi()` in .NET 9+) → interactive docs and client generation
> - **Versioning**: URL (`/api/v2/deals`), header, or query string, using the `Asp.Versioning` package
>
> 💡 **Hack:** **never break old clients**: add v2, deprecate v1 slowly. Your 3+ downstream apps would thank you.

## Entity Framework Core & PostgreSQL

> [!question]- Q40. What is EF Core? What is DbContext? ⭐
> **In simple words:** **EF Core** is an **ORM**: it maps **C# classes ↔ database tables**, so you write LINQ instead of SQL. **DbContext** = your **session with the database**: it holds `DbSet<T>` tables, **tracks changes**, and saves them with `SaveChangesAsync()`.
>
> ```csharp
> public class AppDbContext(DbContextOptions<AppDbContext> o) : DbContext(o)
> {
>     public DbSet<Deal> Deals => Set<Deal>();
>     public DbSet<Customer> Customers => Set<Customer>();
> }
> builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(cs));   // PostgreSQL via Npgsql (Scoped)
>
> var deal = await db.Deals.FirstAsync(d => d.Id == id);
> deal.Value = 250_000;
> await db.SaveChangesAsync();          // EF generates the UPDATE for you
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   C["C# LINQ<br/>db.Deals.Where(...)"] --> EF["EF Core<br/>DbContext + change tracker"]
>   EF -- "SQL" --> NP["Npgsql provider"] --> PG[("PostgreSQL")]
>   PG -- "rows" --> EF -- "objects" --> C
> ```
> 💡 **Hack:** **ORM = a translator between C# objects and SQL tables.**

> [!question]- Q41. Code-first vs database-first; migrations
> **In simple words:** **code-first** = write C# classes, EF creates / updates tables via **migrations**. **Database-first** = the DB exists; EF **scaffolds** classes from it (common with an existing Postgres DB like yours).
>
> ```bash
> dotnet ef migrations add AddDealStatus   # creates a migration from your model changes
> dotnet ef database update                # applies it to the DB
> dotnet ef dbcontext scaffold "Host=…" Npgsql.EntityFrameworkCore.PostgreSQL   # database-first
> ```
> 💡 **Hack:** **migrations = Git for your database schema.**

> [!question]- Q42. Tracking vs AsNoTracking
> **In simple words:** by default EF **tracks** loaded entities to detect changes (costs memory and time). For **read-only** queries, use `AsNoTracking()`: faster and lighter.
>
> ```csharp
> var report = await db.Deals.AsNoTracking().Where(d => d.Year == 2026).ToListAsync();   // ✅ read-only
> ```

> [!question]- Q43. Eager vs lazy vs explicit loading; the N+1 problem ⭐
> **In simple words:** how related data (a deal's customer) is loaded.
> - **Eager** → load it **in the same query** with `Include()`
> - **Lazy** → load it **automatically when you touch it** (can cause N+1)
> - **Explicit** → load it **when you ask** later
>
> **N+1 problem:** 1 query for 100 deals + **100 more** queries, one per deal's customer.
>
> ```csharp
> // ❌ N+1 (with lazy loading)
> foreach (var d in db.Deals.ToList()) Console.WriteLine(d.Customer.Name);
>
> // ✅ one query with a JOIN
> var deals = await db.Deals.Include(d => d.Customer).ToListAsync();
>
> // ✅ even better: project only what you need
> var rows = await db.Deals.Select(d => new { d.Name, Customer = d.Customer.Name }).ToListAsync();
> ```
> 💡 **Hack:** **N+1 = going to the shop 100 times for 100 items.** `Include` / `Select` = one trip.

> [!question]- Q44. How do you call a stored procedure / Postgres function from EF Core?
> **In simple words:** use **raw SQL with parameters** (never string concatenation, to avoid SQL injection).
>
> ```csharp
> // map results to an entity
> var deals = await db.Deals
>     .FromSql($"SELECT * FROM fn_get_deals_by_region({region})")
>     .ToListAsync();
>
> // non-entity result (EF Core 8+)
> var totals = await db.Database
>     .SqlQuery<RegionTotal>($"SELECT region, total FROM fn_region_totals({year})")
>     .ToListAsync();
>
> // procedure with no result
> await db.Database.ExecuteSqlAsync($"CALL sp_recalculate_targets({dealId})");
> ```
> `FromSql` with an interpolated string **creates parameters automatically**, so it's safe.

> [!question]- Q45. Transactions in EF Core
> **In simple words:** `SaveChanges()` is already **one transaction**. If you need several saves to succeed **or fail together**, open a transaction yourself.
>
> ```csharp
> await using var tx = await db.Database.BeginTransactionAsync();
> try
> {
>     db.Deals.Add(deal);          await db.SaveChangesAsync();
>     db.Targets.Add(target);      await db.SaveChangesAsync();
>     await tx.CommitAsync();
> }
> catch { await tx.RollbackAsync(); throw; }
> ```

> [!question]- Q46. EF Core vs Dapper vs raw ADO.NET?
> | | EF Core | Dapper | ADO.NET |
> |---|---|---|---|
> | You write | LINQ | SQL | SQL + manual mapping |
> | Speed | good | very fast | fastest, most code |
> | Best for | CRUD, change tracking, migrations | read-heavy reports, complex SQL | special cases |
>
> 💡 **Hack:** **EF Core for everyday CRUD; Dapper when you want full control of the SQL.**

## OData

> [!question]- Q47. How do you build an OData API in ASP.NET Core? 🧑‍💻
> **In simple words:** register OData, expose an **`IQueryable`**, and put **`[EnableQuery]`** on the action. OData then turns `$filter`, `$select`, `$orderby`, `$top`, `$expand` into **SQL** via EF Core.
>
> ```csharp
> builder.Services.AddControllers().AddOData(o => o
>     .Select().Filter().OrderBy().Expand().Count()
>     .SetMaxTop(500)                                   // protect the DB
>     .AddRouteComponents("odata", GetEdmModel()));
>
> public class DealsController(AppDbContext db) : ODataController
> {
>     [EnableQuery(PageSize = 100)]
>     public IQueryable<Deal> Get() => db.Deals.AsNoTracking();
> }
> ```
> ```http
> GET /odata/Deals?$filter=Region eq 'EMEA'&$select=Id,Name,Value&$orderby=Value desc&$top=20&$expand=Customer
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   UI["Angular / Excel / other apps"] -- "$filter $select $top" --> O["[EnableQuery]<br/>ODataController"]
>   O -- "IQueryable → SQL" --> EF["EF Core"] --> PG[("PostgreSQL")]
> ```
> ⚠️ Safety: set **`MaxTop` / `PageSize`**, limit `$expand` depth, and only allow the query options you need.
>
> 💡 **Hack:** **IQueryable + [EnableQuery] = OData magic.**

## Testing & comparisons

> [!question]- Q48. How do you unit test a .NET API?
> **In simple words:** **xUnit** (or NUnit) for tests, **Moq** / NSubstitute to fake dependencies, **`WebApplicationFactory`** for integration tests that call the real pipeline in memory.
>
> ```csharp
> public class PriceServiceTests
> {
>     [Fact]
>     public async Task Applies_premium_discount()
>     {
>         var repo = new Mock<IDealRepository>();
>         repo.Setup(r => r.GetBasePriceAsync(1)).ReturnsAsync(1000m);
>         var sut = new PriceService(repo.Object);
>
>         var price = await sut.GetFinalPriceAsync(1, Tier.Premium);
>
>         Assert.Equal(900m, price);
>     }
> }
> ```
> 💡 **Hack:** **Arrange, Act, Assert**, the same as in Jest.

> [!question]- Q49. .NET Core vs Node.js: when would you choose which? ⭐
> **In simple words:** round 1 asked this. Both are fast and both are good for APIs. Choose based on **workload and team**.
>
> | | Node.js | ASP.NET Core |
> |---|---|---|
> | Model | **single thread + event loop** | **multi-threaded** thread pool + async |
> | Shines at | I/O-heavy APIs, real-time, sharing JS/TS with Angular | **CPU-heavy logic** (pricing engines), large enterprise systems |
> | Language | JavaScript / TypeScript | C#, strongly typed |
> | Data access | Prisma, TypeORM, `pg` | **EF Core**, Dapper |
> | Your use | Node services (coverage 20 → 78%) | **OData APIs + C# pricing engine** |
>
> > "We used both. Node.js for lightweight I/O services where sharing TypeScript with Angular helps, and .NET Core where we needed heavy, strongly-typed business logic like the pricing calculation engine, and OData with EF Core over PostgreSQL."
>
> 💡 **Hack:** **Node = many quick conversations; .NET = heavy thinking work.** Say you've used **both**.

> [!question]- Q50. How would you make a slow .NET API faster?
> 1. **Measure first**: logs, Application Insights / CloudWatch, `EXPLAIN ANALYZE` on the SQL
> 2. **Database**: indexes, avoid N+1 (`Include` / `Select`), `AsNoTracking`, paginate
> 3. **async all the way**: no `.Result` / `.Wait()`
> 4. **Cache** hot, rarely-changing data (`IMemoryCache` / Redis)
> 5. **Return less**: DTOs with only needed fields, compression
> 6. **Reuse** `HttpClient` via `IHttpClientFactory`
>
> 💡 **Hack:** **"Measure, Query, Async, Cache, Shrink."**
