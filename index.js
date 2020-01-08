const fs = require('fs');
const http = require('http');
const url = require('url');

// BLOCKING, SYNCHRONOUS CODE
/* const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textInput);
const textOutput = `This what we know about the avocado: ${textInput} File created on: ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOutput); */
/* 
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);

        fs.writeFile('./txt/async_output.txt', `${data1}\n${data2}`, 'utf-8', err => {
            console.log('Your file has been written');
        })
    });
});
console.log('Will read file!'); */
const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

const server = http.createServer((request, response) => {
    console.log(request.url);

    const pathName = request.url;

    // OVERVIEW PAGE
    if (pathName === '/' || pathName === '/overview') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHtml = productData.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        response.end(output);
    }
    // PRODUCT PAGE
    else if (pathName === '/product') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        })
        response.end(tempProduct);
    }
    // API
    else if (pathName === '/api') {
        response.writeHead(200, {
            'Content-type': 'application/json'
        });
        response.end(data);
    }
    // NOT FOUND
    else {
        response.writeHead(404, {
            'Content-type': 'text/html'
        });
        response.end('<h1>Hello from the server!</h1>'); // answer back to the client
    }
    
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});

