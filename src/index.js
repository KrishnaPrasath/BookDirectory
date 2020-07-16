const express = require('express');
const parser = require('body-parser');

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended : true }));

const hostname = '127.0.0.1';
const port = 5001;
const fs = require('fs');
const file = '../public/books.json';

let book = {
    "isbn": null,
    "title": null,
    "subtitle": null,
    "author": null,
    "published": null,
    "publisher": null,
    "pages": null,
    "description": null,
    "website": null
};



app.get('/',(req,res)=>{
    fs.readFile(file,'utf8',(err, data)=>{
        if(err) {
            res.status(400).json({err});
        };
        let _ = JSON.parse(data);
        res.status(200).send(_);
    })
});

app.get('/:isbn',(req,res)=>{
    let isbn = req.params.isbn;
    fs.readFile(file,'utf8',(err, data)=>{
        if(err) {
            res.status(400).send({err});
        };
        let _ = JSON.parse(data);
        let flag = false;
        _.books.forEach(element => {
            if( element.isbn === isbn ) {
                res.status(200).send({element});
                flag = true;
            }
        });
        if(!flag){
            res.status(400).send({message : "Bad request."});
        }
    })
});

app.post('/add',(req,res)=>{
    let _ = req.body;
    book = {
        "isbn": _.isbn,
        "title": _.title,
        "subtitle": _.subtitle,
        "author": _.author,
        "published": _.published,
        "publisher": _.publisher,
        "pages": _.pages,
        "description": _.description,
        "website": _.website
    };
    fs.readFile( file, 'utf8', ( err, data )=>{
        if(err) res.status(400).send({ message: err.message });
        else{
            let response = JSON.parse(data);
            let is_exist = false;
            response.books.map(ele => { 
                if (ele.isbn === book.isbn) 
                {
                    is_exist = true;
                    return;
                }   
            });
            if( !is_exist ){
                response.books.push(book);
                fs.writeFile( file, JSON.stringify(response), err =>{
                    if(err) 
                    {
                        res.status(401).send({message : err.message});
                    }
                    else {
                        res.status(200).send({message : 'success'});
                    }
                });
            }else{
                res.status(400).send({ message: "ISBN already exist." });
            }
        }
    })
});

app.put( '/update', (req, res) => {
    let _ = req.body;
    book = {
        "isbn": _.isbn,
        "title": _.title,
        "subtitle": _.subtitle,
        "author": _.author,
        "published": _.published,
        "publisher": _.publisher,
        "pages": _.pages,
        "description": _.description,
        "website": _.website
    };
    fs.readFile( file, 'utf8', ( err, data )=>{
        if(err) res.status(400).send({ message: err.message });
        else{
            let response = JSON.parse(data);
            let is_exist = false;
            let books = response.books;
            response.books.map(ele => { 
                if (ele.isbn === book.isbn) 
                {
                    is_exist = true;
                    response.books.pop(ele);
                    response.books.push(book);
                    fs.writeFile( file, JSON.stringify(response), err => {
                        if(err) res.status(400).send({ message : "Book can't be Updated!" });
                        else res.status(200).send({ message : "Book Updated!" });
                    } );
                }   
            });
            if( !is_exist ){
                console.log("Exit");
                res.status(401).send({ message : "Book doesn't exist, please post it!" });
            }
        }
    });
});

app.delete('/delete/:isbn',(req, res) => {
    let isbn = req.params.isbn;
    fs.readFile( file, 'utf8', ( err, data )=>{
        if(err) res.status(400).send({ message: err.message });
        else{
            let response = JSON.parse(data);
            let is_exist = false;
            response.books.map(ele => { 
                if (ele.isbn === isbn) 
                {
                    console.log(ele.isbn, )
                    is_exist = true;
                    response.books.pop(ele);
                    fs.writeFile( file, JSON.stringify(response), err => {
                        if(err) res.status(400).send({ message : "Book can't be deleted!" });
                        else res.status(200).send({ message : "Book Deleted!" });
                    } );
                }   
            });
            if( !is_exist ){
                console.log("Exit");
                res.status(401).send({ message : "Book doesn't exist, please post it!" });
            }
        }
    });
})

app.listen(port, hostname, ()=>{
    console.log(`Server is up and running @${hostname}:${port}`);
});

// JSON is a text based serialisation format. When you have some JSON - it is just a string. 
// This is useful and text files and network connections only work in data, and don;t understand the underlying contents of that data. 
// So JSON is just a way to encode data in a string that can be written to a disk or sent over a network connection.
// But programs just see a string when they read a file or data over a network - 
// so need to parse this data into some format that they understand. 
// This is what JSON allows - it is a structure that computers can decode into objects and types and give meaning to the underlying data.
// So in javascript you want to deal with types, like objects, arrays, strings, numbers etc. 
// These are not held in memory anything like json to the computer. 
// And when you want to send these in memory structures to something else either via a file or over the network you need to 
// JSON.stringify them to convert them to the JSON encoded string. Then on the other end JSON.parse to conver the string back 
// into the in memory objects and types.
// Unfortintually, JSON is based on the javascript object notation (that is literally what it is called) 
// so objects you write in javascript source files look very similar to those in JSON... 
// but they are not the same - JSON is just a text serialisation of the javasciprt objects.

