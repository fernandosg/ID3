var Tree=(function(){
	var stack=[];
	var branches={};
	return{
		add:function(node,node_parent){			
			if(node_parent!=""){
				if(branches[node_parent]!=undefined)
					branches[node_parent].branch.push(node);
				else{
					stack.push(node_parent);
					branches[node_parent]={branch[node],isLeaf:false};
				}				
			}else{
				branches[node]={branch:[],isLeaf:false};
			}
			stack.push(node);
		},
		addLeaf:function(node,node_parent,leaf){
			stack.push(node);
			if(branches[node_parent]!=undefined){
				branches[node_parent].branch.push(node);
				branches[node_parent].branch.push(leaf);
			}else{
				branches[node_parent]={branch[node,leaf],isLeaf:true};
			}
		}
	}
})();