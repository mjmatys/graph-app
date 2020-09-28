
//accepts twodimensional array adn start node, returns dfs traversal
export default function dfs_inorder(nodelist,s){
    let inorder = [[s,null]];
    let visited = new Array(nodelist.length).fill(0);
    // console.log('nodelist: ',nodelist);
    // console.log('visited: ',visited)
    const dfs = (u, p) =>{
        visited[u]=1;
        nodelist[u].adj.forEach( (v) =>{
            if(nodelist[v]){
                if(!visited[v]){
                    inorder.push([v,1]); //not visited, green highlight; visit
                    dfs(v,u);
                }
                else{
                    inorder.push([v,0]) //visited, red highlight; proceed
                }
            }
        })
        inorder.push([p,-1]); //red highlight; backtrack
    }
    dfs(parseInt(s), null);
    return inorder;
}