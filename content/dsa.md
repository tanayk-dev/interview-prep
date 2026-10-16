---
title: DSA & Coding (in JavaScript)
short: DSA & Coding
description: The 5-step routine, pattern cheat-sheet, Big-O, and 32 easy–medium problems solved in JavaScript with the idea, a dry run and complexity.
order: 7
icon: 🧩
color: green
---

> [!tip] What Infosys asks
> Candidate reports show **easy to medium** problems (reverse a string, pyramid pattern, array manipulation, sorting, two sum) solved **live on screen-share, on paper or verbally**. They grade: **a working solution → explaining it → time / space complexity → edge cases.** On 17 Oct (in person) you may write on **paper or a whiteboard**: practise writing 4–5 of these by hand tonight.

## The routine & patterns

> [!question]- Q1. What's the 5-step routine to solve any coding question?
> **In simple words:** don't jump into code. Talk through these steps **out loud**; interviewers score your thinking.
>
> 1. **Repeat** the problem in your words + ask about edge cases (empty? negatives? duplicates? sorted?)
> 2. **Brute force first**, and say its Big-O
> 3. **Optimise** using a pattern (below)
> 4. **Code** cleanly with good names
> 5. **Dry-run** one example by hand + state time and space complexity
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   R["Repeat +<br/>edge cases"] --> B["Brute force<br/>+ Big-O"] --> O["Optimise<br/>pick a pattern"] --> C["Code"] --> D["Dry-run<br/>+ complexity"]
> ```
> 💡 **Hack:** **"R-B-O-C-D"**: *"Really Bad Ones Can Die."*

> [!question]- Q2. Which pattern do I use? (cheat-sheet)
> | If the problem says… | Think… | Usual time |
> |---|---|---|
> | find pair / duplicate / count / frequency | **HashMap / Set** | O(n) |
> | sorted array, pair sum, palindrome, reverse | **Two pointers** | O(n) |
> | longest / shortest sub-array or substring | **Sliding window** | O(n) |
> | sorted + find something | **Binary search** | O(log n) |
> | brackets, undo, "next greater" | **Stack** | O(n) |
> | levels, shortest path in a grid | **Queue / BFS** | O(n) |
> | tree, nested object, all combinations | **Recursion / DFS** | O(n) or exponential |
> | max / min sub-array sum | **Kadane's** | O(n) |
>
> 💡 **Hack:** **"Hash it, point it, slide it, halve it, stack it."** Try them in that order.

> [!question]- Q3. Big-O in plain words
> **In simple words:** Big-O = **how the work grows** when the input gets bigger.
>
> | Big-O | Name | Example | 1,000 items ≈ |
> |---|---|---|---|
> | O(1) | constant | `arr[5]`, `map.get(k)` | 1 step |
> | O(log n) | logarithmic | binary search | 10 steps |
> | O(n) | linear | one loop | 1,000 |
> | O(n log n) | | sorting | 10,000 |
> | O(n²) | quadratic | nested loops | 1,000,000 |
> | O(2ⁿ) | exponential | all subsets, naive Fibonacci | 😱 |
>
> **Space complexity** = extra memory you use (a new array of size n → O(n); two variables → O(1)).
>
> 💡 **Hack:** **every nested loop multiplies; every halving divides.**

## Strings

> [!question]- Q4. Reverse a string (3 ways) ⭐
> **Idea:** read from the end to the start. Interviewers often ask for the version **without built-ins**.
>
> ```js
> const r1 = s => s.split('').reverse().join('');          // built-ins
> const r2 = s => [...s].reduce((acc, ch) => ch + acc, ''); // reduce
> function r3(s) {                                          // plain loop ← know this one
>   let out = '';
>   for (let i = s.length - 1; i >= 0; i--) out += s[i];
>   return out;
> }
> r3('hello');   // "olleh"
> ```
> **Complexity:** O(n) time, O(n) space.

> [!question]- Q5. Check if a string is a palindrome
> **Idea:** two pointers, one at each end, walking **inward**. If any pair differs → not a palindrome.
>
> ```js
> function isPalindrome(s) {
>   s = s.toLowerCase().replace(/[^a-z0-9]/g, '');   // ignore case, spaces, punctuation
>   let l = 0, r = s.length - 1;
>   while (l < r) {
>     if (s[l] !== s[r]) return false;
>     l++; r--;
>   }
>   return true;
> }
> isPalindrome('Madam, I\'m Adam');   // true
> ```
> **Dry run** `"racecar"`: r↔r ✓, a↔a ✓, c↔c ✓, middle `e` → true.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   L["l →"] --- A["r a c e c a r"] --- R["← r"]
> ```
> **Complexity:** O(n) time, O(1) extra space.

