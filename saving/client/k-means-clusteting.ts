
export function kMeansOver<T>(dataOf: (item: T) => number[]) {

    return function kMeans(
        items: T[],
        k: number,
        maxIterations: number
    ) {
        const numPoints = items.length;
        const numFeatures = dataOf(items[0]).length;

        type Centroid = number[];
        type Cluster = T[];

        // Initialize centroids randomly
        function initializeCentroids(): Centroid[] {
            const centroids: Centroid[] = [];
            const usedIndices = new Set();
            while (centroids.length < k) {
                const index = Math.floor(Math.random() * numPoints);
                if (usedIndices.has(index)) continue;
                usedIndices.add(index);
                const item = items[index];
                centroids.push(dataOf(item));
            }
            return centroids;
        }

        // Calculate Euclidean distance between two vectors
        function euclideanDistance(a: number[], b: number[]) {
            let sum = 0;
            for (let i = 0; i < numFeatures; i++) {
                sum += (a[i] - b[i]) ** 2;
            }
            return Math.sqrt(sum);
        }

        // Assign points to the nearest centroid
        function assignClusters(centroids: Centroid[]): Cluster[] {
            const clusters: Cluster[] = Array(k).fill([]);
            items.forEach(item => {
                let minDistance = Infinity;
                let closestCentroid = -1;
                centroids.forEach((centroid, index) => {
                    const distance = euclideanDistance(dataOf(item), centroid);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCentroid = index;
                    }
                });
                clusters[closestCentroid].push(item);
            });
            return clusters;
        }

        // Update centroids based on cluster means
        function updateCentroids(clusters: Cluster[]) {
            return clusters.map(cluster => {
                const newCentroid: Centroid = Array(numFeatures).fill(0);
                if (cluster.length === 0) return newCentroid; // Avoid division by zero
                cluster.forEach(item => {
                    const data = dataOf(item);
                    for (let i = 0; i < numFeatures; i++) {
                        newCentroid[i] += data[i];
                    }
                });
                for (let i = 0; i < numFeatures; i++) {
                    newCentroid[i] /= cluster.length;
                }
                return newCentroid;
            });
        }

        // Main K-means loop
        let centroids = initializeCentroids();
        let clusters: Cluster[] = [];
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            clusters = assignClusters(centroids);
            const newCentroids = updateCentroids(clusters);
            if (newCentroids.every((c, i) => euclideanDistance(c, centroids[i]) < 1e-6)) {
                break; // Convergence
            }
            centroids = newCentroids;
        }

        return { centroids, clusters };
    };
}
