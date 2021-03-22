const TopDownDynamicSolver = (() => {
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

	let Dskips = 0;
	let lowerboundSkips = 0;
	function getL(A, v) {
		if (L[A] && L[A][v]) {
			return L[A][v];
		}

		if (!L[A]) {
			L[A] = [];
		}

		// So... one thing we can look at is that A can only recurse through trees that contain the vertexes in A.
		// So, before recursing down an A, check if the lowerbound is above a current min.

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


		let i = 0;
		for (const u of subspan) {
			if (u == v) {
				continue
			} else {
				// So this is a cheeky little heuristic... Only try the first two.

				// Performance is WAY better if you include || i++ > 2
				// Though honestly, still exponential.
				// Just skipping by D results in a < 1% cull.
				// And it's still slower because recursion << iterative
				if (D(u, v) > currentMin || i++ > 2) {
					// Don't bother recursing
					Dskips = 0;
					break;
				}

				// Alternatively... If the lowerbound of some child tree is above the current min, don't bother recursing.
				const childA = A - Math.pow(2, v);

				if (currentMin < getLowerboundFromInt(childA)) {
					lowerboundSkips++;
					continue;
				}

				// Else, it's worth testing.
				// for u in {A - v}
				currentMin = Math.min(
					currentMin,
					getL(childA, u) + D(u, v));
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

	function getLowerboundFromInt(A) {
		const vertexes = getVertexesFromInt(A);

		if (vertexes.length <= 1) {
			return 0;
		}

		if (vertexes.length == 2) {
			// There's only two vertexes. Return their distance
			return D(vertexes[0], vertexes[1]);
		}

		let sum = 0;
		for (const v in vertexes) {
			let firstMin = Infinity, secMin = Infinity;
			for (const u in vertexes) {
				if (u == v) {
					continue;
				} else {
					if (D(u, v) < firstMin) {
						secMin = firstMin;
						firstMin = D(u, v);
					} else if (D(u, v) < secMin) {
						secMin = D(u, v);
					}
				}
			}
			sum += firstMin + secMin;
		}

		return sum * 0.5;
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
		timesCalled = 0;
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

		console.log("Top down times called:", timesCalled);

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
	console.log("D skips:", Dskips);
	console.log("Lowerbound skips:", lowerboundSkips);

	return TopDownDynamicSolver;
})();