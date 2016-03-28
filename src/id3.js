var ID3=(function(){
	var class_defined;
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
	function calculateEntropyConjunt(table_training_pam){
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
	function calculateFrequencies(){
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
				table_frequencies[attributes_label[x]][attributes[attributes_label[x]][y]]=calculateEntropyConjunt(row_frequencies[attributes_label[x]][attributes[attributes_label[x]][y]]);				
				row_frequencies={};
			}
		}
		return table_frequencies;
	}
	return{
		init:function(data){
			class_defined=data;
		},
		getEntropy:function(){
			console.dir(calculateEntropyConjunt(table_training));
		},
		getFrequencies:function(){
			console.dir(calculateFrequencies());
		}
	}
})();
module.exports=ID3;