
class Node{
    constructor(id, fields){
        this.id = id
        this.fields={}
        if(fields instanceof Array){
            for(let i=0; i<fields.length; i++){
                this.fields[fields[i]]=null
            }
        }
        else if(fields!==null && typeof fields==='object'){
            this.fields=fields
        }
    }

    setID(id){
        this.id=id
    }

    getID(){
        return this.id
    }

    addField(key, value){
        if(!(key in this.fields)){
            this.fields[key]=null
            if(value!==undefined){
                this.fields[key]=value
            }
        }
    }

    setField(key, value){
        if (key in this.fields){
            this.fields[key]=value
        }
    }

    removeField(key){
        if (key in this.fields){
            delete this.fields[key]
        }
    }

    clearFields(){
        this.fields={}
    }

    getValue(key){
        return this.fields[key]
    }

    getFields(){
        return this.fields
    }
}

class Edge{
    constructor(n1, n2, is_directed, fields){
        this.node1 = n1
        this.node2 = n2
        this.is_directed = is_directed
        this.fields={}
        if(fields instanceof Array){
            for(let i=0; i<fields.length; i++){
                this.fields[fields[i]]=null
            }
        }
        else if(fields!==null && typeof fields==='object')  {
            this.fields=fields
        }
    }

    addField(key, value){
        if(!(key in this.fields)){
            this.fields[key]=null
            if(value!==undefined){
                this.fields[key]=value
            }
        }
    }

    setField(key, value){
        if (key in this.fields){
            this.fields[key]=value
        }
    }

    removeField(key){
        if (key in this.fields){
            delete this.fields[key]
        }
    }

    clearFields(){
        this.fields={}
    }

    getValue(key){
        return this.fields[key]
    }

    getFields(){
        return this.fields
    }
}

class Graph{
    constructor(is_directed){
        this.is_directed = !!is_directed;
        this.nodes = [];
        this.edges = [];
        this.num_nodes = 0;
        this.num_edges = 0;
    }
    reset(){
        this.nodes = [];
        this.edges = [];
        this.num_nodes = 0;
        this.num_edges = 0;
    }
    log(){
        if(this.is_directed){
            console.log("Directed Graph:")
        }
        else{
            console.log("Undirected Graph:")
        }
        console.log("Nodes:")
        // first log node fields
        for(let i=0; i<this.num_nodes; i++){
            let log_str = '    '+(i+1)+') ';
            log_str+= "id: "+this.nodes[i].getID()+", ";
            log_str+= "fields: " + JSON.stringify(this.nodes[i].getFields());
            console.log(log_str)
        }
        console.log("Adjacency Matrix:")
        // log adjacency matrix
        let line_sep_str = '    '
        for(let i=0; i<this.num_nodes; i++){
            line_sep_str+='|-----'
        }
        line_sep_str+="|"
        console.log(line_sep_str)
        for(let i=0; i<this.num_nodes; i++){
            let log_str = '    '
            for(let j=0; j<this.num_nodes; j++){
                if(this.edges[i][j]===null){
                    log_str+="|  0  "
                }
                else{
                    log_str+="|  1  "
                }
            }
            log_str+="|"
            console.log(log_str)
            console.log(line_sep_str)
        }
        // log each edge's fields
        console.log("Edges:")
        for(let i=0; i<this.num_nodes; i++){
            let lower_bound=i
            if(this.is_directed){
                lower_bound=0
            }
            for(let j=lower_bound; j<this.num_nodes; j++){
                if(this.edges[i][j]!==null){
                    let log_str='    '
                    if(this.is_directed){
                        log_str+="("+i+" --> "+j+") "
                    }
                    else{
                        log_str+="("+i+" <--> "+j+") "
                    }
                    log_str+= "fields: " + JSON.stringify(this.edges[i][j].getFields());
                    console.log(log_str)
                }
            }
        }
    }