> [!question]- Q6. Check if two strings are anagrams
> **Idea:** anagrams use the **same letters the same number of times**. Count letters of the first, subtract with the second.
>
> ```js
> function isAnagram(a, b) {
>   if (a.length !== b.length) return false;
>   const count = {};
>   for (const ch of a) count[ch] = (count[ch] || 0) + 1;
>   for (const ch of b) {
>     if (!count[ch]) return false;   // letter missing or used up
>     count[ch]--;
>   }
>   return true;
> }
> isAnagram('listen', 'silent');   // true
> ```
> **Complexity:** O(n). Shortcut: sort both and compare → O(n log n).

> [!question]- Q7. First non-repeating character
> **Idea:** **two passes**: count every character, then return the first with count 1.
>
> ```js
> function firstUnique(s) {
>   const freq = new Map();
>   for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);
>   for (const ch of s) if (freq.get(ch) === 1) return ch;
>   return null;
> }
> firstUnique('aabbcdd');   // "c"
> ```
> **Complexity:** O(n) time, O(k) space (k = distinct characters).

> [!question]- Q8. Character frequency / most frequent character / count vowels
> ```js
> function mostFrequent(s) {
>   const freq = {};
>   let best = '', max = 0;
>   for (const ch of s) {
>     freq[ch] = (freq[ch] || 0) + 1;
>     if (freq[ch] > max) { max = freq[ch]; best = ch; }
>   }
>   return { best, max };
> }
> mostFrequent('javascript');          // { best: 'a', max: 2 }
>
> const countVowels = s => (s.match(/[aeiou]/gi) || []).length;
> countVowels('Infosys');              // 2
> ```

> [!question]- Q9. Reverse the words in a sentence; capitalise each word
> ```js
> const reverseWords = s => s.trim().split(/\s+/).reverse().join(' ');
> reverseWords('  I love  Angular ');     // "Angular love I"
>
> const titleCase = s => s.split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join(' ');
> titleCase('hello infosys world');       // "Hello Infosys World"
>
> // reverse each word but keep the order
> const reverseEach = s => s.split(' ').map(w => [...w].reverse().join('')).join(' ');
> reverseEach('hello world');             // "olleh dlrow"
> ```

