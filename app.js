const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const csv = require('csvtojson');
const Battle = require('./models/battles');
const {battleController} = require('./controllers');
const csvFilePath='./public/csv/battles.csv';
const app = express();

mongoose.connect("mongodb://localhost:27017/GOT",{  useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());

app.use(express.static('./static/'));

app.get('/',async(req,res)=>{    
    try{
        const jsonArray=await csv().fromFile(csvFilePath);
      let record = await Battle.create(jsonArray);	      
	    res.sendFile(path.join(__dirname,"webapp","build","index.html"))
	}
    catch(err){
        return res.send(err)
    }      
});
app.use('/api/GOTB/',battleController);

	if(process.env.NODE_ENV==="production"){
	  app.use(express.static(path.join(__dirname,"webapp","build")));
    }

module.exports = app; 