    // node manipulations
    addNode(fields){
        let id = this.num_nodes;
        let n = new Node(id, fields)
        this.nodes.push(n)
        let new_row = [null];
        for(let i=0; i<this.num_nodes; i++){
            this.edges[i].push(null)
            new_row.push(null)
        }
        this.edges.push(new_row)
        this.num_nodes++;
    }
    removeNode(id){
        // check how many edges being removed
        if(id<this.num_nodes){
            let num_edges_removed = 0;
            for(let i=0; i<this.num_nodes; i++){
                if(i==id){continue;}
                if(this.edges[id][i]!==null){
                    num_edges_removed++;
                }
                if(this.edges[i][id]!==null){
                    num_edges_removed++;
                }
            }
            if(!this.is_directed){
                num_edges_removed/=2;
            }
            if(this.edges[id][id]!==null){
                num_edges_removed++;
            }
            // remove edges from graph
            for(let i=0; i<this.num_nodes; i++){
                this.edges[i].splice(id, 1)
            }
            this.edges.splice(id, 1)
            this.num_edges-=num_edges_removed;
            // decrement ids of nodes
            for(let i=id+1; i<this.num_nodes; i++){
                this.nodes[i].setID(i-1)
            }
            // remove node from graph
            this.nodes.splice(id, 1)
            this.num_nodes--;
        }
    }
    addFieldToNode(id, key, value){
        if(id<this.num_nodes){
            this.nodes[id].addField(key, value)
        }
    }
    addFieldToAllNodes(key, value){
        for(let i=0; i<this.num_nodes; i++){
            this.nodes[i].addField(key, value)
        }
    }
    setFieldInNode(id, key, value){
        if(id<this.num_nodes){
            this.nodes[id].setField(key, value)
        }
    }
    setFieldInAllNodes(key, value){
        for(let i=0; i<this.num_nodes; i++){
            this.nodes[i].setField(key, value)
        }
    }
    removeFieldFromNode(id, key){
        if(id<this.num_nodes){
            this.nodes[id].removeField(key)
        }
    }
    removeFieldFromAllNodes(key){
        for(let i=0; i<this.num_nodes; i++){
            this.nodes[i].removeField(key)
        }
    }
    clearFieldsFromNodes(){
        for(let i=0; i<this.num_nodes; i++){
            this.nodes[i].clearFields()
        }
    }

    // edge manipulations
    addEdge(id1, id2, fields){
        let max_ = Math.max(id1, id2)+1;
        let diff = max_ - this.num_nodes;
        if(diff>0){
            for(let i=0; i<diff; i++){
                this.addNode()
            }
        }
        if(this.edges[id1][id2]===null){
            let n1 = this.nodes[id1];
            let n2 = this.nodes[id2];
            let e = new Edge(n1, n2, this.is_directed, fields)
            this.edges[id1][id2] = e;
            if(!this.is_directed){
                this.edges[id2][id1] = e;
            }
            this.num_edges++;
        }
    }
    removeEdge(id1, id2){
        let max_ = Math.max(id1, id2);
        if(max_<this.num_nodes){
            if(this.edges[id1][id2]!==null){
                this.edges[id1][id2] = null;
                if(!this.is_directed){
                    this.edges[id2][id1] = null;
                }
                this.num_edges--;
            }
        }
    }
    addFieldToEdge(id1, id2, key, value){
        if(id<this.num_nodes){
            this.edges[id1][id2].addField(key, value)
            if(!this.is_directed){
                this.edges[id2][id1].addField(key, value)
            }
        }
    }
    addFieldToAllEdges(key, value){
        for(let i=0; i<this.num_nodes; i++){
            for(let j=0; j<this.num_nodes; j++){
                if(this.edges[i][j]!==null){
                    this.edges[i][j].addField(key, value)
                }
            }
        }
    }
    setFieldInEdge(id1, id2, key, value){
        if(id<this.num_nodes){
            this.edges[id1][id2].setField(key, value)
            if(!this.is_directed){
                this.edges[id2][id1].setField(key, value)
            }
        }
    }
    setFieldInAllEdges(key, value){
        for(let i=0; i<this.num_nodes; i++){
            for(let j=0; j<this.num_nodes; j++){
                if(this.edges[i][j]!==null){
                    this.edges[i][j].setField(key, value)
                }
            }
        }
    }
    removeFieldFromEdge(id1, id2, key){
        if(id<this.num_nodes){
            this.edges[id1][id2].removeField(key)
            if(!this.is_directed){
                this.edges[id2][id1].removeField(key)
            }
        }
    }
    removeFieldFromAllEdges(key){
        for(let i=0; i<this.num_nodes; i++){
            for(let j=0; j<this.num_nodes; j++){
                if(this.edges[i][j]!==null){
                    this.edges[i][j].removeField(key)
                }
            }
        }
    }
    clearFieldsFromEdges(){
        for(let i=0; i<this.num_nodes; i++){
            for(let j=0; j<this.num_nodes; j++){
                if(this.edges[i][j]!==null){
                    this.edges[i][j].clearFields()
                }
            }
        }
    }

