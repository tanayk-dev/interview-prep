---
title: JavaScript, TypeScript & Web
short: JavaScript & TS
description: Core JS, async and the event loop, TypeScript, HTTP and CORS, HTML/CSS quick-fire, Node.js and hand-written polyfills.
order: 3
icon: 🟨
color: yellow
---

> [!tip] The JD says "JavaScript Developer"
> This is the **biggest chunk** of the technical round. Expect theory, **"predict the output"** questions and one small live-coding task. Answer in 2–3 sentences, then show a tiny example.

## Basics & scope

> [!question]- Q1. var vs let vs const? ⭐
> **In simple words:** `var` is the old way: it ignores `{ }` blocks. `let` and `const` stay inside their block. `const` can't be **re-assigned**, but the object inside can still change.
>
> | | Scope | Re-declare | Re-assign | Before declaration |
> |---|---|---|---|---|
> | `var` | function | ✅ | ✅ | `undefined` |
> | `let` | block | ❌ | ✅ | ReferenceError (TDZ) |
> | `const` | block | ❌ | ❌ | ReferenceError (TDZ) |
>
> **Example:**
> ```js
> if (true) { var a = 1; let b = 2; }
> console.log(a);          // 1  → var leaks out of the block
> console.log(b);          // ❌ ReferenceError → let stays inside
>
> const arr = [1];
> arr.push(2);             // ✅ [1, 2] → changing the inside is allowed
> arr = [];                // ❌ TypeError → re-assigning is not
> ```
>
> 💡 **Hack:** **`const` = constant *binding*, not constant *value*.** *"var is Very Absent-minded"*: it forgets blocks.

> [!question]- Q2. What is hoisting?
> **In simple words:** before running your code, JavaScript **moves declarations to the top** of their scope. The *name* moves up, the *value* stays where you wrote it.
>
> - `var` → hoisted and set to `undefined`
> - **function declarations** → hoisted completely (you can call them before the line)
> - `let` / `const` / `class` → hoisted but **locked** until their line (TDZ)
>
> **Example:**
> ```js
> sayHi();                 // ✅ "Hi" → function declarations are fully hoisted
> function sayHi() { console.log('Hi'); }
>
> console.log(x);          // undefined → var is hoisted, value isn't
> var x = 5;
>
> console.log(y);          // ❌ ReferenceError → let is in the TDZ
> let y = 5;
>
> hello();                 // ❌ TypeError: hello is not a function
> var hello = function () {};   // only `var hello = undefined` was hoisted
> ```
>
> 💡 **Hack:** *"The furniture (names) moves upstairs; the people (values) stay where they are."*

> [!question]- Q3. What is the Temporal Dead Zone (TDZ)?
> **In simple words:** the time between the **start of a block** and the **line where a `let`/`const` is declared**. Touching the variable in that zone throws an error.
>
> ```js
> {
>   // TDZ for `score` starts here
>   console.log(score);    // ❌ ReferenceError
>   let score = 10;        // TDZ ends
>   console.log(score);    // ✅ 10
> }
> ```
> 💡 **Hack:** TDZ = *"Too Damn Zealous"*: you touched it before it was ready.

> [!question]- Q4. == vs ===?
> **In simple words:** `==` **converts types** before comparing (can surprise you). `===` checks **value and type**, no conversion. Always use `===`.
>
> ```js
> 5 == '5'            // true  ('5' becomes 5)
> 5 === '5'           // false (number vs string)
> 0 == false          // true
> '' == 0             // true 😱
> null == undefined   // true
> null === undefined  // false
> ```
> 💡 **Hack:** *"Three bars = three checks: value, type, no tricks."*

> [!question]- Q5. Primitive vs reference types?
> **In simple words:** primitives (string, number, boolean, null, undefined, bigint, symbol) are **copied**. Objects, arrays and functions are **shared by reference**: two variables can point to the **same** object.
>
> ```js
> let a = 10; let b = a; b = 20;
> console.log(a);        // 10 → a was copied
>
> const p1 = { name: 'Tanay' };
> const p2 = p1;         // same object, two names
> p2.name = 'Rahul';
> console.log(p1.name);  // "Rahul" 😮
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   P1["p1"] --> OBJ["{ name: 'Rahul' }<br/>one object in memory"]
>   P2["p2"] --> OBJ
> ```
> 💡 **Hack:** primitives = **photocopy**; objects = **sharing a Google Doc link**.

> [!question]- Q6. null vs undefined?
> **In simple words:** `undefined` = **JavaScript** says "nothing assigned yet". `null` = **you** say "intentionally empty".
>
> ```js
> let a;           // undefined
> let b = null;    // null (on purpose)
> typeof undefined // "undefined"
> typeof null      // "object" ← a famous old bug
> ```
> 💡 **Hack:** *undefined = "JS forgot"; null = "I chose nothing".*

> [!question]- Q7. What are scope and the scope chain?
> **In simple words:** **scope** = where a variable can be seen. If JS can't find a variable in the current function, it looks in the **outer** one, then the next outer, up to **global**. That lookup path is the **scope chain**.
>
> ```js
> const app = 'Pricing';           // global
> function outer() {
>   const team = 'FE';
>   function inner() {
>     console.log(app, team);      // finds team in outer, app in global
>   }
>   inner();
> }
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   I["inner() scope"] -- "not found? look up" --> O["outer() scope<br/>team"]
>   O -- "not found? look up" --> G["global scope<br/>app"]
>   G -- "not found" --> E["ReferenceError"]
> ```
> 💡 **Hack:** **look inside, then outside, never downwards.**

## Functions, closures & this