// {
//     "books": [
//       {
//         "isbn": "9781593275846",
//         "title": "Eloquent JavaScript, Second Edition",
//         "subtitle": "A Modern Introduction to Programming",
//         "author": "Marijn Haverbeke",
//         "published": "2014-12-14T00:00:00.000Z",
//         "publisher": "No Starch Press",
//         "pages": 472,
//         "description": "JavaScript lies at the heart of almost every modern web application, from social apps to the newest browser-based games. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.",
//         "website": "http://eloquentjavascript.net/"
//       },
//       {
//         "isbn": "9781449331818",
//         "title": "Learning JavaScript Design Patterns",
//         "subtitle": "A JavaScript and jQuery Developer's Guide",
//         "author": "Addy Osmani",
//         "published": "2012-07-01T00:00:00.000Z",
//         "publisher": "O'Reilly Media",
//         "pages": 254,
//         "description": "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-date with the latest best practices, this book is for you.",
//         "website": "http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/"
//       },
//       {
//         "isbn": "9781449365035",
//         "title": "Speaking JavaScript",
//         "subtitle": "An In-Depth Guide for Programmers",
//         "author": "Axel Rauschmayer",
//         "published": "2014-02-01T00:00:00.000Z",
//         "publisher": "O'Reilly Media",
//         "pages": 460,
//         "description": "Like it or not, JavaScript is everywhere these days-from browser to server to mobile-and now you, too, need to learn the language or dive deeper than you have. This concise book guides you into and through JavaScript, written by a veteran programmer who once found himself in the same position.",
//         "website": "http://speakingjs.com/"
//       },
//       {
//         "isbn": "9781491950296",
//         "title": "Programming JavaScript Applications",
//         "subtitle": "Robust Web Architecture with Node, HTML5, and Modern JS Libraries",
//         "author": "Eric Elliott",
//         "published": "2014-07-01T00:00:00.000Z",
//         "publisher": "O'Reilly Media",
//         "pages": 254,
//         "description": "Take advantage of JavaScript's power to build robust web-scale or enterprise applications that are easy to extend and maintain. By applying the design patterns outlined in this practical book, experienced JavaScript developers will learn how to write flexible and resilient code that's easier-yes, easier-to work with as your code base grows.",
//         "website": "http://chimera.labs.oreilly.com/books/1234000000262/index.html"
//       },
//       {
//         "isbn": "9781593277574",
//         "title": "Understanding ECMAScript 6",
//         "subtitle": "The Definitive Guide for JavaScript Developers",
//         "author": "Nicholas C. Zakas",
//         "published": "2016-09-03T00:00:00.000Z",
//         "publisher": "No Starch Press",
//         "pages": 352,
//         "description": "ECMAScript 6 represents the biggest update to the core of JavaScript in the history of the language. In Understanding ECMAScript 6, expert developer Nicholas C. Zakas provides a complete guide to the object types, syntax, and other exciting changes that ECMAScript 6 brings to JavaScript.",
//         "website": "https://leanpub.com/understandinges6/read"
//       },
//       {
//         "isbn": "9781491904244",
//         "title": "You Don't Know JS",
//         "subtitle": "ES6 & Beyond",
//         "author": "Kyle Simpson",
//         "published": "2015-12-27T00:00:00.000Z",
//         "publisher": "O'Reilly Media",
//         "pages": 278,
//         "description": "No matter how much experience you have with JavaScript, odds are you don’t fully understand the language. As part of the 'You Don’t Know JS' series, this compact guide focuses on new features available in ECMAScript 6 (ES6), the latest version of the standard upon which JavaScript is built.",
//         "website": "https://github.com/getify/You-Dont-Know-JS/tree/master/es6%20&%20beyond"
//       },
//       {
//         "isbn": "9781449325862",
//         "title": "Git Pocket Guide",
//         "subtitle": "A Working Introduction",
//         "author": "Richard E. Silverman",
//         "published": "2013-08-02T00:00:00.000Z",
//         "publisher": "O'Reilly Media",
//         "pages": 234,
//         "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git experience.",
//         "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
//       },
//       {
//         "isbn": "9781449337711",
//         "title": "Designing Evolvable Web APIs with ASP.NET",
//         "subtitle": "Harnessing the Power of the Web",
//         "author": "Glenn Block, et al.",
//         "published": "2014-04-07T00:00:00.000Z",
//         "publisher": "O'Reilly Media",
//         "pages": 538,
//         "description": "Design and build Web APIs for a broad range of clients—including browsers and mobile devices—that can adapt to change over time. This practical, hands-on guide takes you through the theory and tools you need to build evolvable HTTP services with Microsoft’s ASP.NET Web API framework. In the process, you’ll learn how design and implement a real-world Web API.",
//         "website": "http://chimera.labs.oreilly.com/books/1234000001708/index.html"
//       }
//     ]
//   }