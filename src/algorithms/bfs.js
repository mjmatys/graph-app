export default function bfs(s,nodelist){
    let inorder = [[s,null,null]];
    let q = [s];
    let vis = new Array(nodelist.length).fill(0);
    for(let i=0;i<q.length;i++){
        // console.log('DUPA');
        const u = q[i];
        nodelist[u].adj.forEach( v => {
            if(!vis[v]){
                vis[v]=1;
                inorder.push([u,v,1]);
                q.push(v);
            }
            else inorder.push([u,v,0])
        })
    }
    inorder.push([null,null,null]);
    return inorder;
}