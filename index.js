require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded( {extended: true} ))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let originalUrls = [];
let shortUrls = 0;
// Your first API endpoint
app.post('/api/shorturl', (req, res) => {
  let url =  req.body.url;
  let indexOfUrl = originalUrls.indexOf(url);

  if (!url.includes("https://") && !url.includes("http://")){
    return res.json({error: "Invalid Url"})
  }
  
  if (indexOfUrl < 0) {
    originalUrls.push(url);
    // shortUrls.push(shortUrls.lenght);
    return res.json({
      original_url:url,
      short_url:shortUrls++
    })
  }
  return res.json({ 
       original_url:url,
       short_url:shortUrls
     });
  });

app.get('/api/shorturl/:shorturl', (req, res) => {
  let shorturl = parseInt(req.params.shorturl);
  let indexOfUrl = originalUrls[shorturl];
  if (indexOfUrl < 0) {
    return res.json({error: "No Url"})
  }
  res.redirect(indexOfUrl)
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
