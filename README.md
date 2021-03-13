# Easy-Exact-TSP
Simple exact TSP solver, 0 heurestics/branch-and-bounding. Uses the dynamic programming approach described here: https://www.ics.uci.edu/~eppstein/163/lecture5c.pdf

## Example

```
const points = [
  [0, 0],
  [2, -1],
  [2, 1],
  [1, 1],
];

const tour = DynamicExactTSPSolver(points);
```

This tour would return `[3, 0, 1, 2]`. The tour will always start at the final node, and omit the repeated step. This solution will be the exact solution to the problem.

Running this solver with a list of points over 20 is significantly slow, and for more than 25 points is not recommended.
