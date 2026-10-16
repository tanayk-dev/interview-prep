---
title: Angular
short: Angular
description: Components, change detection, RxJS, signals, NgRx, forms, routing, performance and the v16 → v20 changes, linked to your Nx / NgRx work.
order: 4
icon: 🅰️
color: red
---

> [!tip] This is your home ground
> Your resume is **Angular + NgRx + Nx**, and the app was upgraded **16 → 20**. Expect depth here. For every "how would you…" question answer in **3 layers**: **concept → Angular feature name → example from your project.** In round 1 you knew the concepts but missed the feature names.

## Core concepts

> [!question]- Q1. What is Angular? Angular vs AngularJS? ⭐
> **In simple words:** Angular is Google's **TypeScript, component-based framework** for building single-page apps. **AngularJS (1.x)** is the old **JavaScript MVC** version with `$scope` and a digest cycle; it reached end of life in 2021.
>
> | AngularJS 1.x | Angular 2+ |
> |---|---|
> | JavaScript | TypeScript |
> | Controllers + `$scope` | Components |
> | Digest cycle (dirty checking) | Zone.js / signals |
> | No CLI, slow on big pages | CLI, AOT, mobile-friendly, much faster |
>
> ```ts
> // Angular: a standalone component
> @Component({ selector: 'app-hello', template: '<p>Hello {{ name }}</p>' })
> export class HelloComponent { name = 'Tanay'; }
> ```
> 💡 **Hack:** *AngularJS = the **J**urassic **J**S version; Angular = the TypeScript rewrite.*

> [!question]- Q2. What architecture does Angular follow? Is it MVC? 🔥
> **In simple words:** Angular is **component-based**. Each component = **TypeScript class + HTML template + styles**. It's closest to **MVVM** (Model–View–ViewModel): the **template is the View**, the **component class is the ViewModel** (holds data and handles events), and **services / the store are the Model** (data and business logic). In round 1 you said "not 100% sure". Say this confidently.
>
> With NgRx you add a **unidirectional data flow** (Redux pattern). At app level you used an **Nx monorepo**: apps + shared libraries (feature / UI / data-access / util).
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   V["View<br/>HTML template"] -- "events (click)" --> VM["ViewModel<br/>component class"]
>   VM -- "data binding {{ }} [ ]" --> V
>   VM -- "calls / dispatches" --> M["Model<br/>services · NgRx store"]
>   M -- "observables / signals" --> VM
>   M --> API[("API")]
> ```
> **Answer to say:**
> > "Angular is component-based and maps closest to MVVM: the template is the view, the component class is the view-model, and services or the NgRx store are the model. We follow a unidirectional data flow with NgRx, and our code is organised as an Nx monorepo with shared feature, UI and data-access libraries."
>
> 💡 **Hack:** **"Template = View, Class = ViewModel, Service = Model."**

> [!question]- Q3. What are the building blocks of an Angular app?
> **In simple words:** **components** (what you see), **templates**, **services** (shared logic and data via DI), **directives** (change the DOM), **pipes** (format data), **routing** (which screen), and **standalone imports** or NgModules (what's available where).
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   APP["Angular app"] --> R["Router<br/>which screen"]
>   R --> C["Component<br/>class + template"]
>   C --> D["Directives<br/>change DOM"]
>   C --> P["Pipes<br/>format data"]
>   C -- "injects" --> S["Service<br/>logic + HTTP"]
>   S --> API[("Backend API")]
> ```
> 💡 **Hack:** *what you see (component), what you share (service), what you tweak (directive / pipe), where you go (router).*

> [!question]- Q4. Standalone components vs NgModules?
> **In simple words:** **NgModules** were containers that declared which components exist and what they can use. **Standalone components** (default since v17) **import what they need directly**, with no module file. Less boilerplate, easier lazy loading.
>
> ```ts
> // Before: declare in an NgModule
> @NgModule({ declarations: [OrdersComponent], imports: [CommonModule, FormsModule] })
> export class OrdersModule {}
>
> // Now: standalone (the `standalone: true` flag is the default since v19)
> @Component({
>   selector: 'app-orders',
>   imports: [CurrencyPipe, ReactiveFormsModule, OrderRowComponent],
>   templateUrl: './orders.component.html',
> })
> export class OrdersComponent {}
>
> // main.ts
> bootstrapApplication(AppComponent, { providers: [provideRouter(routes), provideHttpClient()] });
> ```
> 💡 **Hack:** **NgModule = a shared toolbox for a whole room; standalone = each worker carries their own tools.**