> [!question]- Q10. Longest substring without repeating characters (sliding window)
> **Idea:** keep a **window** `[start … i]` with no repeats. When you see a character already inside the window, **move `start`** just past its last position.
>
> ```js
> function longestUnique(s) {
>   const lastSeen = new Map();
>   let start = 0, best = 0;
>   for (let i = 0; i < s.length; i++) {
>     if (lastSeen.has(s[i]) && lastSeen.get(s[i]) >= start) start = lastSeen.get(s[i]) + 1;
>     lastSeen.set(s[i], i);
>     best = Math.max(best, i - start + 1);
>   }
>   return best;
> }
> longestUnique('abcabcbb');   // 3 ("abc")
> ```
> **Dry run:** a b c → window "abc" (3); next `a` repeats → start moves to 1 → "bca"… best stays 3.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   W1["[a b c] a b c b b<br/>len 3"] --> W2["a [b c a] b c b b<br/>len 3"] --> W3["a b [c a b] c b b<br/>len 3"]
> ```
> **Complexity:** O(n) time.

> [!question]- Q11. Valid parentheses (stack) ⭐
> **Idea:** the **last** bracket opened must be the **first** closed → that's a **stack** (LIFO).
>
> ```js
> function isValid(s) {
>   const pairs = { ')': '(', ']': '[', '}': '{' };
>   const stack = [];
>   for (const ch of s) {
>     if ('([{'.includes(ch)) stack.push(ch);
>     else if (stack.pop() !== pairs[ch]) return false;
>   }
>   return stack.length === 0;
> }
> isValid('{[()]}');   // true
> isValid('([)]');     // false
> ```
> **Diagram:**
> ```mermaid
> flowchart LR
>   S1["push {"] --> S2["push ["] --> S3["push ("] --> S4[") pops ( ✓"] --> S5["] pops [ ✓"] --> S6["} pops { ✓"] --> E["empty → valid"]
> ```
> **Complexity:** O(n) time, O(n) space.

> [!question]- Q12. Count words / remove duplicate characters / compress a string
> ```js
> const wordCount = s => s.trim().split(/\s+/).reduce((m, w) => (m[w] = (m[w] || 0) + 1, m), {});
> wordCount('to be or not to be');       // { to: 2, be: 2, or: 1, not: 1 }
>
> const removeDupChars = s => [...new Set(s)].join('');
> removeDupChars('programming');         // "progamin"
>
> function compress(s) {                 // "aaabbc" → "a3b2c1"
>   let out = '';
>   for (let i = 0, count = 1; i < s.length; i++, count++) {
>     if (s[i] !== s[i + 1]) { out += s[i] + count; count = 0; }
>   }
>   return out;
> }
> ```

## Arrays

> [!question]- Q13. Two Sum ⭐
> **Idea:** for each number, the **partner** you need is `target − num`. Instead of searching for it (O(n²)), **remember every number you've seen** in a Map.
>
> ```js
> function twoSum(nums, target) {
>   const seen = new Map();                  // value → index
>   for (let i = 0; i < nums.length; i++) {
>     const need = target - nums[i];
>     if (seen.has(need)) return [seen.get(need), i];
>     seen.set(nums[i], i);
>   }
>   return [];
> }
> twoSum([2, 7, 11, 15], 9);   // [0, 1]
> ```
> **Dry run:** i=0, need 7, not seen → store 2. i=1, need 2 → **seen at 0** → `[0, 1]`.
>
> **Complexity:** brute force O(n²) → HashMap **O(n)** time, O(n) space.
>
> 💡 **Hack:** *"Don't search for your partner; remember everyone you've met."*

> [!question]- Q14. Remove duplicates from an array
> ```js
> const dedupe = arr => [...new Set(arr)];                          // O(n)
> const dedupe2 = arr => arr.filter((x, i) => arr.indexOf(x) === i); // O(n²), no Set
>
> // sorted array, in place (two pointers) → returns the new length
> function removeDupSorted(a) {
>   let k = 0;
>   for (let i = 1; i < a.length; i++) if (a[i] !== a[k]) a[++k] = a[i];
>   return k + 1;
> }
> ```

> [!question]- Q15. Find the second largest number (single pass) ⭐
> **Idea:** don't sort (O(n log n)). Keep **two variables**, `first` and `second`, and update them in one loop.
>
> ```js
> function secondLargest(arr) {
>   let first = -Infinity, second = -Infinity;
>   for (const n of arr) {
>     if (n > first) { second = first; first = n; }
>     else if (n > second && n !== first) second = n;
>   }
>   return second === -Infinity ? null : second;
> }
> secondLargest([10, 5, 20, 20, 8]);   // 10
> ```
> **Dry run:** 10 → f=10 · 5 → s=5 · 20 → f=20, s=10 · 20 → equal, skip · 8 → no change → **10**.
>
> **Complexity:** O(n) time, O(1) space.

> [!question]- Q16. Sort an array without .sort() (bubble sort) ⭐
> **Idea:** compare **neighbours** and swap if they're in the wrong order. After each pass, the **biggest** remaining number has "bubbled" to the end.
>
> ```js
> function bubbleSort(a) {
>   for (let i = 0; i < a.length; i++) {
>     let swapped = false;
>     for (let j = 0; j < a.length - i - 1; j++) {
>       if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; }
>     }
>     if (!swapped) break;           // already sorted → stop early
>   }
>   return a;
> }
> ```
> **Dry run** `[5, 1, 4, 2]`: pass 1 → `[1, 4, 2, 5]`; pass 2 → `[1, 2, 4, 5]`; pass 3 → no swaps → stop.
>
> **Complexity:** O(n²); O(n) if already sorted. `Array.prototype.sort` in V8 uses **TimSort**, O(n log n).

> [!question]- Q17. Merge sort and quick sort (explain the idea)
> **In simple words:** **merge sort** = split in half until single items, then **merge sorted halves** (always O(n log n), extra memory). **Quick sort** = pick a **pivot**, put smaller items left and bigger right, repeat on each side (O(n log n) average, O(n²) worst).
>
> ```js
> function mergeSort(a) {
>   if (a.length <= 1) return a;
>   const mid = a.length >> 1;
>   return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));
> }
> function merge(x, y) {
>   const out = []; let i = 0, j = 0;
>   while (i < x.length && j < y.length) out.push(x[i] <= y[j] ? x[i++] : y[j++]);
>   return out.concat(x.slice(i), y.slice(j));
> }
> ```
>
> **Diagram:**
> ```mermaid
> flowchart TD
>   A["[5, 2, 4, 1]"] --> B["[5, 2]"]
>   A --> C["[4, 1]"]
>   B --> B1["[5]"]
>   B --> B2["[2]"]
>   C --> C1["[4]"]
>   C --> C2["[1]"]
>   B1 --> M1["merge → [2, 5]"]
>   B2 --> M1
>   C1 --> M2["merge → [1, 4]"]
>   C2 --> M2
>   M1 --> F["merge → [1, 2, 4, 5]"]
>   M2 --> F
> ```
> 💡 **Hack:** **merge sort = divide the class into pairs, then merge sorted lines.**

> [!question]- Q18. Move all zeros to the end (keep order)
> **Idea:** a `k` pointer marks where the next non-zero goes; fill the rest with zeros.
>
> ```js
> function moveZeros(a) {
>   let k = 0;
>   for (const n of a) if (n !== 0) a[k++] = n;
>   while (k < a.length) a[k++] = 0;
>   return a;
> }
> moveZeros([0, 1, 0, 3, 12]);   // [1, 3, 12, 0, 0]
> ```
> **Complexity:** O(n) time, O(1) space.

> [!question]- Q19. Rotate an array by k
> ```js
> const rotateRight = (a, k) => { k %= a.length; return [...a.slice(-k), ...a.slice(0, -k)]; };
> rotateRight([1, 2, 3, 4, 5], 2);   // [4, 5, 1, 2, 3]
> ```
> **Edge case:** `k > length` → use `k % n`; `k = 0` → `slice(-0)` returns the whole array, so guard it: `if (!k) return [...a]`. **In-place trick:** reverse all → reverse first k → reverse the rest.

> [!question]- Q20. Maximum sub-array sum (Kadane's algorithm)
> **Idea:** walk the array keeping the **best sum ending here**. If the running sum becomes worse than starting fresh, **start fresh**.
>
> ```js
> function maxSubArray(a) {
>   let current = a[0], best = a[0];
>   for (let i = 1; i < a.length; i++) {
>     current = Math.max(a[i], current + a[i]);   // extend or restart
>     best = Math.max(best, current);
>   }
>   return best;
> }
> maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);   // 6 → [4, -1, 2, 1]
> ```
> **Complexity:** O(n).
>
> 💡 **Hack:** **"If the past is dragging you down, start fresh."**

> [!question]- Q21. Find the missing number in 1…n
> **Idea:** the sum of 1…n is `n(n+1)/2`. **Expected sum − actual sum** = the missing number.
>
> ```js
> const missing = (a, n) => n * (n + 1) / 2 - a.reduce((s, x) => s + x, 0);
> missing([1, 2, 4, 5], 5);   // 3
> ```
> **Complexity:** O(n) time, O(1) space.

> [!question]- Q22. Merge two sorted arrays
> **Idea:** two pointers; always take the **smaller** front item.
>
> ```js
> function mergeSorted(a, b) {
>   const out = []; let i = 0, j = 0;
>   while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
>   return out.concat(a.slice(i), b.slice(j));
> }
> mergeSorted([1, 4, 7], [2, 3, 9]);   // [1, 2, 3, 4, 7, 9]
> ```
> **Complexity:** O(n + m).

> [!question]- Q23. Intersection, union and duplicates of arrays
> ```js
> const intersect = (a, b) => { const s = new Set(b); return [...new Set(a.filter(x => s.has(x)))]; };
> const union = (a, b) => [...new Set([...a, ...b])];
> const duplicates = a => {
>   const seen = new Set(), dup = new Set();
>   for (const x of a) seen.has(x) ? dup.add(x) : seen.add(x);
>   return [...dup];
> };
> intersect([1, 2, 2, 3], [2, 3, 4]);   // [2, 3]
> duplicates([1, 2, 2, 3, 3, 3]);      // [2, 3]
> ```

> [!question]- Q24. Binary search
> **Idea:** only on **sorted** data. Look at the middle: too small → search the right half; too big → the left half. Each step **halves** the work.
>
> ```js
> function binarySearch(a, target) {
>   let lo = 0, hi = a.length - 1;
>   while (lo <= hi) {
>     const mid = Math.floor((lo + hi) / 2);
>     if (a[mid] === target) return mid;
>     if (a[mid] < target) lo = mid + 1;
>     else hi = mid - 1;
>   }
>   return -1;
> }
> binarySearch([1, 3, 5, 7, 9, 11], 9);   // 4
> ```
> **Dry run:** mid=2 (5) < 9 → lo=3 · mid=4 (9) → found.
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   A["[1 3 5 7 9 11]<br/>mid = 5 → go right"] --> B["[7 9 11]<br/>mid = 9 → found ✅"]
> ```
> **Complexity:** O(log n): 1,000,000 items in ~20 steps.
>
> 💡 **Hack:** the **"guess the number" game**: always guess the middle.

