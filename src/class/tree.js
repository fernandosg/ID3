var Tree=(function(){	
	var nodes=-1;
	var stack={};
	var branches={};
	return{
		add:function(node,node_parent){		
			nodes++;	
			if(stack[node_parent]==undefined){				
				stack[node_parent]={indexs:[nodes]};
				branches[nodes]={row:[node],isLeaf:false};
			}else{
				stack[node_parent].indexs.push(nodes);
				branches[nodes]={row:[node],isLeaf:false};
			}
		},
		addLeaf:function(node,node_parent,leaf,attribute_dispatch){
			nodes++;
			if(stack[node_parent]==undefined){
				stack[node_parent]={indexs:[nodes]};
			}else{
				stack[node_parent].indexs.push(nodes);				
			}
			branches[nodes]={row:{attribute:attribute_dispatch,node:node,leaf:leaf},isLeaf:true};
		},
		getStack:function(){
			return stack;
		},
		getBranches:function(){
			return branches;
		}
	}
})();
module.exports=Tree;