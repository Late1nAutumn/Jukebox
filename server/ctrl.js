const fs = require('fs');
const util = require('util');
const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');

module.exports = {
  voice: async function(req,res){
    const client = new textToSpeech.TextToSpeechClient();

    const request = {
      input: {text: req.params.text},
      voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
      audioConfig: {audioEncoding: 'MP3'},
    };

    const [response] = await client.synthesizeSpeech(request)
      .catch((err)=>{console.log(err)});
    // const writeFile = util.promisify(fs.writeFile);
    // await writeFile('output.mp3', response.audioContent, 'binary');
    // console.log('Audio content written to file: output.mp3');
    res.status(200).send(response.audioContent);
  },

  add:(req,res)=>{
    // console.log(req.body);
    if(!req.body || !req.params.name || req.body.length===0){
      res.status(400).send("wrong format");
      return;
    }
    fs.readFile(path.join(__dirname,'./mockDB/list/list.json'),"utf-8",(err,data)=>{
      //ignore error
      var update=false;
      var temp=data?JSON.parse(data):[];
      for(var i of temp)
        if(i===req.params.name)
          update=true;
      if(!update) temp.push(req.params.name);

      fs.writeFile(path.join(__dirname,'./mockDB/list/list.json'),JSON.stringify(temp),(err)=>{
        if(err)res.status(400).send(err);
        else{
          fs.writeFile(path.join(__dirname,'./mockDB/list/list-'+req.params.name+'.json'),JSON.stringify(req.body),(err)=>{
            if(err)res.status(400).send(err);
            else res.status(201).send('list '+(update?"updated":"added"));
          })
        }
      });
    });
  },

  lists:(req,res)=>{
    fs.readFile(path.join(__dirname,'./mockDB/list/list.json'),"utf-8",(err,data)=>{
      if(err) res.status(400).send(err);
      else res.status(200).send(data);
    });
  },

  list:(req,res)=>{
    fs.readFile(path.join(__dirname,'./mockDB/list/list-'+req.params.name+'.json'),"utf-8",(err,data)=>{
      // console.log(data);
      if(err) res.status(404).send(err);
      else res.status(200).send(data);
    });
  }
};

/*
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
async function main() {
  // Creates a client
  const client = new textToSpeech.TextToSpeechClient();

  // The text to synthesize
  const text = 'Hello, world!';

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the Text-to-Speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}
*/