> [!question]- Q5. What's new from Angular 16 to 20? ⭐ 🔥
> **In simple words:** you lived through this upgrade, so name the features with versions.
>
> | Version | Highlights |
> |---|---|
> | **16** | **Signals** (preview), `takeUntilDestroyed`, required inputs, `DestroyRef`, esbuild builder (preview) |
> | **17** | New **control flow `@if` / `@for` / `@switch`**, **`@defer`**, standalone by default, new **Vite + esbuild** application builder |
> | **18** | **Zoneless** change detection (experimental), Material 3 stable, `@let` template variables (18.1), event replay for SSR |
> | **19** | `standalone: true` is the **default**, **incremental hydration**, `linkedSignal`, `resource()` |
> | **20** | Signal APIs **stable** (`effect`, `linkedSignal`, `toSignal`), **zoneless** moves out of experimental (`provideZonelessChangeDetection()`), template improvements |
>
> ```html
> @if (orders().length) {
>   @for (o of orders(); track o.id) { <app-order-row [order]="o" /> }
> } @else {
>   <p>No orders</p>
> }
> @defer (on viewport) { <app-heavy-chart /> } @placeholder { <p>Loading chart…</p> }
> ```
> 💡 **Hack:** **"S-S-C-D-Z"**: **S**tandalone, **S**ignals, **C**ontrol flow, **D**efer, **Z**oneless. Exact version numbers matter less than knowing what each does.

> [!question]- Q6. Data binding types; two-way binding ⭐
> **In simple words:** binding = keeping the class and the template **in sync**.
>
> - `{{ value }}` interpolation: class → view
> - `[src]="url"` property binding: class → view
> - `(click)="save()"` event binding: view → class
> - `[(ngModel)]="name"` two-way: both directions
>
> ```html
> <h1>Hello {{ name }}</h1>
> <img [src]="logoUrl">
> <button (click)="save()">Save</button>
> <input [(ngModel)]="name">   <!-- type → name updates → h1 updates -->
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   TS["Component class"] -- "{{ }} and [property]" --> V["Template"]
>   V -- "(event)" --> TS
>   TS <-- "[(ngModel)] two-way" --> V
> ```
> 💡 **Hack:** **"Banana in a box" `[( )]`**: `[ ]` = data in, `( )` = events out.

> [!question]- Q7. All the ways components communicate ⭐
> **In simple words:**
> 1. **Parent → child:** `@Input()` / `input()`
> 2. **Child → parent:** `@Output()` + `EventEmitter` / `output()`
> 3. **Parent reads child:** `@ViewChild` / `viewChild()`
> 4. **Unrelated components:** a **shared service** with `BehaviorSubject` or a signal
> 5. **App-wide:** **NgRx store** 🧑‍💻
> 6. **Through the URL:** route params / query params
>
> ```ts
> // child
> export class RowComponent {
>   order = input.required<Order>();          // data in (signal input)
>   selected = output<Order>();               // event out
> }
> // parent template
> // <app-row [order]="o" (selected)="open($event)" />
>
> // sideways
> @Injectable({ providedIn: 'root' })
> export class CartService {
>   count = signal(0);
>   add() { this.count.update(c => c + 1); }
> }
> ```
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   P["Parent"] -- "@Input ⬇" --> C["Child"]
>   C -- "@Output ⬆" --> P
>   A["Component A"] -- "set / next" --> S(["Shared service<br/>signal / BehaviorSubject"])
>   S -- "read / subscribe" --> B["Component B"]
>   X["Any component"] -- "dispatch" --> ST[("NgRx store")] -- "select" --> Y["Any component"]
> ```
> 💡 **Hack:** **"Down with Input, Up with Output, Sideways with a Service, Everywhere with a Store."**

> [!question]- Q8. Lifecycle hooks in order
> **In simple words:** methods Angular calls at key moments in a component's life.
>
> | Hook | When | Use it for |
> |---|---|---|
> | `constructor` | class created | DI only |
> | `ngOnChanges` | an `@Input` changed (before init, then each change) | react to input changes |
> | **`ngOnInit`** | once, inputs are ready | **load data** |
> | `ngDoCheck` | every change detection | custom checks (rare, costly) |
> | `ngAfterContentInit` | projected `<ng-content>` ready | |
> | **`ngAfterViewInit`** | own view + `@ViewChild` ready | DOM work, focus, charts |
> | **`ngOnDestroy`** | before removal | **unsubscribe, clear timers** |
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   K["constructor"] --> CH["ngOnChanges"] --> I["ngOnInit"] --> DC["ngDoCheck"]
>   DC --> CI["ngAfterContentInit"] --> VI["ngAfterViewInit"] --> D["ngOnDestroy"]
>   VI -. "inputs change again" .-> CH
> ```
> 💡 **Hack:** **"Cats In Cages Can't Visit Dogs"** = Changes, Init, Check, Content, View, Destroy.

> [!question]- Q9. Constructor vs ngOnInit?
> **In simple words:** the **constructor** is plain TypeScript: use it only to receive dependencies. **`ngOnInit`** runs after Angular has set the inputs: do setup and API calls there.
>
> ```ts
> constructor(private api: OrderService) {
>   console.log(this.customerId);   // undefined → inputs not set yet
> }
> ngOnInit() {
>   this.api.load(this.customerId); // ✅ inputs ready
> }
> ```
> 💡 **Hack:** **constructor = wiring the house; ngOnInit = moving in.**

