



const N = 10;
const p = 5 / N;
//Erdos-Renyi random graph generation
export function generateGraph() {
    let m = 0;
    let isIsolated = Array.from({ length: N }, (v, i) => true);
    let randomAdjList = '';
    for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++)
            if (Math.random() < p) {
                randomAdjList += i + ' ' + j + '\n';
                m++;
                isIsolated[i] = isIsolated[j] = false;
            }
    }
    for (let i = 0; i < N; i++)
        if (isIsolated[i])
            randomAdjList += i + '\n';

    console.log(N + ' ' + m + '\n' + randomAdjList);
    return N + ' ' + m + '\n' + randomAdjList;
}