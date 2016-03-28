var express=require("express");
var app=express();
id3=require("./src/id3.js");
app.listen(3000);
app.get("/",function(req,response){
	id3.init("juego_tenis");
	//id3.getEntropy();
	id3.getFrequencies();
	response.send("This is awesome");
})