> [!question]- Q10. Directives: types, and how to write a custom one
> **In simple words:** a directive **adds behaviour to an element**.
> - **Component** = a directive with a template
> - **Structural** = adds / removes elements: `*ngIf`, `*ngFor` (now `@if`, `@for`)
> - **Attribute** = changes look or behaviour: `ngClass`, `ngStyle`, custom ones
>
> ```ts
> // <p appHighlight="yellow">Hover me</p>
> @Directive({ selector: '[appHighlight]' })
> export class HighlightDirective {
>   color = input('yellow', { alias: 'appHighlight' });
>   @HostBinding('style.backgroundColor') bg = '';
>   @HostListener('mouseenter') on()  { this.bg = this.color(); }
>   @HostListener('mouseleave') off() { this.bg = ''; }
> }
> ```
> 💡 **Hack:** **structural = adds / removes bricks; attribute = paints the bricks.** `@HostListener` = listen on the host, `@HostBinding` = set a property on the host.

> [!question]- Q11. Pipes: pure vs impure; custom pipe ⭐
> **In simple words:** pipes **format values in the template** without changing the data: `{{ price | currency:'INR' }}`, `date`, `uppercase`, `async`, `json`. **Pure** (default) re-runs only when the input **reference** changes → fast. **Impure** runs on **every** change detection → slow.
>
> ```ts
> @Pipe({ name: 'truncate' })
> export class TruncatePipe implements PipeTransform {
>   transform(value: string, len = 20) {
>     return value.length > len ? value.slice(0, len) + '…' : value;
>   }
> }
> // {{ description | truncate:40 }}
> ```
> 💡 **Hack:** pipes are **Instagram filters** for data: the photo doesn't change, only how it looks.

> [!question]- Q12. ng-content, ng-template, ng-container
> **In simple words:**
> - `ng-content` = a **slot** where the parent's HTML is placed (content projection)
> - `ng-template` = HTML that is **not rendered until you use it**
> - `ng-container` = an **invisible wrapper** that adds no DOM element
>
> ```html
> <!-- card.component.html -->
> <div class="card"><ng-content /></div>
> <!-- usage -->
> <app-card><h3>Any HTML here</h3></app-card>
>
> <ng-template #loading><p>Loading…</p></ng-template>
> <ng-container *ngTemplateOutlet="loading" />
> ```
> 💡 **Hack:** **content = slot; template = recipe (cook later); container = invisible box.**

> [!question]- Q13. ViewChild vs ContentChild
> **In simple words:** `@ViewChild` finds something in **the component's own template**. `@ContentChild` finds something **projected in by the parent** through `<ng-content>`.
>
> ```ts
> @ViewChild('searchBox') box!: ElementRef;         // in my template: <input #searchBox>
> @ContentChild(TabTitleComponent) title!: TabTitleComponent;  // passed in by the parent
> ngAfterViewInit()    { this.box.nativeElement.focus(); }   // ViewChild ready here
> ngAfterContentInit() { console.log(this.title); }          // ContentChild ready here
> ```
> 💡 **Hack:** **View = what I wrote; Content = what I was given.**

> [!question]- Q14. View encapsulation
> **In simple words:** by default, a component's CSS **only affects that component** (Angular adds unique attributes to scope it).
>
> | Mode | Effect |
> |---|---|
> | `Emulated` (default) | styles scoped via generated attributes |
> | `ShadowDom` | real browser Shadow DOM |
> | `None` | styles become **global** |
>
> 💡 **Hack:** **Emulated = a fenced garden.** `None` = no fence.

## Services, DI & RxJS

