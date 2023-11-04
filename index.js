// The fs package allows you to do I/O and the thing returned by require is an object with all the methods that you may need to call like ReadFileSync

const fs = require("fs")



// SYNCHRONOUS BLOCKING WAY
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8")
// console.log(textIn)

// const textOut = `This is what we know about avocados: ${textIn}created on ${Date.now()}.`
// fs.writeFileSync('./txt/output.txt', textOut)

// ASYNCHRONOUS 

// fs.readFile("./txt/start.txt",  "utf-8", (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log(data2);
//     })
// })

// console.log("I am run before the printing of the data!!!")


const http = require("http")
const url = require("url")

const replaceTemplate = require("./modules/replaceTemplate")

// Reading the products data from file 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const productData = JSON.parse(data) // Converts JSON string into a javascript code

// Reading the template html for each page as string
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card-template.html`, "utf-8")
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview-template.html`, "utf-8")
const productTemplate = fs.readFileSync(`${__dirname}/templates/product-template.html`, "utf-8")

//Creating a server which will call the call back function whenever a new request is received
const server = http.createServer((req, res) => {
   
    // Parsing the request.url returns an object with information about the request url. We mainly require the pathname and the query(exactly spelled this way). In this case the pathname is "/product" and the query is "id=0"
    const {pathname, query} = url.parse(req.url, true)
 
    // Overview page
    if(pathname == "/" || pathname == "/overview") {
        res.writeHead(200, {"content-type": "text/html"})
        const cardsHtml = productData.map((el) =>  replaceTemplate(cardTemplate, el)).join('')
        //console.log(cardsHtml.join(''))
        const output = overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, cardsHtml)
        res.end(output)
    }
    // API
    else if(pathname == "/api") {
        // The browser is informed about the repsonse content/characteristics by the http header object below, the object can have many different pieces of infomation about the response
        res.writeHead(200, {"content-type": "application/json"})
        //res.end can only send a string back to the webpage
        res.end(data)
    }
    // Product page
    else if(pathname == "/product") {
        res.writeHead(200, {"content-type": "text/html"})
        const output = replaceTemplate(productTemplate, productData[query.id])
        res.end(output)
    }
    // Invalid page
    else {
        // The browser is informed about the repsonse by the http header object below, the object can have many different pieces of infomation about the response
        res.writeHead(404, {
            "content-type": "text/html"
        })
        res.end("<h1>Page not found</h1>")
    }
    

})


// Server is listening for requests on local host at port 8000
server.listen(8000, "127.0.0.1", () =>{
    console.log("Listening on port 8000")
})
