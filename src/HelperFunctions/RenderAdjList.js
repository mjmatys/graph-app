import {createNode} from '../components/Graph/Nodes.js'
// export default function RenderAdjList(value, nodelist,setNodenum,setEdgenum){
export default function RenderAdjList(value, nodelist){
  // console.log('in: ',nodelist,'adj: ',value);
    let newnodelist = [];
    const arr = value.split(/[\n]+/);
    let [n,e] = [0,0];
    // let n = {num: 0},e=0;

    for(let i=1;i<arr.length;i++){
      if(typeof arr[i] == 'undefined') continue;
      let pair = arr[i].split(/[ ]+/);
      if(pair[0]==='')
        pair.shift();
      let [u,v] = pair;
      [u,v] = [parseInt(u),parseInt(v)];
      //test whether isnan is a good validation for empty strings and others
        if(!assert(newnodelist,u,nodelist,n) || !assert(newnodelist,v,nodelist,n)) continue;
      e++;
      newnodelist[u].adj.push(v);
      newnodelist[v].adj.push(u);
    }

    // console.log('out: ',nodelist);
    nodelist.forEach((node,id) => {
      if(node){
        if(node.boardClicked && newnodelist[id]==null){
          newnodelist[id] = nodelist[id];
          newnodelist[id].adj = [];
        }
        console.log('id: ',id);
      } 
    });
    newnodelist.forEach( (node) => {if(node) n++;})
    console.log('newnodelist: ',newnodelist);
    return [newnodelist,n,e];
}

const assert = (newnodelist, u, nodelist,n) => {
  if(isNaN(u))
    return false;
  if(u>=newnodelist.length || newnodelist[u]==null){
    // n.num++;
    let boardClicked=0,x,y;
    if(u<nodelist.length && nodelist[u]!=null)
      [x,y, boardClicked] = [nodelist[u].x,nodelist[u].y, nodelist[u].boardClicked];
    else
      [x,y] = GetRandCords();
    const node = createNode(x,y,u,u,boardClicked);
    while(u>=newnodelist.length) newnodelist.push(null);
    newnodelist[u] = node;
  }
  return true;
}

const GetRandCords = () => {
    const [mx,my] = [window.innerWidth,window.innerHeight]
    const x = Math.random()*0.3*mx+0.4*mx;
    const y = Math.random()*0.3*my+0.4*my;
    return [x,y];
  }
  