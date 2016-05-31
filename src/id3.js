function id3(){


this.tabla_entrenamiento=[
{"Outlook":"Sunny","Temperature":"Hot","Humidity":"High","Wind":"Weak","Play ball":"No"},
{"Outlook":"Sunny","Temperature":"Hot","Humidity":"High","Wind":"Strong","Play ball":"No"},
{"Outlook":"Overcast","Temperature":"Hot","Humidity":"High","Wind":"Weak","Play ball":"Yes"},
{"Outlook":"Rain","Temperature":"Mild","Humidity":"High","Wind":"Weak","Play ball":"Yes"},
{"Outlook":"Rain","Temperature":"Cool","Humidity":"Normal","Wind":"Weak","Play ball":"Yes"},
{"Outlook":"Rain","Temperature":"Cool","Humidity":"Normal","Wind":"Strong","Play ball":"No"},
{"Outlook":"Overcast","Temperature":"Cool","Humidity":"Normal","Wind":"Strong","Play ball":"Yes"},
{"Outlook":"Sunny","Temperature":"Mild","Humidity":"High","Wind":"Weak","Play ball":"No"},
{"Outlook":"Sunny","Temperature":"Cool","Humidity":"Normal","Wind":"Weak","Play ball":"Yes"},
{"Outlook":"Rain","Temperature":"Mild","Humidity":"Normal","Wind":"Weak","Play ball":"Yes"},
{"Outlook":"Sunny","Temperature":"Mild","Humidity":"Normal","Wind":"Strong","Play ball":"Yes"},
{"Outlook":"Overcast","Temperature":"Mild","Humidity":"High","Wind":"Strong","Play ball":"Yes"},
{"Outlook":"Overcast","Temperature":"Hot","Humidity":"Normal","Wind":"Weak","Play ball":"Yes"},
{"Outlook":"Rain","Temperature":"Mild","Humidity":"High","Wind":"Strong","Play ball":"No"}];
	/*this.tabla_entrenamiento=[
		{"outlook":"sunny","temperature":"hot","humidity":"high","wind":"weak","juego_tenis":"no"},
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
	];*/
}


id3.prototype.init=function(clase){
	this.clase=clase;
	this.atributos_nombres=["Outlook","Temperature","Humidity","Wind","Play ball"];
	this.atributos={
		"Outlook":["Sunny","Overcast","Rain"],
		"Temperature":["Hot","Mild","Cool"],
		"Humidity":["High","Normal"],
		"Wind":["Weak","Strong"],
		"Play ball":["Yes","No"]
	}
	
}

id3.prototype.getEntrenamiento=function(){
	return this.tabla_entrenamiento;
}


id3.prototype.getFrecuencias=function(atributo,atributos,tabla_entrenamiento){
	var parent=this;
	tabla_frecuencia={};
	tabla_frecuencia[atributo]={}; 
		//Iteracion sobre las clases SI y NO
		atributos[atributo].forEach(function(atributo_itera){
			//Iteracion sobre cada atributo (iteracion sobre soleado,nublado,lluvia de "estado")
			tabla_frecuencia[atributo][atributo_itera]={};
			atributos[parent.clase].forEach(function(clase_dominio){
				tabla_frecuencia[atributo][atributo_itera][clase_dominio]=0;	
			})
		});			
	tabla_entrenamiento.forEach(function(entrada){
		tabla_frecuencia[atributo][entrada[atributo]][entrada[parent.clase]]++;			
	})	
	return tabla_frecuencia;
}

id3.prototype.conteoTotales=function(atributo,tabla_frecuencia){
	this.atributos[atributo].forEach(function(atributo_itera){
		tabla_frecuencia[atributo_itera]["total"]=0;
		parent.atributos[parent.clase].forEach(function(clase_dominio){		
			tabla_frecuencia[atributo_itera]["total"]+=tabla_frecuencia[atributo_itera][clase_dominio];
		})
	})
	
	return tabla_frecuencia;
}

id3.prototype.conteoEntrenamiento=function(entrenamiento){
	tabla_conteo={};
	tabla_conteo["total"]=0;
	parent=this;
	this.atributos[this.clase].forEach(function(clase_dominio){
		tabla_conteo[clase_dominio]=0;		
	})
	entrenamiento.forEach(function(entrada){
		tabla_conteo[entrada[parent.clase]]++;
		tabla_conteo["total"]++;
	})
	return tabla_conteo;
}

