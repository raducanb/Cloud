//mongo 127.0.0.1:27017/bookAPI --quiet populatedb.js
db.books.insert({title:"Morometii",
                 author:"Liviu Rebreanu", 
                 genre:"Drama"});
db.books.insert({title:"Baltagul",
                 author:"Mihail Sadoveanu", 
                 genre:"Drama",
                 read: true});