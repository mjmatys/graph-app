import { createNode } from '../components/Graph/Nodes.js'
// export default function RenderAdjList(value, nodelist,setNodenum,setEdgenum){
export default function RenderAdjList(adjList, nodelist) {
  console.log('RenderAdjList \tadjList: ', adjList);
  let newnodelist = [];
  const arr = adjList.split(/[\n]+/);
  let [n, e] = [0, 0];


  let adjMap = new Map();
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i] == 'undefined') continue;
    let pair = arr[i].split(/[ ]+/);
    if (pair[0] === '')
      pair.shift();
    let [u, v] = pair;
    [u, v] = [parseInt(u), parseInt(v)];
    //test whether isnan is a good validation for empty strings and others
    if (!assert(newnodelist, u, nodelist) || !assert(newnodelist, v, nodelist)) continue;
    e++;
    if (!adjMap.has(u)) adjMap.set(u, new Set());
    if (!adjMap.has(v)) adjMap.set(v, new Set());
    if (!adjMap.get(u).has(v)) {
      newnodelist[u].adj.push(v);
      adjMap.get(u).add(v);
    }
    if (!adjMap.get(v).has(u)) {
      newnodelist[v].adj.push(u);
      adjMap.get(v).add(u);
    }
  }


  newnodelist.forEach((node) => { if (node) n++; })

  console.log('newnodelist: ', newnodelist);

  return [newnodelist, n, e];
}

const assert = (newnodelist, u, nodelist) => {
  if (isNaN(u))
    return false;
  if (u >= newnodelist.length || newnodelist[u] == null) {
    // n.num++;
    let boardClicked = 0, x, y;
    if (u < nodelist.length && nodelist[u] != null)
      [x, y, boardClicked] = [nodelist[u].x, nodelist[u].y, nodelist[u].boardClicked];
    else
      [x, y] = GetRandCords();
    const node = createNode(x, y, u, u, boardClicked);
    while (u >= newnodelist.length) newnodelist.push(null);
    newnodelist[u] = node;
  }
  return true;
}

const GetRandCords = () => {
  const [mx, my] = [window.innerWidth, window.innerHeight]
  const x = Math.random() * 0.4 * mx + 0.3 * mx;
  const y = Math.random() * 0.4 * my + 0.3 * my;
  return [x, y];
}