id3.prototype.getEntropia=function(conjunto){
	//DEBO DE HACER conteoTotales para que pueda contar cualquier tipo de conjunto
	//conjunto de entrenamiento y conjunto de atributo
	entropia=0,valor=0;
	this.atributos[this.clase].forEach(function(clase_dominio){
		if(conjunto[clase_dominio]!=0 && conjunto["total"]!=0)
			entropia-=(conjunto[clase_dominio]/conjunto["total"])*(Math.log(conjunto[clase_dominio]/conjunto["total"])/Math.log(2));
		else
			entropia=0;		
	})
	return entropia;
}

id3.prototype.getEntropiaAtributo=function(atributo,conjunto){
	parent=this;
	entropia=0;
	this.atributos[atributo].forEach(function(atributo_itera){
		entropia+=(conjunto[atributo_itera]["total"]/parent.tabla_entrenamiento.length)*parent.getEntropia(conjunto[atributo_itera]);
	})
	return entropia;
}

probar_homogenea=[{ estado: 'nublado',
    humedad: 'alta',
    viento: 'leve',
    juego_tenis: 'si' },
  { estado: 'nublado',
    humedad: 'normal',
    viento: 'fuerte',
    juego_tenis: 'si' },
  { estado: 'nublado',
    humedad: 'alta',
    viento: 'fuerte',
    juego_tenis: 'si' },
  { estado: 'nublado',
    humedad: 'normal',
    viento: 'leve',
    juego_tenis: 'si' } ]


id3.prototype.filtradoAtributo=function(atributo,tabla_entrenamiento,atributos_nombres){
	parent=this;
	tablas_filtradas=[];	
	this.atributos[atributo].forEach(function(atributo_itera){
		nueva_tabla=[];
		//console.log("atributo_itera= "+atributo_itera+" "+atributo);
		if(atributo_itera!=parent.clase){
			tabla_entrenamiento.forEach(function(entrada){
				if(entrada[atributo]==atributo_itera)
					nueva_tabla.push(entrada);
			})
			console.log("------------------\n\n");
		}
		tablas_filtradas.push(nueva_tabla);
	});
	atributos_nombres.splice(atributos_nombres.indexOf(atributo),1);
	tablas_filtradas.forEach(function(tabla_filtrada){		
		console.dir(tabla_filtrada);
		if(!parent.esHomogenea(tabla_filtrada)){
			if(tabla_filtrada.length>2)
				parent.getTree(tabla_filtrada,atributos_nombres);
			else{
				console.log("Termina aqui");
				console.dir(tabla_filtrada);
			}
		}else{
			console.log("Fue homogenea");
		}
	})
}

id3.prototype.conteoDominio=function(atributos_nombres,entropia_conjunto,tabla_entrenamiento){
	var parent=this;	
	ganancias={};
	console.log
	atributos_nombres.forEach(function(atributo){		
		if(atributo!=parent.clase){
			ganancias[atributo]=0
			frecuencias=parent.getFrecuencias(atributo,parent.atributos,tabla_entrenamiento);
			ganancias[atributo]=entropia_conjunto-parent.getEntropiaAtributo(atributo,parent.conteoTotales(atributo,frecuencias[atributo]));
		}
	});
	atributo_mayor="";
	atributo_valor=0;
	for(var atributo in ganancias){
		if(ganancias[atributo]>atributo_valor){
			atributo_mayor=atributo;
			atributo_valor=ganancias[atributo];
		}
	}
	console.log("El atributo mayor "+atributo_mayor+" "+atributo_valor);
	this.filtradoAtributo(atributo_mayor,tabla_entrenamiento,atributos_nombres);
}

id3.prototype.initBuild=function(){
	this.getTree(this.tabla_entrenamiento,this.atributos_nombres);
}

id3.prototype.getTree=function(tabla_entrenamiento,atributos_nombres){
	entropia_conjunto=this.getEntropia(this.conteoEntrenamiento(tabla_entrenamiento));
	this.conteoDominio(atributos_nombres,entropia_conjunto,tabla_entrenamiento);	
}

id3.prototype.esHomogenea=function(probar_homogenea){
	var conteo={};
	var parent=this;
	conteo[this.atributos[this.clase][0]]={};
	conteo[this.atributos[this.clase][0]]["diferentes"]=0;
	conteo[this.atributos[this.clase][0]]["iguales"]=0;
	probar_homogenea.forEach(function(entrada){
		if(entrada[parent.clase]==parent.atributos[parent.clase][0])
			conteo[parent.atributos[parent.clase][0]]["iguales"]++;
		else
			conteo[parent.atributos[parent.clase][0]]["diferentes"]++;
	});
	return (conteo[this.atributos[this.clase][0]]["iguales"]==0 || conteo[this.atributos[this.clase][0]]["diferentes"]==0);	
}


module.exports=id3;