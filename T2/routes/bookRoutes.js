var express = require('express');

var routes = function(Book){
  var bookRouter = express.Router();

  bookRouter.route('/')
    .post(function(req, res){
      var book = new Book(req.body);
      book.save();

      res.status(201).send(book);
    })
    .get(function(req, res){
      var query = {}

      if(req.query.genre) {
        query.genre = req.query.genre;
      }

      Book.find(query, function(error, books){
          if (error) {
            res.status(500).send(error);
          } else if (books.length > 0) {
            var booksWithLinks = []

            books.forEach(function(element, index, array){
              var bookJson = element.toJSON();

              bookJson.links = {};
              bookJson.links.self = "http://" + req.headers.host + "/api/books/"
                                    + bookJson._id;

              booksWithLinks.push(bookJson);
            });

            res.json(booksWithLinks);
          } else {
            res.status(404).send({error: "No books found"
                                  + req.query.genre ? "with genre '" + query.genre + "'" : ""});
          }
        });
      });

  bookRouter.use('/:bookId', function(req, res, next){
    Book.findById(req.params.bookId, function(error, book){
      if (error) {
        res.status(500).send(error);
      } else if (book) {
        req.book = book;
        next();
      } else {
        res.status(404).send("Book not found.");
      }
    });
  });
  bookRouter.route('/:bookId')
      .get(function(req, res){
        var bookJson = req.book.toJSON();

        var filterByThisGenreLink = "http://" + req.headers.host + "/api/books?genre="
                              + bookJson.genre;

        bookJson.links = {};
        bookJson.links.FilterByThisGenre = filterByThisGenreLink.replace(" ", "%20");

        res.json(bookJson);
      })
      .put(function(req, res){
        req.book.title = req.body.title;
        req.book.author = req.body.author;
        req.book.genre = req.body.genre;
        req.book.read = req.body.read;

        req.book.save(function(error){
          if (error) {
            res.status(404).send(error);
          } else {
            res.json(req.book);
          }
        });
      })
      .patch(function(req, res){
        if (req.body._id) {
          delete req.body._id;
        }

        for(var key in req.body) {
          req.book[key] = req.body[key];
        }

        req.book.save(function(error){
          if (error) {
            res.status(404).send(error);
          } else {
            res.json(req.book);
          }
        });
      })
      .delete(function(req, res){
        req.book.remove(function(error){
          if (error) {
            res.status(500).send(error);
          } else {
            res.status(204).send("Removed");
          }
        });
      });

  return bookRouter;
};

module.exports = routes;
