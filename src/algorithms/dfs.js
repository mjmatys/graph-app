
//accepts twodimensional array adn start node, returns dfs traversal
export default function dfs_inorder(nodelist,s){
    let inorder = [[s,null]];
    let visited = new Array(nodelist.length).fill(0);
    // console.log('nodelist: ',nodelist);
    // console.log('visited: ',visited)
    const dfs = (u, p) =>{
        visited[u]=1;
        // console.log('u: ',u)
        nodelist[u].adj.forEach( (v) =>{
            // const v=node.id;
            // console.log('v: ',v,' nodelist[v]', nodelist[v]);
            if(nodelist[v]){
                if(!visited[v]){
                    // console.log(u,'--',v,'not visited');
                    inorder.push([v,1]); //not visited, green highlight; visit
                    dfs(v,u);
                }
                else{
                    // console.log(u,'--',v,'visited');
                    inorder.push([v,0]) //visited, red highlight; proceed
                }
            }
        })
        inorder.push([p,-1]); //red highlight; backtrack
    }
    dfs(parseInt(s), null);
    return inorder;
}