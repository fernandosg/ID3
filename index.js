var express=require("express");
var app=express();
ID3=require("./src/id3.js");
app.listen(3000);
id3=new ID3();
id3.init("Play ball");
id3.initBuild();
//id3.getTree(id3.getEntrenamiento());
app.get("/",function(req,response){
	id3.init("juego_tenis");
	id3.getTree(id3.getEntrenamiento());
	//id3.getEntropy();
	//id3.getFrequencies();
	response.send("This is awesome");
})