> [!question]- Q25. Group by a key / count occurrences ⭐
> ```js
> const groupBy = (arr, key) => arr.reduce((g, x) => ((g[x[key]] ??= []).push(x), g), {});
> groupBy([{ dept: 'FE', n: 'A' }, { dept: 'BE', n: 'B' }, { dept: 'FE', n: 'C' }], 'dept');
> // { FE: [A, C], BE: [B] }
>
> const countBy = arr => arr.reduce((m, x) => (m[x] = (m[x] || 0) + 1, m), {});
> countBy(['a', 'b', 'a']);   // { a: 2, b: 1 }
>
> // modern built-in
> Object.groupBy(users, u => u.dept);
> ```

> [!question]- Q26. Flatten a nested array and a nested object
> **Idea:** **recursion**: if an item is itself an array / object, flatten it too.
>
> ```js
> const flatten = arr => arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), []);
> flatten([1, [2, [3, [4]]]]);              // [1, 2, 3, 4]   (built-in: arr.flat(Infinity))
>
> function flattenObj(obj, prefix = '', out = {}) {
>   for (const [k, v] of Object.entries(obj)) {
>     const key = prefix ? `${prefix}.${k}` : k;
>     if (v && typeof v === 'object' && !Array.isArray(v)) flattenObj(v, key, out);
>     else out[key] = v;
>   }
>   return out;
> }
> flattenObj({ a: { b: { c: 1 } }, d: 2 }); // { 'a.b.c': 1, d: 2 }
> ```