> [!question]- Q15. What is dependency injection in Angular?
> **In simple words:** instead of a class **creating** what it needs (`new HttpClient()`), it **asks for it** and Angular **hands it in**. Easier to test (swap in a mock) and to share one instance.
>
> - `@Injectable({ providedIn: 'root' })` → **one shared instance** (singleton) for the whole app
> - `providers: [X]` on a component → **a new instance** for that component and its children
>
> ```ts
> @Injectable({ providedIn: 'root' })
> export class LoggerService { log(m: string) { console.log(m); } }
>
> export class OrdersComponent {
>   private logger = inject(LoggerService);       // modern
>   constructor(private http: HttpClient) {}      // classic
> }
> ```
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   C["Component asks for LoggerService"] --> E{"In the component's providers?"}
>   E -- "yes" --> U1["new instance per component"]
>   E -- "no" --> R{"In a route / environment injector?"}
>   R -- "yes" --> U2["use that one"]
>   R -- "no" --> ROOT{"providedIn: 'root'?"}
>   ROOT -- "yes" --> U3["app-wide singleton"]
>   ROOT -- "no" --> ERR["❌ NullInjectorError"]
> ```
> 💡 **Hack:** **DI = room service**: you ask, the hotel delivers.

> [!question]- Q16. Observable vs Promise ⭐
> **In simple words:** a **Promise** gives **one** value, starts immediately, can't be cancelled. An **Observable** can give **many** values over time, is **lazy** (starts on subscribe), and can be **cancelled** (unsubscribe), with powerful operators.
>
> | Observable | Promise |
> |---|---|
> | many values | one value |
> | lazy | eager |
> | cancellable | not cancellable |
> | `map`, `filter`, `switchMap`… | `then` / `catch` |
>
> ```ts
> const ticks$ = interval(1000);                 // nothing happens yet
> const sub = ticks$.subscribe(n => console.log(n));
> sub.unsubscribe();                             // cancelled
> ```
> 💡 **Hack:** **Promise = one pizza delivery; Observable = a Netflix subscription.**

> [!question]- Q17. Subject vs BehaviorSubject vs ReplaySubject
> **In simple words:**
> - `Subject` → no starting value; late subscribers **miss** earlier values
> - `BehaviorSubject` → **needs a starting value**; new subscribers get the **latest** value at once (good for state)
> - `ReplaySubject(n)` → replays the **last n** values
>
> ```ts
> const b = new BehaviorSubject(0);
> b.next(5);
> b.subscribe(v => console.log(v));   // 5 immediately
> ```
> 💡 **Hack:** **Subject = live TV; BehaviorSubject = live TV that shows you the current scene; ReplaySubject = TV with rewind.**

> [!question]- Q18. map vs switchMap vs mergeMap vs concatMap vs exhaustMap ⭐
> **In simple words:** what to do when a new value arrives while the **previous inner request** is still running:
> - `switchMap` → **cancel** the old one, keep the latest (**search box**)
> - `mergeMap` → run **all in parallel** (bulk uploads)
> - `concatMap` → **queue**, one after another, in order (saves)
> - `exhaustMap` → **ignore** new ones while busy (**login / submit button**)
> - `map` → just transform the value (no inner request)
>
> ```ts
> search$.pipe(switchMap(q => this.api.search(q)));
> files$.pipe(mergeMap(f => this.api.upload(f)));
> saves$.pipe(concatMap(d => this.api.save(d)));
> submit$.pipe(exhaustMap(() => this.api.placeOrder(this.form.value)));
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   U["User types a → ab → abc"] --> SW["switchMap<br/>only 'abc' result"]
>   U --> MG["mergeMap<br/>3 results, any order"]
>   U --> CC["concatMap<br/>3 results, in order"]
>   U --> EX["exhaustMap<br/>only 'a' result"]
> ```
> 💡 **Hack:** **Switch = "forget the old one", Merge = "everyone at once", Concat = "wait in line", Exhaust = "busy, go away".**

> [!question]- Q19. Other RxJS operators you should know
> | Operator | Plain meaning |
> |---|---|
> | `filter` | let only some values through |
> | `tap` | peek / log without changing anything |
> | `debounceTime(300)` | wait for a pause |
> | `distinctUntilChanged` | skip if same as last |
> | `catchError` | handle an error, return a fallback |
> | `retry(2)` | try again on error |
> | `takeUntil` / `take(1)` | stop after a signal / after one |
> | `forkJoin` | wait for all to complete (like `Promise.all`) |
> | `combineLatest` | latest value from each, whenever any changes |
> | `shareReplay(1)` | share one HTTP call among many subscribers |
>
> ```ts
> forkJoin({ user: this.api.user(), orders: this.api.orders() })
>   .subscribe(({ user, orders }) => { /* both ready */ });
> ```

> [!question]- Q20. How do you prevent memory leaks (unsubscribe)?
> **In simple words:** every subscription that doesn't complete by itself must be ended when the component dies.
>
> 1. **`async` pipe** in the template → auto-unsubscribes (best)
> 2. **`takeUntilDestroyed()`** (v16+)
> 3. `toSignal()` → auto-cleans
> 4. `take(1)` for one-off values
>
> ```ts
> users$ = this.store.select(selectUsers);       // template: @for (u of users$ | async; track u.id)
> constructor() {
>   this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(v => this.preview = v);
> }
> ```
> HTTP calls complete on their own; **store selects, `valueChanges`, `interval` and router events don't**.
>
> 💡 **Hack:** **"Subscribe in the template, not in the class."**

## Signals & change detection

> [!question]- Q21. What are signals? Signals vs Observables
> **In simple words:** a **signal** is a value that **tells Angular when it changes**. `signal()` holds a value, `computed()` derives one, `effect()` runs side effects. Angular then updates **only what depends on it**.
>
> ```ts
> price = signal(100);
> qty = signal(2);
> total = computed(() => this.price() * this.qty());   // 200, auto-updates
> constructor() { effect(() => console.log('total', this.total())); }
> increase() { this.qty.update(q => q + 1); }          // total → 300
> ```
> **Signals:** synchronous **state** (always has a value). **Observables:** **async streams and events** (HTTP, websockets, typing). Bridge with `toSignal()` / `toObservable()`.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   P["price = signal(100)"] --> T["total = computed()"]
>   Q["qty = signal(2)"] --> T
>   T --> V["template {{ total() }}"]
>   T --> E["effect(): log / save"]
> ```
> 💡 **Hack:** **signal = a spreadsheet cell** (change one, formulas update); **observable = a river** of values over time.

