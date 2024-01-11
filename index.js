const fs = require('fs'); //'fs' (file system) is a built in module, allowing us to write and read data on the file system
const http = require('http');
const url = require('url');

//--------------------FILES----------------//
// Blocking, synchrounous way
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8'); // Takes two arguments, first one is a file path, second one is encoding standard
// console.log(textInput);

// const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR!');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         // (1) The second argument in the writeFile is the content on the new file created (2) No need for the second argument on the callback because we're not waiting for any file/data
//         console.log('Your file has been written');
//       });
//     });
//   });
// }); // (1) readFile Takes two arguments, first one is file path, second one is callback; (2) Callback function takes two arguments: error & data (or other name your want)
// console.log('Will read file!');

//-------------------SERVER----------------------//

const replaceTemplate = (temp, product) => {
  console.log('Template:', temp);
  console.log('Product', product);
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // '/{%PRODUCTNAME%}/g' is a regular expression literal to replace the multiple placeholders with the same name globally
  console.log('Output:', output);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%ORIGIN%}/g, product.from);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic'); // Replace the class to 'not-organic'
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const pathName = req.url;

  // OVERVIEW PAGE
  if (pathName === '/' || pathName === 'overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    console.log('DAta object:', dataObj);
    console.log('Template card:', tempCard);

    const cardsHtml = dataObj
      .map((product) => replaceTemplate(tempCard, product))
      .join('');
    // Takes the current HTML (tempCard) and each product object in the data // join() is to transform the array into a string
    console.log('cardsHtml:', cardsHtml);

    const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);

    res.end(output);
    // PRODUCT PAGE
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT');
    // API PAGE
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
    // PAGE NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found!</h1>');
  }
}); // createServer takes two fundamental variables: request and response

server.listen(3006, () => {
  console.log('Listening to request on port 3006');
});