## Numbers & patterns

> [!question]- Q27. Print a pyramid and other star patterns ⭐
> **Idea:** row `i` (1-based) of an n-row pyramid has **(n − i) spaces** then **(2i − 1) stars**.
>
> ```js
> function pyramid(n) {
>   for (let i = 1; i <= n; i++) console.log(' '.repeat(n - i) + '*'.repeat(2 * i - 1));
> }
> pyramid(3);
> //   *
> //  ***
> // *****
>
> for (let i = 1; i <= 3; i++) console.log('*'.repeat(i));          // right triangle
> for (let i = 3; i >= 1; i--) console.log('*'.repeat(i));          // inverted
> for (let i = 1; i <= 3; i++) console.log([...Array(i)].map((_, j) => j + 1).join(' '));   // 1 / 1 2 / 1 2 3
> ```
> 💡 **Hack:** draw a 3-row example, **count spaces and stars per row**, then find the formula.

> [!question]- Q28. FizzBuzz, prime check, factorial, Fibonacci
> ```js
> for (let i = 1; i <= 15; i++)
>   console.log(i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : i);
>
> function isPrime(n) {
>   if (n < 2) return false;
>   for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;   // only up to √n
>   return true;
> }
>
> const factorial = n => (n <= 1 ? 1 : n * factorial(n - 1));
>
> function fib(n) {                    // iterative O(n), not the O(2ⁿ) recursion
>   let a = 0, b = 1;
>   for (let i = 0; i < n; i++) [a, b] = [b, a + b];
>   return a;
> }
> ```
> **Why only up to √n?** If `n = a × b`, one of them is ≤ √n, so you'd already have found it.
>
> **Diagram (why naive recursive Fibonacci is slow):**
> ```mermaid
> flowchart TD
>   F5["fib(5)"] --> F4["fib(4)"]
>   F5 --> F3a["fib(3)"]
>   F4 --> F3b["fib(3) again"]
>   F4 --> F2a["fib(2)"]
>   F3a --> F2b["fib(2) again"]
>   F3a --> F1a["fib(1)"]
> ```
> 💡 Say: *"Naive recursion repeats work: O(2ⁿ). I'd use a loop or memoization: O(n)."*