> [!question]- Q22. How does change detection work? Default vs OnPush
> **In simple words:** after any async event (click, HTTP, timer), **Zone.js** tells Angular "something happened" and Angular **checks components** for changed values.
> - **Default:** checks **every** component, every time.
> - **OnPush:** checks a component only when **an input reference changes**, an **event happens inside it**, the **`async` pipe emits**, a **signal it reads changes**, or you call `markForCheck()`. Needs **immutable** updates (NgRx fits perfectly).
>
> ```ts
> @Component({ changeDetection: ChangeDetectionStrategy.OnPush, ... })
> export class UserCardComponent { user = input.required<User>(); }
>
> this.user.name = 'New';                       // ❌ same object → OnPush child won't update
> this.user = { ...this.user, name: 'New' };    // ✅ new reference → updates
> ```
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   EV["click / HTTP / timer"] --> Z["Zone.js: something happened"]
>   Z --> DEF["Default component<br/>always checked"]
>   Z --> OP{"OnPush component:<br/>new input ref? own event?<br/>async emit? signal changed?"}
>   OP -- "yes" --> CHK["check it"]
>   OP -- "no" --> SKIP["skip it + its children ⚡"]
> ```
> 💡 **Hack:** **Default = checks every room in the hotel; OnPush = only knocks when there's a delivery.**

> [!question]- Q23. What is zoneless Angular?
> **In simple words:** running Angular **without Zone.js**. Instead of guessing that "something happened" after every event, Angular updates when **signals change**, the **async pipe** emits, or you call `markForCheck()`. Result: smaller bundle, fewer unnecessary checks, clearer stack traces.
>
> ```ts
> bootstrapApplication(AppComponent, { providers: [provideZonelessChangeDetection()] });
> ```
> 💡 **Hack:** **Zone.js = a smoke alarm for every room; zoneless = each appliance reports itself.**

## State management (NgRx)

> [!question]- Q24. Explain the NgRx flow 🧑‍💻
> **In simple words:** one central **store** holds app state. Components **dispatch actions** ("this happened"). **Reducers** (pure functions) make the **new state**. **Selectors** read slices of it. **Effects** handle side effects like API calls and dispatch success / failure actions.
>
> ```ts
> // actions
> export const loadUsers = createAction('[Users] Load');
> export const loadUsersSuccess = createAction('[Users] Load Success', props<{ users: User[] }>());
> // reducer
> export const usersReducer = createReducer(initialState,
>   on(loadUsers, s => ({ ...s, loading: true })),
>   on(loadUsersSuccess, (s, { users }) => ({ ...s, users, loading: false })));
> // effect
> loadUsers$ = createEffect(() => this.actions$.pipe(
>   ofType(loadUsers),
>   switchMap(() => this.api.getUsers().pipe(
>     map(users => loadUsersSuccess({ users })),
>     catchError(e => of(loadUsersFailure({ error: e.message })))))));
> // selector
> export const selectUsers = createSelector(selectUsersState, s => s.users);
> // component
> this.store.dispatch(loadUsers());
> users = this.store.selectSignal(selectUsers);
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   C["Component"] -- "1 dispatch(loadUsers)" --> A(["Action"])
>   A --> R["2 Reducer<br/>old state + action → new state"]
>   R --> S[("3 Store")]
>   S -- "4 select(selectUsers)" --> C
>   A --> E["Effect"]
>   E -- "HTTP" --> API[("API")]
>   E -- "dispatch(loadUsersSuccess)" --> A
> ```
> 💡 **Hack:** **restaurant**: order (action) → kitchen rules (reducer) → pantry (store) → waiter serves (selector); effects = the delivery guy who goes outside.

> [!question]- Q25. Why NgRx? When NOT to use it? 🧑‍💻
> **Why:** one source of truth, predictable one-way flow, **Redux DevTools** time travel, shared state across many features, side effects isolated in effects.
> **Not for:** small apps or local UI state; use a **service with signals / BehaviorSubject**, **ComponentStore** or **SignalStore** instead.
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   Q{"Who needs this state?"} -- "one component" --> L["signal in the component"]
>   Q -- "a few components" --> SV["service + signals"]
>   Q -- "many features, many writers,<br/>needs debugging" --> N["NgRx store ✅"]
> ```
> 💡 **Hack:** *"NgRx is a truck: great for moving house, silly for buying groceries."*

> [!question]- Q26. Why must reducers be pure? What are memoised selectors?
> **In simple words:** a **pure** reducer = same input → same output, **no API calls, no mutation**. That makes state predictable and time-travel debugging possible. **Memoised** selectors (`createSelector`) remember their last result and **recompute only when their inputs change**.
>
> ```ts
> on(addItem, (s, { item }) => { s.items.push(item); return s; })          // ❌ mutation
> on(addItem, (s, { item }) => ({ ...s, items: [...s.items, item] }))       // ✅ new object
> export const selectTotal = createSelector(selectItems, items => items.reduce((t, i) => t + i.price, 0));
> ```

## Forms, routing & HTTP

> [!question]- Q27. Template-driven vs reactive forms ⭐
> **In simple words:** **template-driven** = the form logic lives in **HTML** (`ngModel`), good for simple forms. **Reactive** = the form is built in **TypeScript** (`FormGroup`, `FormControl`), better for complex / dynamic forms and **easy to unit test**.
>
> ```ts
> private fb = inject(FormBuilder);
> form = this.fb.nonNullable.group({
>   email: ['', [Validators.required, Validators.email]],
>   discount: [0, [Validators.min(0), Validators.max(50)]],
>   phones: this.fb.array([this.fb.control('')]),
> });
> // <form [formGroup]="form" (ngSubmit)="save()"><input formControlName="email"></form>
> ```
> 💡 **Hack:** **template-driven = the form runs itself; reactive = you drive it from TypeScript.**