> [!question]- Q8. What is a closure? Give a real use ⭐
> **In simple words:** a function **remembers the variables from where it was created**, even after the outer function has finished.
>
> ```js
> function counter() {
>   let count = 0;                 // private: nobody outside can touch it
>   return () => ++count;
> }
> const next = counter();
> next(); next();                  // 2 → `count` survived
> ```
> **Real uses:** private data, **debounce / throttle**, memoization, `once()`, event handlers that need context, the module pattern.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   C["counter() runs<br/>creates count = 0"] --> F["returns arrow fn"]
>   F --> B["🎒 backpack: count"]
>   B --> N1["next() → 1"]
>   B --> N2["next() → 2"]
> ```
> 💡 **Hack:** a closure is a **backpack**: the function carries its birthplace's variables everywhere.

> [!question]- Q9. How does `this` work?
> **In simple words:** `this` = **the object that called the function**. It's decided **at call time**, not where you wrote the function. Look **left of the dot**.
>
> | How it's called | `this` is |
> |---|---|
> | `user.greet()` | `user` (left of the dot) |
> | `greet()` (no dot) | `undefined` in strict mode / modules |
> | `greet.call(admin)` / `bind(admin)` | `admin` |
> | `new Person()` | the new object |
> | arrow function | **borrows** `this` from the surrounding code |
>
> ```js
> const user = { name: 'Tanay', greet() { return 'Hi ' + this.name; } };
> user.greet();                 // "Hi Tanay"
> const fn = user.greet;
> fn();                         // ❌ this is undefined → the #1 trap
>
> const team = {
>   name: 'Pricing', members: ['A', 'B'],
>   show() { this.members.forEach(m => console.log(m, this.name)); } // ✅ arrow borrows show()'s this
> };
> ```
> 🧑‍💻 In Angular, `subscribe(data => this.items = data)` uses an **arrow** so `this` stays the component.
>
> 💡 **Hack:** **"Look left of the dot."** Priority: **N**ew > **E**xplicit (bind) > **I**mplicit (dot) > **D**efault: *"NEID"*.

> [!question]- Q10. call vs apply vs bind?
> **In simple words:** all three set `this`. `call` and `apply` **run now**; `bind` gives you a **new function to run later**.
>
> ```js
> function intro(city, role) { return `${this.name}, ${city}, ${role}`; }
> const me = { name: 'Tanay' };
>
> intro.call(me, 'Nagpur', 'Dev');     // Commas
> intro.apply(me, ['Nagpur', 'Dev']);  // Array
> const later = intro.bind(me);        // Back later
> later('Nagpur', 'Dev');
> ```
> 💡 **Hack:** **C**all = **C**ommas, **A**pply = **A**rray, **B**ind = **B**ack later.

> [!question]- Q11. Arrow function vs normal function?
> **In simple words:** arrows are **short** and **borrow** `this` from outside. They have no own `this`, no `arguments`, and can't be used with `new`.
>
> ```js
> const obj = {
>   name: 'X',
>   normal() { return this.name; },  // ✅ "X"
>   arrow: () => this.name,          // ❌ undefined → don't use arrows as methods
> };
> ```
> 💡 **Hack:** arrow = **lightweight, borrows everything**. Great for callbacks, bad for object methods.

> [!question]- Q12. What is a higher-order function? Currying?
> **In simple words:** a **higher-order function** takes a function or returns one (`map`, `filter`, `setTimeout`, debounce). **Currying** turns `f(a, b, c)` into `f(a)(b)(c)`, one argument at a time.
>
> ```js
> [1, 2, 3].map(n => n * 2);              // map is higher-order
> const multiplier = x => n => n * x;     // returns a function
> const double = multiplier(2);
> double(5);                               // 10
>
> const add = a => b => c => a + b + c;   // curried
> add(1)(2)(3);                            // 6
> ```
> 💡 **Hack:** *higher-order = functions that handle functions*; curry = **one ingredient at a time**.

> [!question]- Q13. What is an IIFE?
> **In simple words:** a function that **runs immediately** once, to create a private scope: `(function () { ... })();`
>
> ```js
> (function () {
>   const secret = 'inside';
>   console.log('ran once');
> })();
> typeof secret;   // "undefined" → didn't leak
> ```
> 💡 **Hack:** *"define and fire."* Modules replaced most uses today.

## Async JavaScript

> [!question]- Q14. Explain the event loop ⭐
> **In simple words:** JS runs **one thing at a time** (single thread). Slow work (timers, HTTP) is handed to the browser. When it finishes, its callback waits in a **queue**. The event loop moves callbacks onto the stack **when the stack is empty**, and **Promise callbacks (microtasks) always go before `setTimeout` (macrotasks)**.
>
> Order: **all sync code → all microtasks → one macrotask → all microtasks → …**
>
> ```js
> console.log(1);
> setTimeout(() => console.log(2));
> Promise.resolve().then(() => console.log(3));
> console.log(4);
> // 1 4 3 2
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   CS["Call stack<br/>runs sync code"] -- "setTimeout / fetch" --> API["Browser / Web APIs<br/>timers, network"]
>   API -- "promise done" --> MQ["Microtask queue<br/>.then · await · queueMicrotask"]
>   API -- "timer done" --> TQ["Macrotask queue<br/>setTimeout · events"]
>   MQ -- "1st: ALL of them" --> CS
>   TQ -- "2nd: ONE at a time" --> CS
> ```
> 💡 **Hack:** **"Sync → Micro → Macro"**. Promises are **VIPs**; setTimeout waits in the general line.

> [!question]- Q15. What is a Promise? What are its states? ⭐
> **In simple words:** an object that represents **a value that will arrive later**. It's **pending**, then either **fulfilled** (success) or **rejected** (error), and once settled it never changes.
>
> ```js
> const order = new Promise((resolve, reject) => {
>   setTimeout(() => resolve('🍕 delivered'), 1000);
> });
> order
>   .then(msg => console.log(msg))
>   .catch(err => console.error(err))
>   .finally(() => console.log('done'));
> ```
>
> **Diagram:**
> ```mermaid
> stateDiagram-v2
>   [*] --> Pending
>   Pending --> Fulfilled: resolve(value)
>   Pending --> Rejected: reject(error)
>   Fulfilled --> [*]: .then
>   Rejected --> [*]: .catch
> ```
> 💡 **Hack:** a Promise is a **food order**: cooking (pending), delivered (fulfilled), cancelled (rejected).

> [!question]- Q16. Promise.all vs allSettled vs race vs any?
> **In simple words:**
> - `all` → wait for **all**; **fails fast** if one fails
> - `allSettled` → wait for all; **never fails**; gives each result's status
> - `race` → the **first to finish** (success or failure) wins
> - `any` → the **first success** wins
>
> ```js
> await Promise.all([getUser(), getOrders()]);        // both, in parallel
> await Promise.allSettled([a, failing]);             // [{status:'fulfilled'}, {status:'rejected'}]
> await Promise.race([fetchData(), timeout(5000)]);   // classic timeout pattern
> await Promise.any([mirror1(), mirror2()]);          // fastest working mirror
> ```
> 💡 **Hack:** **all = all or nothing, allSettled = report card, race = first to finish, any = first to pass.**

> [!question]- Q17. async/await vs Promises?
> **In simple words:** `async/await` is **nicer syntax for Promises**. An `async` function always returns a Promise; `await` **pauses that function only** (not the whole app) until the Promise settles. Use `try/catch` for errors.
>
> ```js
> async function getUserName() {
>   try {
>     const res = await fetch('/api/user');
>     const user = await res.json();
>     return user.name;
>   } catch (e) {
>     console.error(e);
>   }
> }
> // ⚠️ Independent calls? Run them in parallel:
> const [users, orders] = await Promise.all([fetch('/users'), fetch('/orders')]);
> ```
> 💡 **Hack:** *"await = pause **this** function, not the whole app."*

> [!question]- Q18. What is callback hell and how do you fix it?
> **In simple words:** callbacks nested inside callbacks (a "pyramid") that's hard to read and handle errors in. Fix with **Promises / async-await**.
>
> ```js
> // ❌ pyramid
> getUser(id, u => getOrders(u, o => getDetails(o[0], d => console.log(d))));
> // ✅ flat
> const u = await getUser(id);
> const o = await getOrders(u);
> console.log(await getDetails(o[0]));
> ```

## Objects, prototypes & classes

> [!question]- Q19. What is prototypal inheritance? ⭐
> **In simple words:** every object has a hidden **parent** (its prototype). If a property isn't on the object, JS **asks the parent**, then the grandparent… until `null`. `class` / `extends` is just nicer syntax over this.
>
> ```js
> const animal = { eats: true };
> const dog = Object.create(animal);   // dog's parent = animal
> dog.barks = true;
> dog.eats;                            // true → found on the parent
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   D["dog<br/>barks: true"] -- "__proto__" --> A["animal<br/>eats: true"]
>   A -- "__proto__" --> OP["Object.prototype<br/>toString, hasOwnProperty"]
>   OP -- "__proto__" --> N["null (stop)"]
> ```
> 💡 **Hack:** *"Ask yourself, then your parent, then your grandparent… until null says 'don't know'."*

> [!question]- Q20. __proto__ vs prototype?
> **In simple words:** `prototype` belongs to a **constructor function / class**: it's the blueprint it gives to new objects. `__proto__` is on **every object**: the blueprint it received.
>
> ```js
> function Person(name) { this.name = name; }
> Person.prototype.hi = function () { return 'Hi ' + this.name; };
> const p = new Person('Tanay');
> p.__proto__ === Person.prototype;   // true
> ```
> 💡 **Hack:** **prototype = the blueprint a constructor hands out; __proto__ = the blueprint an object got.**

> [!question]- Q21. Shallow vs deep copy?
> **In simple words:** a **shallow** copy copies only the top level; **nested** objects are still shared. A **deep** copy copies everything.
>
> ```js
> const user = { name: 'T', address: { city: 'Nagpur' } };
> const shallow = { ...user };
> shallow.address.city = 'Pune';
> user.address.city;               // "Pune" 😮 shared
>
> const deep = structuredClone(user);
> deep.address.city = 'Mumbai';
> user.address.city;               // "Pune" ✅ untouched
> ```
> `JSON.parse(JSON.stringify(x))` also deep-copies but **loses** functions, `Date`s and `undefined`.
>
> 💡 **Hack:** shallow = **copying the folder but sharing the files inside**.

> [!question]- Q22. Object.freeze vs Object.seal?
> **In simple words:** `freeze` = nothing can change. `seal` = you can't add or delete properties, but you **can edit** existing ones. Both are **shallow**.
>
> ```js
> const f = Object.freeze({ a: 1 }); f.a = 2;   // ignored → { a: 1 }
> const s = Object.seal({ a: 1 });   s.a = 2;   // ✅ { a: 2 }
> s.b = 3; delete s.a;                          // both ignored
> ```
> 💡 **Hack:** *freeze = ice; seal = a sealed box you can still shake.*

> [!question]- Q23. What are ES6 classes? How is inheritance done?
> **In simple words:** a cleaner way to write constructor functions + prototypes. `extends` sets up the parent, `super()` calls the parent constructor.
>
> ```js
> class Employee {
>   #salary;                                   // truly private field
>   constructor(name, salary) { this.name = name; this.#salary = salary; }
>   info() { return `${this.name}`; }
>   static company() { return 'Infosys'; }     // on the class, not instances
> }
> class Manager extends Employee {
>   constructor(name, salary, team) { super(name, salary); this.team = team; }
>   info() { return super.info() + ' manages ' + this.team; }   // override
> }
> ```

## Arrays & modern syntax

> [!question]- Q24. map vs forEach vs filter vs reduce? ⭐
> **In simple words:** `map` **transforms** (new array, same length), `filter` **keeps some** (new, shorter array), `reduce` **combines into one value**, `forEach` just **does something** and returns `undefined`.
>
> ```js
> const nums = [1, 2, 3, 4];
> nums.map(n => n * 2);             // [2, 4, 6, 8]
> nums.filter(n => n % 2 === 0);    // [2, 4]
> nums.reduce((sum, n) => sum + n, 0); // 10
> nums.forEach(n => console.log(n)); // prints, returns undefined
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   A["[1, 2, 3, 4]"] -- "map(×2)" --> M["[2, 4, 6, 8]"]
>   A -- "filter(even)" --> F["[2, 4]"]
>   A -- "reduce(+)" --> R["10"]
> ```
> 💡 **Hack:** *map **makes**, filter **picks**, reduce **squeezes**, forEach just **does**.*

> [!question]- Q25. Explain reduce with real examples ⭐
> **In simple words:** walks the array carrying an **accumulator** (a running result) and returns it at the end.
>
> ```js
> // total of paid orders
> orders.filter(o => o.paid).reduce((sum, o) => sum + o.total, 0);
>
> // group by department
> users.reduce((groups, u) => {
>   (groups[u.dept] ??= []).push(u);
>   return groups;
> }, {});
>
> // count occurrences
> ['a', 'b', 'a'].reduce((c, x) => ({ ...c, [x]: (c[x] || 0) + 1 }), {}); // { a: 2, b: 1 }
> ```
> 💡 **Hack:** reduce = a **snowball** rolling down the array.

> [!question]- Q26. How do you sort numbers correctly? ⭐
> **In simple words:** `sort()` compares as **strings** by default, so `10` comes before `2`. Pass a compare function.
>
> ```js
> [10, 1, 2].sort();               // [1, 10, 2] 😬
> [10, 1, 2].sort((a, b) => a - b); // [1, 2, 10] ascending
> [10, 1, 2].sort((a, b) => b - a); // [10, 2, 1] descending
> users.sort((a, b) => a.name.localeCompare(b.name));
> const copy = arr.toSorted((a, b) => a - b);   // doesn't change the original
> ```
> 💡 **Hack:** **"a − b = ascending; b − a = big first."** `sort` **mutates**.

> [!question]- Q27. Which array methods change (mutate) the original?
> **Mutate:** `push, pop, shift, unshift, splice, sort, reverse, fill`. **Don't:** `map, filter, reduce, slice, concat, flat, toSorted, toReversed, toSpliced`.
>
> ```js
> const a = [3, 1, 2];
> a.slice(0, 2);   // [3, 1] → a unchanged
> a.splice(1, 1);  // removes 1 → a is now [3, 2]
> ```
> 💡 **Hack:** *"splice **s**urgically changes the original; slice just takes a copy."* Immutability matters in **NgRx** reducers.

> [!question]- Q28. Spread vs rest?
> **In simple words:** same `...`, opposite jobs. **Spread opens** a box; **rest packs** leftovers.
>
> ```js
> const all = [...[1, 2], ...[3, 4]];        // spread → [1, 2, 3, 4]
> const updated = { ...user, age: 30 };       // spread → copy + change
> function sum(...nums) { /* rest → array */ }
> const { name, ...others } = user;           // rest → remaining fields
> ```
> 💡 **Hack:** **spread = unpack; rest = pack.**

> [!question]- Q29. Destructuring, optional chaining ?. and nullish ?? ?
> **In simple words:** **destructuring** pulls values out by name/position. **`?.`** stops safely if something is null/undefined. **`??`** gives a default only when a value is **null or undefined** (unlike `||`, which also replaces `0` and `''`).
>
> ```js
> const { name, address: { city } = {} } = user;
> const [first, , third] = [1, 2, 3];
>
> user.profile?.city;        // undefined instead of a crash
> 0 || 10;                   // 10 😬 (0 is falsy)
> 0 ?? 10;                   // 0  ✅ (0 is a real value)
> ```
> 💡 **Hack:** `??` = *"only if it's **missing**"*; `||` = *"if it's **falsy**"*.

> [!question]- Q30. Map vs Object; Set; WeakMap?
> **In simple words:** `Map` = key-value store where **any type** can be a key, keeps insertion order, has `.size`. `Set` = **unique values**. `WeakMap` = keys are objects and **don't stop garbage collection** (good for caches attached to DOM nodes).
>
> ```js
> const m = new Map([[{ id: 1 }, 'object key works']]);
> [...new Set([1, 2, 2, 3])];   // [1, 2, 3] → quickest de-dupe
> ```

## Browser, DOM & performance

> [!question]- Q31. Event bubbling, capturing and delegation?
> **In simple words:** a click travels **down** from the page to the button (capture), then **bubbles back up** through each parent. **Delegation** = put **one** listener on a parent and use `event.target` to see which child was clicked.
>
> ```js
> ul.addEventListener('click', e => {
>   if (e.target.matches('li')) console.log('Clicked', e.target.textContent);
> });
> // works for 1,000 <li>s and for ones added later
> ```
>
> **Diagram:**
> ```mermaid
> flowchart TB
>   W["window"] -- "1 capture ⬇" --> B["body"] -- "⬇" --> U["ul"] -- "⬇" --> L["li (target)"]
>   L -- "2 bubble ⬆" --> U2["ul ✋ delegated listener"] -- "⬆" --> B2["body"]
> ```
> 💡 **Hack:** **bubbles rise.** Delegation = *one receptionist instead of a guard at every door.*

> [!question]- Q32. Debounce vs throttle?
> **In simple words:** **debounce** waits until the user **stops** (search box). **Throttle** runs **at most once every X ms** (scroll, resize).
>
> ```js
> input.addEventListener('input', debounce(e => search(e.target.value), 300));
> window.addEventListener('scroll', throttle(checkPosition, 200));
> ```
> 💡 **Hack:** **debounce = lift door** (waits until people stop entering); **throttle = metro train** (leaves every X minutes no matter what). Code is in the "write by hand" section.

> [!question]- Q33. localStorage vs sessionStorage vs cookies?
> | | Size | Lives until | Sent to server? |
> |---|---|---|---|
> | localStorage | ~5–10 MB | you delete it | no |
> | sessionStorage | ~5 MB | tab closes | no |
> | cookie | ~4 KB | expiry you set | **yes, with every request** |
>
> ```js
> localStorage.setItem('user', JSON.stringify({ name: 'T' }));   // strings only
> JSON.parse(localStorage.getItem('user'));
> ```
> ⚠️ Don't store **auth tokens** in localStorage if you can avoid it (XSS can read it). **HttpOnly cookies** are safer.
>
> 💡 **Hack:** *local = long-term locker; session = this visit only; cookie = travels with you to the server.*

> [!question]- Q34. What causes memory leaks in JavaScript?
> **In simple words:** something keeps a reference to memory you no longer need, so it's never freed.
>
> Common causes: timers not cleared, event listeners not removed, closures holding big data, detached DOM nodes, globals, **Observables never unsubscribed** (Angular).
>
> ```js
> ngOnInit()    { this.timer = setInterval(() => this.poll(), 1000); }
> ngOnDestroy() { clearInterval(this.timer); }   // ✅ always clean up
> ```

> [!question]- Q35. What is a SPA? ⭐
> **In simple words:** a **Single-Page Application** loads **one HTML page** once; JavaScript then swaps screens and fetches data via APIs **without full page reloads** (Angular, React).
>
> **Pros:** fast, app-like. **Cons:** big first download, SEO (solved with **SSR**).
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   B["Browser"] -- "1st load: index.html + JS" --> S["Server"]
>   B -- "after that: only JSON via API" --> API["API"]
>   B --> R["Router swaps components<br/>no page reload"]
> ```

## TypeScript

> [!question]- Q36. What is TypeScript and why use it? ⭐
> **In simple words:** **JavaScript + types**. It checks your code **while you type / build**, then compiles to normal JS. Browsers never run TS directly.
>
> ```ts
> function total(price: number, qty: number): number { return price * qty; }
> total('100', 2);   // ❌ compile error → caught before the customer sees it
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   A["app.ts"] --> B{"tsc<br/>type check"}
>   B -- "❌ error" --> C["fix it now"]
>   B -- "✅ ok" --> D["app.js"] --> E["browser / Node"]
> ```
> 💡 **Hack:** **TS = JS + a spell-checker.**

> [!question]- Q37. interface vs type? ⭐
> **In simple words:** both describe shapes. **Interface** can be **extended and merged**, best for objects / class contracts. **Type** can also describe **unions, tuples and primitives**.
>
> ```ts
> interface User { id: number; name: string }
> interface Admin extends User { permissions: string[] }
>
> type Status = 'active' | 'blocked';      // union → type only
> type Point = [number, number];           // tuple
> type AdminUser = User & { permissions: string[] };  // intersection
> ```
> 💡 **Hack:** **interface = open contract; type = a label that can describe anything.**

> [!question]- Q38. any vs unknown vs never vs void? ⭐
> **In simple words:**
> - `any` → **turns checking off** (avoid)
> - `unknown` → "could be anything, **check before you use it**"
> - `void` → function returns nothing
> - `never` → **can't happen** (always throws, or the impossible switch branch)
>
> ```ts
> let u: unknown = 'hi';
> u.toUpperCase();                           // ❌ check first
> if (typeof u === 'string') u.toUpperCase(); // ✅
> function fail(msg: string): never { throw new Error(msg); }
> ```
> 💡 **Hack:** **any = "I don't care"; unknown = "I'll check first".**

> [!question]- Q39. What are generics? ⭐
> **In simple words:** **type placeholders** that make code reusable *and* type-safe. Like a function parameter, but for types.
>
> ```ts
> function first<T>(arr: T[]): T | undefined { return arr[0]; }
> first<number>([1, 2]);       // number
> first(['a', 'b']);           // string (inferred)
>
> interface ApiResponse<T> { data: T; status: number }
> this.http.get<User[]>('/api/users');            // Angular uses generics everywhere
> function getId<T extends { id: number }>(x: T) { return x.id; }   // constraint
> ```
> 💡 **Hack:** **generics = a blank to fill in for types.**

> [!question]- Q40. Common utility types? ⭐
> | Utility | What it does | Use |
> |---|---|---|
> | `Partial<T>` | all fields optional | PATCH / update DTO |
> | `Required<T>` | all fields required | |
> | `Readonly<T>` | can't modify | NgRx state |
> | `Pick<T, K>` | keep only some fields | |
> | `Omit<T, K>` | remove some fields | create-DTO without `id` |
> | `Record<K, V>` | object with keys K and values V | lookup maps |
> | `ReturnType<F>` | a function's return type | |
>
> ```ts
> interface User { id: number; name: string; email: string }
> type NewUser = Omit<User, 'id'>;          // { name, email }
> type Patch   = Partial<User>;             // all optional
> ```
> 💡 **Hack:** **"PROP R"**: Partial, Readonly/Required, Omit, Pick, Record.

> [!question]- Q41. Union vs intersection; type narrowing?
> **In simple words:** `A | B` = **either** A or B. `A & B` = **both**. **Narrowing** = checking with `typeof`, `in`, `instanceof` or a tag so TS knows the exact type inside an `if`.
>
> ```ts
> function format(v: string | number) {
>   return typeof v === 'string' ? v.toUpperCase() : v.toFixed(2);
> }
> type Shape = { kind: 'circle'; r: number } | { kind: 'square'; side: number };
> function area(s: Shape) {
>   switch (s.kind) {                  // discriminated union, like NgRx action.type
>     case 'circle': return Math.PI * s.r ** 2;
>     case 'square': return s.side ** 2;
>   }
> }
> ```
> 💡 **Hack:** `|` = OR, `&` = AND; narrowing = **asking ID at the door**.

> [!question]- Q42. Access modifiers; abstract class vs interface?
> **In simple words:** `public` (anyone), `protected` (class + children), `private` (this class only), `readonly`. An **abstract class** can contain real code but can't be created directly; an **interface** is only a checklist with no code.
>
> ```ts
> abstract class Shape {
>   abstract area(): number;                      // child must implement
>   describe() { return `Area: ${this.area()}`; } // shared code
> }
> class Circle extends Shape {
>   constructor(private r: number) { super(); }   // Angular-style shorthand
>   area() { return Math.PI * this.r ** 2; }
> }
> ```
> 💡 **Hack:** **abstract class = a half-built house; interface = the architect's checklist.**

> [!question]- Q43. What are decorators?
> **In simple words:** functions written with `@` that **attach extra behaviour or metadata** to a class, property or method. Angular is built on them: `@Component`, `@Injectable`, `@Input`, `@HostListener`.
>
> 💡 **Hack:** a decorator = **a sticky label** telling the framework how to treat the thing below it.

## Web, HTTP & CORS

> [!question]- Q44. What is CORS and when does a CORS error happen? 🔥
> **In simple words:** **CORS = Cross-Origin Resource Sharing.** Browsers have a safety rule, the **same-origin policy**: a page may only read responses from **its own origin** (same **scheme + host + port**). CORS is how a **server says "I allow that other origin"**, using response headers. ⚠️ In round 1 you said certificates. **It has nothing to do with certificates.**
>
> **When it happens:** your Angular app on `http://localhost:4200` calls `http://localhost:3000/api` (different **port** = different origin) and the server **doesn't** send `Access-Control-Allow-Origin: http://localhost:4200`. The request may even reach the server, but the **browser blocks your code from reading the response**.
>
> **Preflight:** for "non-simple" requests (PUT / DELETE, `Content-Type: application/json`, or an `Authorization` header), the browser first sends an **`OPTIONS`** request asking permission.
>
> **Diagram:**
> ```mermaid
> sequenceDiagram
>   participant B as Browser (app on :4200)
>   participant S as API server (:3000)
>   B->>S: OPTIONS /api/orders (preflight)<br/>Origin: http://localhost:4200<br/>Access-Control-Request-Method: PUT
>   S-->>B: 204 Access-Control-Allow-Origin: http://localhost:4200<br/>Allow-Methods: GET, PUT<br/>Allow-Headers: Authorization, Content-Type
>   B->>S: PUT /api/orders (real request)
>   S-->>B: 200 + Access-Control-Allow-Origin
>   Note over B: ✅ JS can read the response.<br/>If the header is missing → ❌ CORS error in console
> ```
>
> **How to fix (always on the server):**
> ```js
> // Node / Express
> app.use(cors({ origin: ['http://localhost:4200', 'https://app.company.com'], credentials: true }));
> ```
> ```csharp
> // .NET
> builder.Services.AddCors(o => o.AddPolicy("ui", p =>
>     p.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));
> app.UseCors("ui");
> ```
> ```json
> // Angular dev only: proxy.conf.json → the browser sees the same origin
> { "/api": { "target": "http://localhost:3000", "secure": false } }
> ```
>
> **Key facts to say:**
> - CORS is enforced by the **browser only**. **Postman and server-to-server calls never hit it.**
> - Never use `*` together with **credentials** (cookies); list exact origins.
> - Origin = **scheme + host + port**. `http` vs `https`, or `:4200` vs `:3000`, are different origins.
>
> 💡 **Hack:** **"Browser asks, server allows."** CORS = the server's **guest list**; the browser is the **bouncer**.

> [!question]- Q45. What happens when you type a URL and press Enter?
> **In simple words:** find the server, connect securely, ask for the page, then build it on screen.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   A["URL"] --> B["DNS lookup<br/>name → IP"]
>   B --> C["TCP + TLS handshake<br/>(HTTPS)"]
>   C --> D["HTTP GET request"]
>   D --> E["Server responds<br/>HTML"]
>   E --> F["Browser parses HTML → DOM<br/>CSS → CSSOM"]
>   F --> G["Render tree → layout → paint"]
>   G --> H["JS runs, fetches more data"]
> ```
> 💡 **Hack:** **"DNS, Connect, Request, Response, Render."**

> [!question]- Q46. HTTP methods, status codes and idempotency
> **In simple words:** methods say **what you want to do**; status codes say **what happened**. **Idempotent** = doing it twice has the same effect as once.
>
> | Method | Does | Idempotent? |
> |---|---|---|
> | GET | read | ✅ |
> | POST | create | ❌ (two posts = two orders) |
> | PUT | replace whole resource | ✅ |
> | PATCH | update some fields | usually ❌ |
> | DELETE | remove | ✅ |
>
> | Code | Meaning |
> |---|---|
> | 200 OK · 201 Created · 204 No Content | success |
> | 301 / 302 redirect · 304 Not Modified | redirection / cache |
> | 400 Bad Request · **401 Unauthorized** (not logged in) · **403 Forbidden** (logged in, no permission) · 404 Not Found · 409 Conflict · 429 Too Many Requests | client error |
> | 500 Internal Error · 502 Bad Gateway · 503 Unavailable | server error |
>
> 💡 **Hack:** **2 = good, 3 = go elsewhere, 4 = your fault, 5 = my fault.** 401 = **"who are you?"**, 403 = **"I know you, but no."**

> [!question]- Q47. What is REST? What makes an API RESTful?
> **In simple words:** a style for APIs where **URLs are nouns** (resources) and **HTTP methods are verbs**. Stateless: every request carries everything needed (e.g. the JWT).
>
> ```http
> GET    /api/orders        → list
> GET    /api/orders/42     → one
> POST   /api/orders        → create
> PUT    /api/orders/42     → replace
> DELETE /api/orders/42     → delete
> ```
> 💡 **Hack:** **nouns in the URL, verbs in the method.** Not `/getOrders`.

> [!question]- Q48. How does JWT authentication work?
> **In simple words:** after login, the server gives a **signed token** (JWT) containing who you are. The client sends it in every request (`Authorization: Bearer …`). The server **verifies the signature**; no session lookup needed.
>
> A JWT = **header.payload.signature** (Base64). The payload is **readable by anyone**, so never put secrets in it.
>
> **Diagram:**
> ```mermaid
> sequenceDiagram
>   participant C as Angular app
>   participant A as Auth API
>   participant R as Orders API
>   C->>A: POST /login (user, password)
>   A-->>C: JWT (signed, expires in 1h)
>   C->>R: GET /orders<br/>Authorization: Bearer JWT
>   R->>R: verify signature + expiry
>   R-->>C: 200 orders
> ```
> 🧑‍💻 In Angular, an **HTTP interceptor** attaches the token to every request.
>
> 💡 **Hack:** JWT = a **signed visitor badge**: anyone can read it, nobody can forge it.

> [!question]- Q49. XSS vs CSRF: how do you prevent them?
> **In simple words:** **XSS** = an attacker gets **their script running in your page** (e.g. via a comment field). **CSRF** = a malicious site **tricks your logged-in browser** into sending a request to your app.
>
> - **XSS fixes:** escape output (Angular does this by default with `{{ }}`), avoid `innerHTML` / `bypassSecurityTrust…`, Content-Security-Policy header.
> - **CSRF fixes:** `SameSite` cookies, CSRF tokens, or use `Authorization` headers instead of cookies.
>
> 💡 **Hack:** **XSS = bad script *inside* your site; CSRF = bad request *from another* site.**

## HTML & CSS quick-fire

> [!question]- Q50. Semantic HTML and why it matters
> **In simple words:** use tags that **describe meaning**: `header, nav, main, section, article, aside, footer`, `button` (not a clickable `div`). It helps **accessibility** (screen readers), **SEO**, and readability.
>
> Also know: `alt` on images, `<label for>` on inputs, ARIA only when no native element fits.

> [!question]- Q51. script async vs defer?
> **In simple words:** both download **without blocking** the HTML. `async` runs **as soon as it arrives** (any order). `defer` runs **after the HTML is parsed, in order**.
>
> **Diagram:**
> ```mermaid
> gantt
>   dateFormat X
>   axisFormat %s
>   section normal
>   parse HTML :a1, 0, 3
>   download+run (blocks) :crit, a2, 3, 6
>   parse rest :a3, 6, 9
>   section async
>   parse HTML :b1, 0, 5
>   download :b2, 0, 4
>   run (pauses parsing) :crit, b3, 5, 6
>   parse rest :b4, 6, 8
>   section defer
>   parse HTML :c1, 0, 8
>   download :c2, 0, 4
>   run after parse :c3, 8, 9
> ```
> 💡 **Hack:** *async = "whoever arrives first eats"; defer = "wait for everyone, then eat in order".*

> [!question]- Q52. The CSS box model and box-sizing
> **In simple words:** every element is a box: **content → padding → border → margin**. With `box-sizing: border-box`, the `width` **includes** padding and border, which makes layouts predictable.
>
> **Diagram:**
> ```mermaid
> flowchart TB
>   subgraph M["margin (outside space)"]
>     subgraph B["border"]
>       subgraph P["padding (inside space)"]
>         C["content"]
>       end
>     end
>   end
> ```

> [!question]- Q53. CSS specificity: which rule wins?
> **In simple words:** more specific selectors win: **inline style > #id > .class / [attr] / :hover > element**. Same specificity → the **later** rule wins. `!important` beats everything (avoid it).
>
> ```css
> p { color: black; }          /* 0-0-1 */
> .note { color: blue; }       /* 0-1-0 */
> #intro { color: red; }       /* 1-0-0  ← wins */
> ```
> 💡 **Hack:** count **(ids, classes, elements)** like a score: **1-0-0 beats 0-9-9**.

> [!question]- Q54. Flexbox vs Grid; how to center a div
> **In simple words:** **Flexbox = one direction** (a row *or* a column). **Grid = two directions** (rows *and* columns).
>
> ```css
> .center { display: flex; justify-content: center; align-items: center; }
> .center2 { display: grid; place-items: center; }
> .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
> ```
> 💡 **Hack:** **flex = a line of people; grid = a chessboard.**

> [!question]- Q55. position: static, relative, absolute, fixed, sticky?
> - `static` → normal flow (default)
> - `relative` → normal flow, nudged; becomes the **anchor** for absolute children
> - `absolute` → removed from flow, placed relative to the nearest positioned parent
> - `fixed` → stuck to the **screen** (headers, chat buttons)
> - `sticky` → normal until you scroll past a point, then sticks (table headers)

> [!question]- Q56. display:none vs visibility:hidden vs opacity:0
> | | Takes space? | Clickable? |
> |---|---|---|
> | `display: none` | ❌ | ❌ |
> | `visibility: hidden` | ✅ | ❌ |
> | `opacity: 0` | ✅ | ✅ |

> [!question]- Q57. How do you make a page responsive?
> **Mobile-first** CSS, **media queries**, flexible units (`%`, `rem`, `vw`, `fr`), Flexbox / Grid, responsive images (`srcset`), and the viewport meta tag.
>
> ```css
> .grid { display: grid; grid-template-columns: 1fr; }
> @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
> ```

## Node.js

> [!question]- Q58. What is Node.js and why is it fast for APIs?
> **In simple words:** JavaScript **on the server** (V8 engine). It handles many requests with **one thread** using **non-blocking I/O**: while waiting for the database, it serves other requests.
>
> **Good for:** APIs, real-time apps, I/O-heavy work. **Bad for:** heavy CPU work (use **worker threads** or another service).
>
> 💡 **Hack:** Node = **one waiter serving many tables**: takes the order, doesn't stand in the kitchen waiting.

> [!question]- Q59. Node.js event loop phases
> **In simple words:** the same idea as the browser loop, with named phases. `process.nextTick` and Promises run **between** phases, before anything else.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   T["timers<br/>setTimeout"] --> P["pending callbacks"]
>   P --> PO["poll<br/>I/O: DB, files, network"]
>   PO --> CH["check<br/>setImmediate"]
>   CH --> CL["close callbacks"]
>   CL --> T
> ```
> ```js
> setTimeout(() => console.log('timeout'));
> setImmediate(() => console.log('immediate'));
> Promise.resolve().then(() => console.log('promise'));
> process.nextTick(() => console.log('nextTick'));
> // nextTick, promise, then timeout / immediate (order of those two can vary in the main module)
> ```

> [!question]- Q60. What is Express middleware?
> **In simple words:** functions that run **in a chain** for every request: each one can read/change `req` and `res`, then call `next()` to pass it on, or send the response and stop.
>
> ```js
> app.use(express.json());                       // parse body
> app.use(cors({ origin: 'http://localhost:4200' }));
> app.use((req, res, next) => { console.log(req.method, req.url); next(); }); // logger
> app.use('/api', authMiddleware, ordersRouter); // auth then routes
> app.use((err, req, res, next) => {             // error handler: 4 args
>   res.status(err.status || 500).json({ message: err.message });
> });
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   R["Request"] --> J["json parser"] --> C["cors"] --> L["logger"] --> A{"auth ok?"}
>   A -- "yes" --> RT["route handler"] --> RES["Response"]
>   A -- "no" --> E["401"]
>   RT -- "throws" --> EH["error middleware<br/>(err, req, res, next)"]
> ```
> 💡 **Hack:** middleware = **airport security lanes**: each checks you, then says `next()`.

> [!question]- Q61. How do you handle errors in Node / Express?
> - `try/catch` around `await` in handlers (or a wrapper that forwards to `next(err)`)
> - **One central error middleware** with 4 args that logs and returns a clean JSON error
> - Validate input early (400), never leak stack traces to clients
> - `process.on('unhandledRejection')` for logging as a last resort
>
> ```js
> const asyncHandler = fn => (req, res, next) => fn(req, res, next).catch(next);
> app.get('/orders/:id', asyncHandler(async (req, res) => {
>   const order = await repo.find(req.params.id);
>   if (!order) return res.status(404).json({ message: 'Not found' });
>   res.json(order);
> }));
> ```

> [!question]- Q62. What are streams in Node.js?
> **In simple words:** process data **piece by piece** instead of loading it all into memory. Good for big files, CSV exports and uploads.
>
> ```js
> fs.createReadStream('big.csv')
>   .pipe(zlib.createGzip())
>   .pipe(fs.createWriteStream('big.csv.gz'));   // never holds the whole file in memory
> ```
> 💡 **Hack:** streams = **drinking with a straw**, not swallowing the whole glass.

> [!question]- Q63. How do you test a Node.js API? 🔥
> **In simple words:** **Jest** for unit tests (mock the DB), **Supertest** to call routes like a real client, coverage reports in CI. This is how you took coverage **from 20% to 78%**.
>
> ```js
> const request = require('supertest');
> const app = require('../app');
> jest.mock('../repo/orders.repo', () => ({ find: jest.fn().mockResolvedValue({ id: 1 }) }));
>
> test('GET /orders/1 returns the order', async () => {
>   const res = await request(app).get('/orders/1').set('Authorization', 'Bearer test');
>   expect(res.status).toBe(200);
>   expect(res.body.id).toBe(1);
> });
> ```

> [!question]- Q64. CommonJS vs ES modules?
> **In simple words:** two ways to split code into files. **CommonJS** (`require` / `module.exports`) is Node's original, loads synchronously. **ES modules** (`import` / `export`) are the standard, statically analysable (tree-shaking), and the default in modern Node and browsers.
>
> ```js
> const fs = require('fs'); module.exports = { add };   // CommonJS
> import fs from 'node:fs'; export function add() {}     // ESM
> ```

## Predict the output

> [!question]- Q65. Output drill: the classics ⭐
> Cover the comments and answer first.
> ```js
> for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));   // 3 3 3 (one shared var)
> for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));   // 0 1 2 (new i each loop)
>
> console.log(typeof null);           // "object"
> console.log(typeof NaN);            // "number"
> console.log([] + []);               // ""
> console.log([] + {});               // "[object Object]"
> console.log(1 + '2' - 1);           // 11  ('12' - 1)
> console.log('5' * '2');             // 10
> console.log(0.1 + 0.2 === 0.3);     // false (floating point)
> console.log(NaN === NaN);           // false → use Number.isNaN
> console.log(!!'false');             // true (non-empty string)
> console.log([1, 2, 3] == '1,2,3');  // true
> ```
> 💡 **Hack:** `+` with a string → **join text**; `- * /` → **convert to numbers**.

> [!question]- Q66. Output drill: async order ⭐
> ```js
> console.log('A');
> setTimeout(() => console.log('B'), 0);
> Promise.resolve().then(() => console.log('C')).then(() => console.log('D'));
> (async () => { console.log('E'); await null; console.log('F'); })();
> console.log('G');
> // A E G C F D B
> ```
> **Why:** sync first (**A, E, G**; the async function runs synchronously until its first `await`) → microtasks in the order they were queued (**C, F**, then **D** queued by C) → macrotask (**B**).

> [!question]- Q67. Output drill: this and closures
> ```js
> const obj = {
>   name: 'obj',
>   regular() { return this.name; },
>   arrow: () => this?.name,
>   delayedArrow() { setTimeout(() => console.log(this.name)); },
> };
> obj.regular();       // "obj"
> obj.arrow();         // undefined (arrow: `this` of the module, not obj)
> obj.delayedArrow();  // "obj" (arrow borrows delayedArrow's this)
>
> const detached = obj.regular;
> detached();          // ❌ TypeError in strict mode / modules: `this` is undefined
>
> let x = 1;
> function f() { console.log(x); }
> function g() { let x = 2; f(); }
> g();                 // 1 → scope is decided where f was WRITTEN (lexical), not where it's called
> ```

## Write these by hand

> [!question]- Q68. Write debounce and throttle ⭐
> ```js
> function debounce(fn, delay) {
>   let timer;
>   return function (...args) {
>     clearTimeout(timer);                              // cancel the previous wait
>     timer = setTimeout(() => fn.apply(this, args), delay);
>   };
> }
>
> function throttle(fn, limit) {
>   let waiting = false;
>   return function (...args) {
>     if (waiting) return;                              // ignore calls during the cooldown
>     fn.apply(this, args);
>     waiting = true;
>     setTimeout(() => (waiting = false), limit);
>   };
> }
> ```
> **Explain while writing:** "the **closure** keeps `timer` / `waiting` alive between calls."

> [!question]- Q69. Write polyfills: map, filter, reduce, bind
> ```js
> Array.prototype.myMap = function (cb) {
>   const out = [];
>   for (let i = 0; i < this.length; i++) out.push(cb(this[i], i, this));
>   return out;
> };
> Array.prototype.myFilter = function (cb) {
>   const out = [];
>   for (let i = 0; i < this.length; i++) if (cb(this[i], i, this)) out.push(this[i]);
>   return out;
> };
> Array.prototype.myReduce = function (cb, init) {
>   let i = 0, acc = init;
>   if (acc === undefined) { acc = this[0]; i = 1; }
>   for (; i < this.length; i++) acc = cb(acc, this[i], i, this);
>   return acc;
> };
> Function.prototype.myBind = function (ctx, ...pre) {
>   const fn = this;
>   return (...args) => fn.apply(ctx, [...pre, ...args]);
> };
> ```

> [!question]- Q70. Write Promise.all, flatten, deep clone, memoize
> ```js
> function promiseAll(promises) {
>   return new Promise((resolve, reject) => {
>     const results = []; let done = 0;
>     if (!promises.length) return resolve(results);
>     promises.forEach((p, i) =>
>       Promise.resolve(p).then(v => {
>         results[i] = v;                               // keep the original order
>         if (++done === promises.length) resolve(results);
>       }, reject));                                    // first failure rejects all
>   });
> }
>
> const flatten = arr => arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), []);
> // flatten([1, [2, [3, [4]]]]) → [1, 2, 3, 4]
>
> const deepClone = o => o === null || typeof o !== 'object' ? o
>   : Array.isArray(o) ? o.map(deepClone)
>   : Object.fromEntries(Object.entries(o).map(([k, v]) => [k, deepClone(v)]));
>
> const memoize = fn => {
>   const cache = new Map();
>   return n => cache.has(n) ? cache.get(n) : (cache.set(n, fn(n)), cache.get(n));
> };
> ```
