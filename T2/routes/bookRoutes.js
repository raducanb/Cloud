var url = require('url'),
  qs = require('querystring'),
  Book = require('../models/bookModel');

module.exports.handleRouteCall =
  function (req, res) {
    var regExpBook = new RegExp("/api/books/([a-zA-Z0-9]+)/*$");
    var purl = url.parse(req.url, true);

    if (purl.pathname == '/api/books'
      || purl.pathname == '/api/books/') {
      if (purl.query.genre) {
        genrePath(req, purl.query.genre, function(response){
        sendResponse(res, response);
        });
      }
      simplePath(req, function (response) {
        sendResponse(res, response);
      });
    } else if (regExpBook.test(purl.pathname)) {
      var match = regExpBook.exec(purl.pathname);
      bookPath(req, match[1], function (response) {
        sendResponse(res, response);
      })
    }
  };

var sendResponse = function (res, response) {
  res.writeHead(response.code);
  res.end(JSON.stringify(response.data, null, ' '))
}

var simplePath = function (req, callback) {
  if (req.method == 'GET') {
    getBooks(req.headers.host, null, callback);
  } else if (req.method == 'POST') {
    var body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      if (post.__v) {
        delete post.__v;
      }
      var book = new Book(post);
      book.save();
      callback({
        code: 201,
        data: book
      });
    });
  }
};

var bookPath = function (req, bookId, callback) {
  if (req.method == 'GET') {
    Book.findById(bookId, function (error, book) {
      if (error) {
        callback({
          code: 500,
          data: error
        });
      } else if (book) {
        var bookJson = book.toJSON();
        var filterByThisGenreLink = "http://" + req.headers.host + "/api/books?genre="
          + bookJson.genre;
        bookJson.links = {};
        bookJson.links.FilterByThisGenre = filterByThisGenreLink.replace(" ", "%20");
        callback({
          code: 200,
          data: bookJson
        })
      } else {
        callback({
          code: 404,
          data: "Book not found"
        });
      }
    });
  } else if (req.method == 'PUT') {
    var body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      Book.findById(bookId, function (error, book) {
        if (error) {
          callback({
            code: 500,
            data: error
          });
        } else if (book) {
          book.title = post.title;
          book.author = post.author;
          book.genre = post.genre;
          book.read = post.read;
          book.save(function (error) {
            if (error) {
              callback({
                code: 404,
                data: error
              })
            } else {
              callback({
                code: 200,
                data: book.toJSON()
              })
            }
          });
        } else {
          callback({
            code: 404,
            data: "Book not found"
          });
        }
      });
    });
  } else if (req.method == 'PATCH') {
    var body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      var post = qs.parse(body);
      Book.findById(bookId, function (error, book) {
        if (error) {
          callback({
            code: 500,
            data: error
          });
        } else if (book) {
          if (post._id) {
            delete post._id;
          }
          for (var key in post) {
            book[key] = post[key];
          }
          book.save(function (error) {
            if (error) {
              callback({
                code: 404,
                data: error
              })
            } else {
              callback({
                code: 200,
                data: book.toJSON()
              })
            }
          });
        }
      })
    });
  } else if (req.method == 'DELETE') {
    Book.findById(bookId, function (error, book) {
      if (error) {
        callback({
          code: 500,
          data: error
        });
      } else if (book) {
        book.remove(function (error) {
          if (error) {
            callback({
              code: 500,
              data: error
            });
          } else {
            callback({
              code: 204,
              data: "Removed"
            });
          }
        })
      }
    });
  }
}

var genrePath = function (req, genre, callback) {
  if (req.method == 'GET') {
    getBooks(req.headers.host, genre, callback);
  }
}

var getBooks = function (host, genre, callback) {
  var query = {}
  if (genre) {
    query.genre = genre;
  }

  Book.find(query, function (error, books) {
    if (error) {
      callback({
        code: 500,
        data: error
      });
    } else if (books.length > 0) {
      var booksWithLinks = []

      books.forEach(function (element, index, array) {
        var bookJson = element.toJSON();

        bookJson.links = {};
        bookJson.links.self = "http://" + host + "/api/books/"
          + bookJson._id;

        booksWithLinks.push(bookJson);
      });
      callback({
        code: 200,
        data: booksWithLinks
      });
    } else {
      callback({
        code: 404,
        data: {
          error: "No books found"
            + req.query.genre ? "with genre '" + query.genre + "'" : ""
        }
      });
    }
  });
}