> [!question]- Q29. Reverse a number, sum of digits, palindrome number, Armstrong number
> ```js
> const reverseNum = n => Math.sign(n) * Number(String(Math.abs(n)).split('').reverse().join(''));
> reverseNum(-123);                   // -321
>
> const sumDigits = n => String(Math.abs(n)).split('').reduce((s, d) => s + Number(d), 0);
> sumDigits(1234);                    // 10
>
> const isPalNum = n => String(n) === String(n).split('').reverse().join('');
>
> const isArmstrong = n => {          // 153 = 1³ + 5³ + 3³
>   const d = String(n);
>   return [...d].reduce((s, x) => s + Number(x) ** d.length, 0) === n;
> };
>
> // without strings (they sometimes ask)
> function reverseMath(n) { let r = 0; while (n > 0) { r = r * 10 + (n % 10); n = Math.floor(n / 10); } return r; }
> ```

> [!question]- Q30. Swap two numbers without a temp variable
> ```js
> let a = 5, b = 9;
> [a, b] = [b, a];                    // modern: destructuring
> a = a + b; b = a - b; a = a - b;    // classic arithmetic
> ```

## Data structures

> [!question]- Q31. Array vs linked list; stack vs queue; hash map; tree vs graph
> **In simple words:**
> - **Array** → items side by side; **O(1)** to read `a[5]`, **O(n)** to insert in the middle
> - **Linked list** → each node points to the next; **O(1)** insert/delete at a known node, **O(n)** to find
> - **Stack (LIFO)** → last in, first out: undo, browser back, call stack, brackets
> - **Queue (FIFO)** → first in, first out: task queues, BFS, the event loop's task queue
> - **Hash map** → key → value, average **O(1)** get / set (JS `Map`)
> - **Tree** → hierarchy, no cycles (DOM, folders, org chart). **BST**: left < node < right → O(log n) search when balanced
> - **Graph** → nodes + edges, may have cycles (maps, social networks)
>
> **Diagram:**
> ```mermaid
> flowchart LR
>   subgraph LinkedList
>     N1["10"] --> N2["20"] --> N3["30"] --> NULL["null"]
>   end
>   subgraph Stack["Stack (LIFO)"]
>     direction TB
>     T["top: 3"] --- M["2"] --- Bm["1"]
>   end
> ```
> 💡 **Hack:** **stack = a pile of plates; queue = the ticket line.** The DOM is a tree, so walking the DOM = tree traversal.