    // macro function for building from structured data
    // adjacency matrix is a square matrix of length N
    buildFromData(adjacency_matrix, is_directed){
        this.reset()
        this.is_directed = is_directed
        let num_nodes = adjacency_matrix.length
        for(let i=0; i<num_nodes; i++){
            this.addNode()
        }
        for(let i=0; i<num_nodes; i++){
            for(let j=0; j<num_nodes; j++){
                if(adjacency_matrix[i][j]!==0){
                    this.addEdge(i, j)
                }
            }
        }
    }
    // macro function for assigning fields to nodes
    // node_field_list is a list of length N of objects/arrays
    assignFieldsToNodes(node_field_list){
        this.clearFieldsFromNodes()
        let min_ = Math.min(this.num_nodes, node_field_list.length)
        for(let i=0; i<min_; i++){
            let field_list = node_field_list[i];
            if(field_list instanceof Array){
                for(let j=0; j<field_list.length; j++){
                    this.addFieldToNode(i, field_list[j])
                }
            }
            else if(field_list!==null && typeof field_list==='object'){
                for(let key in field_list){
                    this.addFieldToNode(i, key, field_list[key])
                }
            }
        }
    }
    // macro function for assigning fields to edges
    // edge_field_list is a square matrix of length N of objects/arrays
    assignFieldsToEdges(edge_field_list){
        this.clearFieldsFromEdges()
        let row_lens = edge_field_list.map(function(arr){return arr.length})
        let min_row_len = Math.min(...row_lens)
        let min_ = Math.min(this.num_nodes, edge_field_list.length, min_row_len)
        for(let i=0; i<min_; i++){
            for(let j=0; j<min_; j++){
                let field_list = edge_field_list[i][j];
                if(field_list instanceof Array){
                    for(let k=0; k<field_list.length; k++){
                        this.addFieldToEdge(i, j, field_list[k])
                    }
                }
                else if(field_list!==null && typeof field_list==='object'){
                    for(let key in field_list){
                        this.addFieldToEdge(i, j, key, field_list[key])
                    }
                }
            }
        }
    }

    // functions for getting a neighborhood nodes and edges

    // function for getting ingoing 1 neighborhood (for recursion)
    get_1_in_neighborhood(id, node_list, edge_list, current_depth){
        // check column
        for(let i=0; i<this.num_nodes; i++){
            if(this.edges[i][id]!==null){
                if(node_list[i]===null){
                    node_list[i]=current_depth+1;
                }
                edge_list[i][id]=true;
            }
        }
    }
    // function for getting outgoing 1 neighborhood (for recursion)
    get_1_out_neighborhood(id, node_list, edge_list, current_depth){
        // check row
        for(let i=0; i<this.num_nodes; i++){
            if(this.edges[id][i]!==null){
                if(node_list[i]===null){
                    node_list[i]=current_depth+1;
                }
                edge_list[id][i]=true;
            }
        }
    }
    // get undirected k=1 neighborhood (for recursion)
    get_1_neighborhood(id, node_list, edge_list, current_depth){
        for(let i=0; i<this.num_nodes; i++){
            if(this.edges[id][i]!==null){
                if(node_list[i]===null){
                    node_list[i]=current_depth+1;
                }
                edge_list[id][i]=true;
                edge_list[i][id]=true;
            }
        }
    }

