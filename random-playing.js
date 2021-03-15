let n;
let matrix = [];

function setAdjacency(points) {
	matrix = [];

	const n = points.length

	for (let i=0; i<n; i++) {
		matrix[i] = [];
		for (let j=0; j<n; j++) {
			matrix[i][j] = Infinity
		}
	}

	for (let i=0; i<n; i++) {
		matrix[i][i] = 0;
		for (let j=i+1; j<n; j++) {
			matrix[i][j] = matrix[j][i] = 
				Math.pow(points[i][0] - points[j][0], 2) + 
				Math.pow(points[i][1] - points[j][1], 2)
		}
	}

	return matrix;
}

function getL(A, v) {
	if (L[A] && L[A][v]) {
		return L[A][v];
	}

	if (!L[A]) {
		L[A] = [];
	}

	// Time to set it up.
	// L[A][v] should equal 
	// min( L[A - v, u] + D[u, v] for u in A - v )
	// So we know that v is in A...

	let currentMin = Infinity;
	const subspan = getVertexesFromInt(A);

	if (subspan.length == 1) {
		// Base case
		setL(A, v, D(n-1, v));
		return L[A][v];
	}

	// Sort the subspans by distance from v
	subspan.sort((a, b) => {
		return D(v, a) - D(v, b);
	});

	for (const u of subspan) {
		if (u == v) {
			continue
		} else {
			if (D(u, v) > currentMin) {
				// Don't bother recursing
				break;
			}

			// Else, it's worth testing.
			// for u in {A - v}
			currentMin = Math.min(
				currentMin,
				getL(A - Math.pow(2, v), u) + D(u, v));
		}
	}

	setL(A, v, currentMin);
	return L[A][v];
}

function getVertexesFromInt(n) {
	// This is totally way more inefficient than it needs to be, and that's okay.
	const s = (n | 0).toString(2);

	const points = [];
	for (let i=0; i<s.length; i++) {
		if (s[s.length - 1 - i] == '1') {
			points.push(i);
		}
	}

	return points;
}

let timesCalled = 0;
function setL(A, v, D) {
	timesCalled++;
	if (!L[A]) {
		L[A] = [];
	}

	// console.log("        Setting", A, v, D);

	L[A][v] = D;
}

function D(u, v) {
	return matrix[u][v];
}

function TopDownDynamicSolver(points) {
	if (points.length == 0) {
		return [];
	}

	if (points.length == 1) {
		return [0];
	}

	L = [];

	n = points.length;

	matrix = setAdjacency(points);

	const max = Math.pow(2, n-1) - 1;
	let currentMin = Infinity;
	for (const v of getVertexesFromInt(max)) {
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
			console.log("Heck.", i);
			break;
		}
		// Find which next spot results in the min available.
		const v = path[path.length - 1];
		for (const u of getVertexesFromInt(currA)) {
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

const points = [
	[483, 169],
	[438, 270],
	[393, 384],
	[436, 529],
	[494, 642],
	[956, 660],
	[971, 543],
	[947, 412],
	[965, 299],
	[919, 148],
];

const tour = TopDownDynamicSolver(points);

console.log("Top down:", tour);
console.log("Times called:", timesCalled);