> [!question]- Q32. Reverse a linked list
> **Idea:** walk the list and **flip each arrow** to point backwards. Keep three pointers: `prev`, `curr`, `next`.
>
> ```js
> class Node { constructor(val, next = null) { this.val = val; this.next = next; } }
>
> function reverseList(head) {
>   let prev = null, curr = head;
>   while (curr) {
>     const next = curr.next;   // 1. remember the rest
>     curr.next = prev;         // 2. flip the arrow
>     prev = curr;              // 3. move prev forward
>     curr = next;              // 4. move curr forward
>   }
>   return prev;                // new head
> }
> ```
> **Diagram:**
> ```mermaid
> flowchart LR
>   subgraph Before
>     A1["1"] --> B1["2"] --> C1["3"] --> X1["null"]
>   end
>   subgraph After
>     C2["3"] --> B2["2"] --> A2["1"] --> X2["null"]
>   end
> ```
> **Complexity:** O(n) time, O(1) space.

> [!question]- Q33. Implement a stack and a queue in JavaScript
> ```js
> class Stack {
>   #items = [];
>   push(x) { this.#items.push(x); }
>   pop() { return this.#items.pop(); }
>   peek() { return this.#items.at(-1); }
>   get size() { return this.#items.length; }
> }
>
> class Queue {                          // O(1) dequeue using a head index (array.shift() is O(n))
>   #items = []; #head = 0;
>   enqueue(x) { this.#items.push(x); }
>   dequeue() { return this.#head < this.#items.length ? this.#items[this.#head++] : undefined; }
>   get size() { return this.#items.length - this.#head; }
> }
> ```
> 💡 Mention: *"`shift()` is O(n) because it re-indexes, so for a busy queue I track a head index."* That shows depth.

> [!question]- Q34. Tree traversal: DFS and BFS
> **Idea:** **DFS** goes **deep first** (recursion / stack); **BFS** goes **level by level** (queue).
>
> ```js
> const tree = { val: 1, children: [
>   { val: 2, children: [{ val: 4, children: [] }] },
>   { val: 3, children: [] } ] };
>
> function dfs(node, out = []) {           // 1, 2, 4, 3
>   out.push(node.val);
>   node.children.forEach(c => dfs(c, out));
>   return out;
> }
> function bfs(root) {                     // 1, 2, 3, 4
>   const out = [], queue = [root];
>   while (queue.length) {
>     const node = queue.shift();
>     out.push(node.val);
>     queue.push(...node.children);
>   }
>   return out;
> }
> ```
> **Diagram:**
> ```mermaid
> flowchart TD
>   A["1"] --> B["2"]
>   A --> C["3"]
>   B --> D["4"]
> ```
> 💡 **Hack:** **DFS = explore one cave fully before the next; BFS = ripples in water.**
