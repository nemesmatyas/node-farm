const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

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

const slug = productData.map(el => slugify(el.productName, { lower: true }));
console.log(slug);

const server = http.createServer((request, response) => {
    
    const { query, pathname } = url.parse(request.url, true);

    // OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHtml = productData.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        response.end(output);
    }
    // PRODUCT PAGE
    else if (pathname === '/product') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        })
        const product = productData[query.id];
        const output = replaceTemplate(tempProduct, product);
        
        response.end(output);
    }
    // API
    else if (pathname === '/api') {
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
        response.end('<h1>Page not found!</h1>'); // answer back to the client
    }
    
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});

