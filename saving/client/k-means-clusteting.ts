
export function kMeansOver<T>(dataOf: (item: T) => number[]) {
    type Centroid = number[];
    type Cluster = T[];

    function kMeans(
        items: T[],
        centroids: Centroid[],
        maxIterations: number
    ) {
        if (items.length < 2) return null;
        const numFeatures = dataOf(items[0]).length;

        // Assign points to the nearest centroid
        function assignClusters(centroids: Centroid[]): Cluster[] {
            const clusters: Cluster[] = Array.from({ length: centroids.length }, () => []);
            for (const item of items) {

                let minDistance = Infinity;
                let closestCentroid = -1;
                const data = dataOf(item);
                for (let index = 0; index < centroids.length; index++) {
                    const centroid = centroids[index];
                    const distance = euclideanDistance(data, centroid);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCentroid = index;
                    }
                }
                clusters[closestCentroid].push(item);
            }
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

    // Calculate Euclidean distance between two vectors
    function euclideanDistance(a: number[], b: number[]) {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += (a[i] - b[i]) ** 2;
        }
        return Math.sqrt(sum);
    }

    function kMeansFixed(items: T[], centroids: Centroid[]) {

        if (items.length < 2) return null;

        // Assign points to the nearest centroid
        function assignClusters(centroids: Centroid[]): Cluster[] {
            const clusters: Cluster[] = Array.from({ length: centroids.length }, () => []);
            for (const item of items) {

                let minDistance = Infinity;
                let closestCentroid = -1;
                const data = dataOf(item);
                for (let index = 0; index < centroids.length; index++) {
                    const centroid = centroids[index];
                    const distance = euclideanDistance(data, centroid);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCentroid = index;
                    }
                }
                clusters[closestCentroid].push(item);
            }
            return clusters;
        }

        // Assign points to fixed centroids for maxIterations times (or until convergence)
        let clusters = assignClusters(centroids);

        return { clusters };
    }

    return {kMeans, kMeansFixed}
}
