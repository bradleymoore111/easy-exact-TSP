let dmatrix = [];

function setAdjacency(points) {
	dmatrix = [];

	const n = points.length

	for (let i=0; i<n; i++) {
		dmatrix[i] = [];
		for (let j=0; j<n; j++) {
			dmatrix[i][j] = Infinity
		}
	}

	for (let i=0; i<n; i++) {
		dmatrix[i][i] = 0;
		for (let j=i+1; j<n; j++) {
			dmatrix[i][j] = dmatrix[j][i] = 
				Math.pow(points[i][0] - points[j][0], 2) + 
				Math.pow(points[i][1] - points[j][1], 2)
		}
	}

	return dmatrix;
}

function edgeWeight(e) {
	return dmatrix[e[0]][e[1]];
}

function getVertexesFromInt(n) {
	// This is totally way more inefficient than it needs to be, and that's okay.
	const s = (n | 0).toString(2);

	// console.log(n, s);

	const points = [];
	for (let i=0; i<s.length; i++) {
		if (s[s.length - 1 - i] == '1') {
			points.push(i);
		}
	}

	return points;
}

let L = [];

function getL(A, v) {
	if (!L[A]) {
		L[A] = [];
	}

	return L[A][v];
}

function setL(A, v, D) {
	if (!L[A]) {
		L[A] = [];
	}

	// console.log("        Setting", A, v, D);

	L[A][v] = D;
}

function D(u, v) {
	return dmatrix[u][v];
}

function DynamicExactTSPSolver(points) {
	// O(n^2 2^n) solver.

	if (points.length == 0) {
		return []
	}

	if (points.length == 1) {
		return [0];
	}

	if (points.length > 40) {
		console.log("That's a really bad idea.");
		return [];
	}

	L = [];

	const n = points.length;

	dmatrix = setAdjacency(points);

	// console.log("n:", n);
	// console.log("dmatrix:", dmatrix);

	const max = Math.pow(2, n-1) - 1;
	for (let A=1; A<=max; A++) {
		const subspan = getVertexesFromInt(A);
		// console.log("A:", A, "- subspan:", subspan);
		for (const v of subspan) {
			// console.log("  v:", v);
			if (subspan.length == 1) {
				// Base case
				// console.log("    Base case, D:", D(n-1, v));
				setL(A, v, D(n-1, v));
				// console.log("    L:", L);
			} else {
				// Find min
				// console.log("    Other case");
				let currentMin = Infinity;
				for (const u of subspan) {
					if (u == v) {
						continue;
					} else {
						// console.log("      u:", u);
						// console.log("      getL(A - v, u):", A-v, u, getL(A-v, u));
						currentMin = Math.min(
							currentMin, 
							getL(A - Math.pow(2, v), u) + D(u, v));
					}
				}
				setL(A, v, currentMin);
			}
		}
	}

	let currentMin = Infinity;
	for (const v of getVertexesFromInt(max)) {
		// console.log("Possible, v:", v, getL(max, v) + D(v, n-1));
		currentMin = Math.min(
			currentMin,
			getL(max, v) + D(v, n-1));
	}

	// Backtrack and find what resulted in this min.
	const path = [n-1];
	let remainingPath = currentMin;
	let currA = max;

	let i = 0;
	while (currA > 0) {
		if (i++ > 100) {
			console.log("Fuck.", i);
			break;
		}
		// Find which next spot results in the min available.
		const v = path[path.length - 1];
		// console.log("Testing v:", v);
		// console.log("Remaining path:", remainingPath);
		for (const u of getVertexesFromInt(currA)) {
			// if (u == v) {
			// 	console.log("Skipping.");
			// 	continue;
			// }
			// console.log("  Testing u:", u);
			// Test if this v resulted in the remainingPath
			// console.log(
			// 	"    getL(currA - Math.pow(2, u), v):", "getL(" + currA + " - " + Math.pow(2, u) + ", " + u + "):",
			// 	getL(currA - Math.pow(2, u), u));
			// console.log("    D(u, v):", D(u, v));
			// So the goal is for u = 0, because getL(A, u) == remainingPath - D(u, v)
			if (getL(currA, u) == remainingPath - D(u, v)) {
				currA -= Math.pow(2, u);
				remainingPath -= D(u, v);
				path.push(u);
				break;
			} 
		}
	}

	return path;
}

// for (let i=0; i<16; i++) {
// 	console.log(i, getVertexesFromInt(i));
// }

let pp = [
	[0, 0],
	[2, -1],
	[2, 1],
	[1, 1]
];

DynamicExactTSPSolver(pp);