    // get ingoing k neighborhood
    getIngoingNeighborhood(id, k){
        let node_list = [];
        let edge_list = [];
        for(let i=0; i<this.num_nodes; i++){
            node_list.push(null)
            let null_list = [];
            for(let j=0; j<this.num_nodes; j++){
                null_list.push(null)
            }
            edge_list.push(null_list)
        }
        node_list[id]=0
        for(let depth=0; depth<k; depth++){
            for(let i=0; i<this.num_nodes; i++){
                if(node_list[i]===depth){
                    this.get_1_in_neighborhood(i, node_list, edge_list, depth)
                }
            }
        }
        // at the end, check for any edges between nodes
        // in neighborhood to complete the subgraph
        for(let i=0; i<this.num_nodes; i++){
            if(node_list[i]!==null){
                for(let j=0; j<this.num_nodes; j++){
                    if(node_list[j]!==null){
                        if(this.edges[i][j]!==null){
                            edge_list[i][j]=true
                        }
                    }
                }
            }
        }
        let return_dict = {
            "nodes": node_list,
            "edges": edge_list
        }
        return return_dict
    }
    // get outgoing k neighborhood
    getOutgoingNeighborhood(id, k){
        let node_list = [];
        let edge_list = [];
        for(let i=0; i<this.num_nodes; i++){
            node_list.push(null)
            let null_list = [];
            for(let j=0; j<this.num_nodes; j++){
                null_list.push(null)
            }
            edge_list.push(null_list)
        }
        node_list[id]=0
        for(let depth=0; depth<k; depth++){
            for(let i=0; i<this.num_nodes; i++){
                if(node_list[i]===depth){
                    this.get_1_out_neighborhood(i, node_list, edge_list, depth)
                }
            }
        }
        // at the end, check for any edges between nodes
        // in neighborhood to complete the subgraph
        for(let i=0; i<this.num_nodes; i++){
            if(node_list[i]!==null){
                for(let j=0; j<this.num_nodes; j++){
                    if(node_list[j]!==null){
                        if(this.edges[i][j]!==null){
                            edge_list[i][j]=true
                        }
                    }
                }
            }
        }
        let return_dict = {
            "nodes": node_list,
            "edges": edge_list
        }
        return return_dict
    }
    // get undirected k neighborhood
    getNeighborhood(id, k){
        let node_list = [];
        let edge_list = [];
        for(let i=0; i<this.num_nodes; i++){
            node_list.push(null)
            let null_list = [];
            for(let j=0; j<this.num_nodes; j++){
                null_list.push(null)
            }
            edge_list.push(null_list)
        }
        node_list[id]=0
        for(let depth=0; depth<k; depth++){
            for(let i=0; i<this.num_nodes; i++){
                if(node_list[i]===depth){
                    this.get_1_neighborhood(i, node_list, edge_list, depth)
                }
            }
        }
        // at the end, check for any edges between nodes
        // in neighborhood to complete the subgraph
        for(let i=0; i<this.num_nodes; i++){
            if(node_list[i]!==null){
                for(let j=0; j<this.num_nodes; j++){
                    if(node_list[j]!==null){
                        if(this.edges[i][j]!==null){
                            edge_list[i][j]=true
                        }
                    }
                }
            }
        }
        let return_dict = {
            "nodes": node_list,
            "edges": edge_list
        }
        return return_dict
    }

    // A recursive function that detects directed cycles
    isDirectedCyclicRecurse(self, id, visited, recStack){

        // Mark current node as visited and 
        // adds to recursion stack
        visited[id] = true
        recStack[id] = true

        // Recur for all neighbours
        // if any neighbour is visited and in 
        // recStack then graph is cyclic
        let neighborhood = this.getOutgoingNeighborhood(id, 1)
        for(let i=0; i<this.num_nodes; i++){
            if(neighborhood["nodes"][i]!==null && neighborhood["nodes"][i]!==0){
                if(!visited[i]){
                    if(this.isDirectedCyclicRecurse(i, visited, recStack)){
                        return true
                    }
                }
                else if(recStack[i]){
                    return true
                }
            }
        }

        // The node needs to be poped from 
        // recursion stack before function ends
        recStack[id] = false
        return false
    }

    // Returns true if graph is directed cyclic else false
    isDirectedCyclic(){
        let visited = []
        let recStack = []
        for(let i=0; i<this.num_nodes; i++){
            visited.push(false)
            recStack.push(false)
        }
        for(let i=0; i<this.num_nodes; i++){
            if(!visited[node]){
                if(this.isDirectedCyclicRecurse(node,visited,recStack)){
                    return true
                }
            }
        }
        return false
    }

    // A recursive function that uses visited[] and parent to detect
    // cycle in subgraph reachable from vertex v.
    isUndirectedCyclicRecurse(id, visited, parent){
        // Mark the current node as visited 
        visited[id]= true
 
        // Recur for all the vertices adjacent to this vertex
        let neighborhood = this.getNeighborhood(id, 1)
        for(let i=0; i<this.num_nodes; i++){
            if(neighborhood["nodes"][i]!==null && neighborhood["nodes"][i]!==0){
                // If the node is not visited then recurse on it
                if(!visited[i]){
                    if(this.isUndirectedCyclicRecurse(i, visited, id)){
                        return true
                    }
                }
                // If an adjacent vertex is visited and not parent of current vertex,
                // then there is a cycle
                else if(parent!=i){
                    return true
                }
            }
        }
        return false
    }
          
  
    // Returns true if the graph contains a cycle, else false.
    isUndirectedCyclic(){
        // Mark all the vertices as not visited
        let visited =[]
        for(let i=0; i<this.num_nodes; i++){
            visited.push(false)
        }
        // Call the recursive helper function to detect cycle in different
        // DFS trees
        for(let i=0; i<this.num_nodes; i++){
            if(!visited[i]){
                if(this.isUndirectedCyclicRecurse(i, visited, -1)){
                    return true
                }
            }
        }
        return false
    }
}

// export{
//     Node,
//     Edge,
//     Graph
// }
