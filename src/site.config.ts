// The only file to touch when your next interview changes.
export const SITE = {
  title: 'Interview Prep',
  tagline: 'Full-stack Q&A bank: Angular · JavaScript · .NET · PostgreSQL · DSA',
  owner: 'Tanay',
  // Shown as a countdown on the home page. Set `date` to null to hide it.
  target: {
    company: 'Infosys',
    round: 'Final round, in person: Technical 2 → Managerial → HR (same day)',
    date: '2026-10-17T09:30:00+05:30' as string | null,
  },
};

// "Night before" checklist on the home page. `link` is a topic page (optionally with #question-id).
export const PLAN: { time: string; task: string; link?: string }[] = [
  { time: '20 min', task: 'Say "Tell me about yourself" and the project walkthrough out loud, 3 times', link: 'personal/' },
  { time: '30 min', task: 'Fix every 🔥 Round-1 gap below: CORS, virtual scroll, testing tools, SP performance', link: '#round-1-gaps' },
  { time: '40 min', task: 'JavaScript: event loop, closures, this, promises + the output drill', link: 'javascript/' },
  { time: '40 min', task: 'Angular: RxJS operators, change detection, NgRx flow, v16 → v20 features', link: 'angular/' },
  { time: '30 min', task: '.NET Core: middleware, DI lifetimes, EF Core, CORS + JWT, OData', link: 'dotnet/' },
  { time: '30 min', task: 'SQL: joins, indexes, EXPLAIN ANALYZE, window functions, 2nd highest salary', link: 'sql/' },
  { time: '30 min', task: 'DSA: hand-write two sum, reverse string, second largest, valid brackets', link: 'dsa/' },
  { time: '20 min', task: 'Managerial + HR: 4 STAR stories, why Infosys, notice period, relocation', link: 'hr-managerial/' },
];
