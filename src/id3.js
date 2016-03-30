var ID3=(function(){
	var class_defined;
	Tree=new require("./class/tree.js");
	var attributes_label=["estado","humedad","viento","juego_tenis"];
	var attributes={
		"estado":["soleado","nublado","lluvia"],
		"humedad":["alta","normal"],
		"viento":["leve","fuerte"],
		"juego_tenis":["si","no"]
	}
	var table_training=[
		{"estado":"soleado","humedad":"alta","viento":"leve","juego_tenis":"no"},
		{"estado":"soleado","humedad":"alta","viento":"fuerte","juego_tenis":"no"},
		{"estado":"nublado","humedad":"alta","viento":"leve","juego_tenis":"si"},
		{"estado":"lluvia","humedad":"alta","viento":"leve","juego_tenis":"si"},
		{"estado":"lluvia","humedad":"normal","viento":"leve","juego_tenis":"si"},
		{"estado":"lluvia","humedad":"normal","viento":"fuerte","juego_tenis":"no"},
		{"estado":"nublado","humedad":"normal","viento":"fuerte","juego_tenis":"si"},
		{"estado":"soleado","humedad":"alta","viento":"leve","juego_tenis":"no"},
		{"estado":"soleado","humedad":"normal","viento":"leve","juego_tenis":"si"},
		{"estado":"lluvia","humedad":"normal","viento":"leve","juego_tenis":"si"},
		{"estado":"soleado","humedad":"normal","viento":"fuerte","juego_tenis":"si"},
		{"estado":"nublado","humedad":"alta","viento":"fuerte","juego_tenis":"si"},
		{"estado":"nublado","humedad":"normal","viento":"leve","juego_tenis":"si"},
		{"estado":"lluvia","humedad":"alta","viento":"fuerte","juego_tenis":"si"}
	];
	function calculateFrequencieClass(table_training_pam){
		var entropy_class={};
		entropy_class["total"]=0;
		for(var x=0,table_length=table_training_pam.length;x<table_length;x++){			
			if(entropy_class[table_training_pam[x][class_defined]]==undefined)
				entropy_class[table_training_pam[x][class_defined]]=1;
			else
				entropy_class[table_training_pam[x][class_defined]]+=1;
			entropy_class["total"]+=1;
		}	
		return entropy_class;
	}
	function calculateEntropySet(set){
		var entropy=1,homogeneous=false;

		for(var i=0,name_of_class=attributes[class_defined][i],length=attributes[class_defined].length;i<length;i++,name_of_class=attributes[class_defined][i]){
			if(set[name_of_class]==set["total"])				
				break;			
			entropy=entropy-(set[name_of_class]/set["total"])*Math.log2((set[name_of_class]/set["total"]));
		}
		return {entropy:(!isNaN(entropy) ? entropy : 1)};
	}
	function calculateFrequencies(table_training){
		var table_frequencies={},row_frequencies={};		
		for(var x=0,attributes_label_length=attributes_label.length;x<attributes_label_length;x++){
			table_frequencies[attributes_label[x]]={};
			if(attributes_label[x]==class_defined)
					continue;
			for(var y=0,attributes_length=attributes[attributes_label[x]].length;y<attributes_length;y++){
				row_frequencies[attributes_label[x]]={};
				row_frequencies[attributes_label[x]][attributes[attributes_label[x]][y]]=[];				
				for(var i=0,table_training_length=table_training.length;i<table_training_length;i++)
					if(table_training[i][attributes_label[x]]==attributes[attributes_label[x]][y])
						row_frequencies[attributes_label[x]][attributes[attributes_label[x]][y]].push(table_training[i]);
				table_frequencies[attributes_label[x]][attributes[attributes_label[x]][y]]=calculateFrequencieClass(row_frequencies[attributes_label[x]][attributes[attributes_label[x]][y]]);				
				table_frequencies[attributes_label[x]][attributes[attributes_label[x]][y]]["table"]=row_frequencies[attributes_label[x]][attributes[attributes_label[x]][y]];
				row_frequencies={};
			}
		}
		return table_frequencies;
	}
	function reduceSet(parent_node,attribute_name,repeat,table_training){
		new_table=[];
		if(repeat<7 && attributes[attribute_name]!=undefined){
			for(var i=0,length=attributes[attribute_name].length;i<length;i++){
				for(x=0,length_table=table_training.length;x<length_table;x++){
					if(table_training[x][attribute_name]==attributes[attribute_name][i]){
						 //EN LUGAR DE ELIMINAR AQUI EL ATRIBUTO CON MAYOR GANANCIA
						 // MEJOR ELIMINAR EL ATRIBUTO DEL attributes_label
						attributes_label=attributes_label.filter(function(element){
							return element!=attribute_name;
						});
						new_table.push(table_training[x]);
					}
				}				
				repeat++;
				if(!isHomogeneous(new_table,attributes[attribute_name][i])){
					Tree.add(attributes[attribute_name][i],attribute_name);		
					execute(attributes[attribute_name][i],repeat,new_table);
				}else{
					if(parent_node==""){
						parent_node=attribute_name;
					}
					Tree.addLeaf(attributes[attribute_name][i],parent_node,new_table[0][class_defined],attribute_name);
					attributes[attribute_name].splice(i,1);	
					i=i-1;	
					length=attributes[attribute_name].length;
				}
				new_table=[];
			}
		}
	}
	/* Filter all the elements with the same class name, if there are more that one where the
		the class name are differente,is because this is no homogeneous
	*/
	function isHomogeneous(table_frequencies,higher_attribute){
		var key="",attribute_homogeneous_value="";
		filter=table_frequencies.filter(function(element){
			attribute_homogeneous_value=element[higher_attribute];
			if(key.length>0){
				return key!=element[class_defined];
			}else{
				key=element[class_defined];
				return false;
			}
		});
		return filter.length==0;
	}
	/* If the set are only two elements, there is not reason to calculate the entropy */
	function splitSet(node_value,table_training){
		attribute_dispatch="",attribute_origin="";
		for(var i=0;i<table_training.length;i++){
			for(var attribute in table_training[i]){
				if(table_training[i][attribute]==node_value){
					attribute_origin=attribute.toString();
					break;						
				}	
				attribute_dispatch=attribute.toString();
			}
			Tree.addLeaf(node_value,attribute_dispatch,table_training[i][class_defined],attribute_origin);			
		}
	}
	function execute(parent_node,repeat,table_training){
		table_frequencies=calculateFrequencies(table_training);		
		frequencie_class_for_set=calculateFrequencieClass(table_training);		
		entropy_of_set=calculateEntropySet(frequencie_class_for_set);			
		/* Calculate the entropies of each of the attributes in the set */	
		higher_entropy=0;	
		higher_entropy_name="";
		entropies=[];
		if(table_training.length>2){
			for(var i=0,attribute_label_name=attributes_label[i],attributes_label_length=attributes_label.length;i<attributes_label_length;i++,attribute_label_name=attributes_label[i]){
				if(attributes_label[i]==class_defined)
					continue;			
				table_frequencies[attribute_label_name]["entropy"]=0
				for(var x=0,attributes_length=attributes[attribute_label_name].length;x<attributes_length;x++){
					table_frequencie=table_frequencies[attribute_label_name][attributes[attribute_label_name][x]];
					table_frequencies[attribute_label_name]["entropy"]+=(table_frequencie["total"]/frequencie_class_for_set["total"])*calculateEntropySet(table_frequencie)["entropy"];
				}
				table_frequencies[attribute_label_name]["entropy"]=entropy_of_set["entropy"]-table_frequencies[attribute_label_name]["entropy"];			
				if(higher_entropy<table_frequencies[attribute_label_name]["entropy"]){
					higher_entropy=table_frequencies[attribute_label_name]["entropy"];
					higher_entropy_name=attribute_label_name;
				}			
			}
			reduceSet(parent_node,higher_entropy_name,repeat,table_training);
		}else
			splitSet(parent_node,table_training);		
		
	}
	return{
		init:function(data){
			Math.log2 = Math.log2 || function(x){return Math.log(x)*Math.LOG2E;};
			class_defined=data;
			execute("",1,table_training);
		},		
		getFrequencieClass:function(){
			console.dir(calculateFrequencieClass(table_training));
		},
		getFrequencies:function(){
			console.dir(calculateFrequencies(table_training));
		},
		getEntropy:function(){
			console.dir(calculateEntropySet({ total: 14, no: 4, si: 10 }));
		},
		getTree:function(){
			console.dir(Tree.getStack());
			console.dir(Tree.getBranches());
		}
	}
})();
module.exports=ID3;