> [!question]- Q28. How do you write a custom validator?
> **In simple words:** a function that receives a control and returns **`null` if valid** or an **error object** if not.
>
> ```ts
> export const noSpaces: ValidatorFn = c =>
>   c.value?.includes(' ') ? { noSpaces: true } : null;
>
> // cross-field validator on the group
> export const dateRange: ValidatorFn = g =>
>   g.get('from')!.value > g.get('to')!.value ? { badRange: true } : null;
> ```
> Async validators return an Observable (e.g. "username already taken").

> [!question]- Q29. Routing basics: params, lazy loading
> **In simple words:** the router maps **URLs to components**. **Lazy loading** downloads a feature's code **only when its route is first visited** → a faster first load.
>
> ```ts
> export const routes: Routes = [
>   { path: '', component: HomeComponent },
>   { path: 'orders/:id', component: OrderComponent },
>   { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
>   { path: 'reports', loadChildren: () => import('./reports/routes').then(m => m.REPORT_ROUTES) },
>   { path: '**', component: NotFoundComponent },
> ];
> // reading a param
> id = inject(ActivatedRoute).snapshot.paramMap.get('id');
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   S["App starts"] --> M["main bundle<br/>home + shared"]
>   M --> U{"User opens /admin"}
>   U -- "first time" --> L["download admin chunk"] --> SH["show admin"]
>   U -- "already loaded" --> SH
> ```
> 💡 **Hack:** **lazy loading = streaming the next episode only when you click it.**

> [!question]- Q30. Route guards and resolvers
> **In simple words:** guards decide **whether you may enter or leave** a route.
> - `canActivate` → may I enter? (logged in?)
> - `canDeactivate` → may I leave? (unsaved changes?)
> - `canMatch` → should this route even load?
> - `resolve` → fetch data **before** showing the page
>
> ```ts
> export const authGuard: CanActivateFn = () =>
>   inject(AuthService).isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
>
> export const unsavedGuard: CanDeactivateFn<EditComponent> = c =>
>   c.form.dirty ? confirm('Discard changes?') : true;
> ```
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   N["navigate to /orders/5/edit"] --> CA{"canActivate<br/>logged in?"}
>   CA -- "no" --> LG["redirect /login"]
>   CA -- "yes" --> RS["resolve: load order"] --> PG["page shows"]
>   PG -- "user leaves" --> CD{"canDeactivate<br/>unsaved?"}
>   CD -- "cancel" --> PG
>   CD -- "ok" --> OUT["navigate away"]
> ```
> 💡 **Hack:** **security at the entrance (activate), at the exit (deactivate), and a receptionist who prepares your file (resolve).**

> [!question]- Q31. HTTP interceptors: what and why?
> **In simple words:** code that sits **between your app and every HTTP call**, like middleware. Use it to **add the auth token**, handle **errors globally** (401 → login), show a **loader**, log, retry.
>
> ```ts
> export const authInterceptor: HttpInterceptorFn = (req, next) => {
>   const token = inject(AuthService).token();
>   return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(
>     catchError(err => {
>       if (err.status === 401) inject(Router).navigate(['/login']);
>       return throwError(() => err);
>     }));
> };
> // app.config.ts
> provideHttpClient(withInterceptors([authInterceptor]))
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   C["http.get('/api/orders')"] --> I1["auth: add token"] --> I2["loader: show spinner"] --> S[("Server")]
>   S --> I2b["loader: hide"] --> I1b["errors: 401 → login"] --> C2["component gets data"]
> ```
> 💡 **Hack:** interceptor = **airport security**: every bag passes through it.

> [!question]- Q32. How do you create a new environment (staging)? ⭐
> **In simple words:** a separate config file per environment, swapped in at build time.
>
> ```ts
> // src/environments/environment.staging.ts
> export const environment = { production: false, apiUrl: 'https://staging-api.myapp.com' };
> ```
> ```json
> // angular.json → configurations
> "staging": { "fileReplacements": [
>   { "replace": "src/environments/environment.ts", "with": "src/environments/environment.staging.ts" } ] }
> ```
> Build: `ng build --configuration=staging`. ⚠️ **Never put secrets there**: everything in the front end is public.

> [!question]- Q33. How do you handle errors globally in Angular?
> - **HTTP errors** → an **interceptor** with `catchError` (toast, redirect on 401)
> - **Everything else** → a custom **`ErrorHandler`**
> - **Per-stream** → `catchError` returning a fallback
>
> ```ts
> @Injectable()
> export class GlobalErrorHandler implements ErrorHandler {
>   handleError(error: unknown) { console.error(error); /* send to logging service */ }
> }
> // providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
> ```

## Performance

> [!question]- Q34. A table with lots of data is slow. Which Angular features fix it? ⭐ 🔥
> **In simple words:** the browser is slow because it's drawing **thousands of DOM rows** and Angular is **checking all of them**. Render **only what's visible**, render **less often**, and fetch **less data**. In round 1 the panel pushed twice for the **Angular feature name**: it's **CDK virtual scroll**.
>
> **1. Angular CDK virtual scroll** (the answer they wanted): renders only the ~20 rows on screen, recycling them as you scroll.
> ```ts
> import { ScrollingModule } from '@angular/cdk/scrolling';
> ```
> ```html
> <cdk-virtual-scroll-viewport itemSize="48" style="height: 600px">
>   <div *cdkVirtualFor="let row of rows; trackBy: trackById" class="row">{{ row.name }}</div>
> </cdk-virtual-scroll-viewport>
> ```
> **2. `trackBy` / `track`**: re-render only rows that changed: `@for (r of rows; track r.id)`
> **3. OnPush + immutable updates**: skip checking unchanged rows
> **4. Server-side pagination / infinite scroll**: don't fetch 50,000 rows; fetch pages (AG Grid **server-side / infinite row model**, `$top` / `$skip` in OData)
> **5. No function calls in templates**: use **pure pipes** or **`computed()`** signals
> **6. Debounce filters / search** with `debounceTime(300)`
> **7. Web Worker** for heavy sorting / calculations off the main thread
> **8. `@defer`** for heavy parts below the fold
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   D["50,000 rows of data"] --> P["Server pagination<br/>fetch 100 at a time"]
>   P --> V["CDK virtual scroll<br/>draw ~20 visible rows"]
>   V --> T["trackBy + OnPush<br/>redraw only changed rows"]
>   T --> F["fast table ⚡"]
> ```
> **Answer to say:**
> > "First I'd use **Angular CDK virtual scrolling** so only the visible rows are in the DOM, with **trackBy** and **OnPush** so unchanged rows aren't re-checked. For really large data I'd switch to **server-side pagination or infinite scroll**: in our app we used **AG Grid's** server-side row model. I'd also remove function calls from the template using pure pipes or computed signals, and move heavy sorting to a Web Worker if needed."
>
> 💡 **Hack:** **"Draw less, check less, fetch less."** And the name to say first: **CDK virtual scroll.**

