// using nodejs to fetch rss
// because feedparser is considerably slow in python-feedparser and beautiful soup 
//   due to maybe the vietnamese servers's location and header requirements

var request = require('request'); 
var parseString = require('xml2js').parseString;
var fs = require('fs');
var sendData = require("./sender");
require('dotenv').config();

const rootPath = process.env.LAMBDA_TASK_ROOT;
const sources = ["vnexpress.url.json", "vietnamnet.url.json", "dantri.url.json"];

const run = () => {
  sources.forEach(async (source) => {
    const sourceUrls = require(`${rootPath}/sources/${source}`);

    for (let url of sourceUrls) {
      request(url, async function (error, response, html) {
        if (error) {
          console.log("error doing that request: ", error);
          console.log("response doing that error: ", response);
        } 
        if (!error && response.statusCode == 200) {
          const {strData, category} = await processXML(html, url, source.split(".")[0])
          const textFileName                      = `${source.split(".")[0]}.${category}.data`
          await sendData(textFileName, strData);
        }
      })

    }
  })
}

/*
  param: xmlString
  param: url: https.* of rss feed
*/
const processXML = async (xmlStr, url, source) => {
  let category = url.match(/([\w|-]+)\.rss/)[1].replace(/\//g,'_').replace(/-/g,'_')

  // since dantri.com.vn has sub-directories, which may cause 2 sub-dirs to have same rss feed name
  if (source.includes('dantri.com.vn')) {
    category = url.match(/\.com\.vn\/(.*)\.rss/)[1].replace(/\//g,'_').replace(/-/g,'_')
  }

  try {
    let result = {};
    // because parseString if friggin' async 
    parseString(xmlStr, (err, res) => {
      if (err) {
        console.log(err);
      }
      result = res;
    });
    const parsed = JSON.stringify(result, null, 2)
    return {strData: parsed, category};
  } catch(err) {
    console.log("error fetching rss feed", err);
    return null
  }
}

exports.handler = (event, context, callback) => {
  run();
  return true;
}