> [!question]- Q35. General Angular performance checklist
> **In simple words:** **"O-T-L-P-V-D"**:
> - **O**nPush everywhere
> - **T**rackBy / `track` in loops
> - **L**azy-loaded routes
> - **P**ure pipes / computed signals instead of template functions
> - **V**irtual scroll for big lists
> - **D**efer heavy blocks (`@defer`)
>
> Plus: production build (AOT, tree-shaking, minification), bundle analysis (`source-map-explorer`), image optimisation (`NgOptimizedImage`), unsubscribe properly, avoid heavy `ngDoCheck`.
>
> ```html
> <p>{{ calculateTotal(items) }}</p>   <!-- ❌ runs on every change detection -->
> <p>{{ total() }}</p>                 <!-- ✅ computed signal, cached -->
> ```

> [!question]- Q36. AOT vs JIT; what is Ivy? ⭐
> **In simple words:** **AOT (Ahead-of-Time)** compiles templates to JavaScript **at build time** → faster startup, smaller bundles, template errors caught early. **JIT (Just-in-Time)** compiles **in the browser** (old dev mode). **Ivy** is Angular's compiler / renderer (default since v9) that made AOT the default and enabled tree-shaking, standalone and signals.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   subgraph AOT["AOT · cook before guests arrive"]
>     A1["ng build"] --> A2["templates → JS"] --> A3["browser just runs ⚡"]
>   end
>   subgraph JIT["JIT · cook while guests wait"]
>     J1["download compiler + templates"] --> J2["compile in browser"] --> J3["render 🐢"]
>   end
> ```

> [!question]- Q37. What are SSR and hydration?
> **In simple words:** **SSR (Server-Side Rendering)** builds the HTML **on the server**, so users and search engines see content immediately. **Hydration** is Angular then **attaching to that HTML** in the browser (instead of re-drawing it) to make it interactive. **Incremental hydration** (v19+) hydrates parts only when needed.
>
> ```ts
> // ng add @angular/ssr
> provideClientHydration(withEventReplay())
> ```
> 💡 **Hack:** **SSR = deliver a fully built house; hydration = switching on the electricity.**

## Testing & tooling

> [!question]- Q38. How do you test Angular apps? 🧑‍💻
> **In simple words:** **unit tests** with **Jest** (or Jasmine / Karma) and `TestBed`, mocking services and HTTP; **E2E** with **Playwright**. Mention your **20% → 78% coverage** story.
>
> ```ts
> it('fetches users', () => {
>   TestBed.configureTestingModule({ providers: [UserService, provideHttpClient(), provideHttpClientTesting()] });
>   const service = TestBed.inject(UserService);
>   const http = TestBed.inject(HttpTestingController);
>
>   service.getAll().subscribe(users => expect(users.length).toBe(2));
>   http.expectOne('/api/users').flush([{ id: 1 }, { id: 2 }]);
> });
>
> // NgRx: provideMockStore({ initialState }) in the TestBed providers
> ```

> [!question]- Q39. Why an Nx monorepo? 🧑‍💻
> **In simple words:** many apps and **shared libraries** in **one repo**, with tooling that keeps it fast and clean.
> - **Shared libs** (UI, data-access, utils) reused across apps
> - **Module boundaries** (tags + lint rules) stop messy imports
> - **`nx affected`** builds / tests **only what your change touched**
> - **Caching** of build and test results
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   subgraph apps
>     P["pricing-app"]
>     R["reporting-app"]
>   end
>   subgraph libs
>     UI["shared/ui"]
>     DA["shared/data-access"]
>     UT["shared/utils"]
>   end
>   P --> UI
>   P --> DA
>   R --> UI
>   R --> DA
>   DA --> UT
> ```
> 💡 **Hack:** **Nx = an apartment building with shared amenities; only the floors you renovated get re-inspected.**

> [!question]- Q40. Useful Angular CLI commands
> ```bash
> ng new my-app                     # create
> ng serve                          # dev server
> ng g c orders/order-list          # generate a component
> ng g s orders/order               # generate a service
> ng build --configuration=production
> ng test                           # unit tests
> ng update @angular/core@20 @angular/cli@20   # step-by-step upgrades
> ng add @angular/material          # add a library with its setup
> ```

## AngularJS 1.x quick sheet

> [!question]- Q41. AngularJS: $scope, digest cycle, directives in 60 seconds
> **In simple words:** in case the "AngularJS" in the job title is literal.
> - **`$scope`**: the glue object between controller and view (`$rootScope` = global parent)
> - **Digest cycle**: AngularJS loops through all **watchers**, comparing old and new values (**dirty checking**) until nothing changes. Code outside AngularJS (plain `setTimeout`) needs `$scope.$apply()`; use `$timeout` instead.
> - **Directives**: `ng-model`, `ng-repeat`, `ng-if` (removes from DOM) vs `ng-show` (hides with CSS); custom directives with isolate scope `=` (two-way), `@` (string), `&` (function)
> - **Service vs factory vs provider**: service = class used with `new`; factory = function returning an object; provider = configurable in the `config` phase
> - **`$http`**, **`$q`** promises, `ngRoute` / `ui-router`
>
> ```js
> app.controller('CartCtrl', function ($scope, $timeout) {
>   $scope.count = 0;
>   $scope.add = () => $scope.count++;            // ng-click → digest runs automatically
>   $timeout(() => $scope.count++, 1000);         // ✅ triggers a digest
> });
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   EV["ng-click / $http / $timeout"] --> AP["$apply()"] --> DG["$digest loop"]
>   DG --> W["check every watcher<br/>old vs new"]
>   W -- "something changed" --> DG
>   W -- "stable" --> UI["update DOM"]
> ```
> 💡 **Hack:** **"Too many watchers = slow digest"** is the classic AngularJS performance answer.

## Scenario questions

> [!question]- Q42. A search box fires too many API calls
> **In simple words:** wait for a pause, skip repeats, cancel old requests.
>
> ```ts
> results$ = this.searchCtrl.valueChanges.pipe(
>   debounceTime(300),                // wait until typing pauses
>   map(q => q.trim()),
>   filter(q => q.length > 2),        // ignore very short input
>   distinctUntilChanged(),           // skip the same text
>   switchMap(q => this.api.search(q).pipe(catchError(() => of([])))),  // cancel stale calls
> );
> ```
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   K["keystrokes"] --> D["debounceTime 300"] --> F["filter length > 2"] --> DU["distinctUntilChanged"] --> SW["switchMap(api)"] --> R["results$ | async"]
> ```

> [!question]- Q43. Users double-click Submit and create duplicate orders
> **In simple words:** ignore clicks while saving, disable the button, and make the server safe too.
>
> ```ts
> submit$ = new Subject<void>();
> saving = signal(false);
> constructor() {
>   this.submit$.pipe(
>     tap(() => this.saving.set(true)),
>     exhaustMap(() => this.api.placeOrder(this.form.getRawValue()).pipe(finalize(() => this.saving.set(false)))),
>     takeUntilDestroyed(),
>   ).subscribe();
> }
> // <button (click)="submit$.next()" [disabled]="saving()">Place order</button>
> ```
> Backend: an **idempotency key** so the same request twice creates one order.

> [!question]- Q44. The same data is needed in 5 unrelated components
> **In simple words:** fetch once, share everywhere.
>
> ```ts
> @Injectable({ providedIn: 'root' })
> export class ProfileService {
>   private http = inject(HttpClient);
>   profile$ = this.http.get<Profile>('/api/profile').pipe(shareReplay(1));  // 1 HTTP call, shared
>   profile = toSignal(this.profile$);
> }
> ```
> Bigger, shared, frequently-changing state → an **NgRx feature** with selectors.

> [!question]- Q45. A page loads slowly on first visit. What do you check?
> 1. **Bundle size**: `ng build --stats-json` + analyser; remove heavy libraries
> 2. **Lazy-load** feature routes; `@defer` heavy widgets
> 3. **API waterfall**: parallelise with `forkJoin`; cache with `shareReplay`
> 4. **Images**: `NgOptimizedImage`, correct sizes
> 5. **SSR** if first paint / SEO matters
>
> 💡 **Hack:** **"Ship less, load later, fetch in parallel."**
