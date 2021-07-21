const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");

const Url = require("../models/urls");

exports.getHome = (req, res, next) => {
  res.render("home", {
    pageTitle: "Url Shorterner",
    path: "/",
  });
};

exports.getRedirct = (req, res, next) => {
  const code = req.params.redirect;
  Url.findOne({ urlCode: code })
    .then((url) => {
      if (!url) {
        return res.render("404", {
          pageTitle: "Page not found",
          path: "",
        });
      }
      return res.redirect(url.longUrl);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postShorten = async (req, res, next) => {
  const lUrl = req.body.lUrl;
  let sUrl;
  let code = req.body.code;
  let url;
  let msg = null;

  if (code) url = await Url.findOne({ urlCode: code });

  try {
    if (url && url.longUrl != lUrl) {
      // code is associated with other link
      return res.render("error", {
        pageTitle: "Error",
        path: "/error",
        msg: "Short name already exists. If you're not sure, you can use our default name",
      });
    } else if (url && url.longUrl == lUrl) {
      // code is associated with this link => returning the page
      return res.render("result", {
        pageTitle: "Shorten Url",
        path: "/result",
        url: url.shortUrl,
        msg: null,
      });
    } else {
      if (!code) //code is not provided
        code = shortid.generate();
      else
        msg = "This url is already shorten here, to reduce redundancy please use this link";

      // sUrl = window.location.href + "/" + code; //=> window undifined
      // sUrl = 'http://localhost:3000' + "/" + code; //=> static

      // console.log(req.protocol); //=> http
      // console.log(req.get("host")); //=> localhost:3000
      // console.log(req.originalUrl); //=> /shorten

      const host = req.protocol + "://" + req.get("host"); //=> http :// localhost:3000
      sUrl = host + "/" + code;

      if (validUrl.isUri(lUrl)) {
        url = await Url.findOne({ longUrl: lUrl });
        if (!url) {
          url = new Url({
            longUrl: lUrl,
            shortUrl: sUrl,
            urlCode: code,
            date: new Date(),
          });
          await url.save();
        }
        return res.render("result", {
          pageTitle: "Shorten Url",
          path: "/result",
          url: url.shortUrl,
          msg: msg,
        });
      } else {
        return res.render("error", {
          pageTitle: "Error",
          path: "/error",
          msg: "Invalid long url",
        });
      }
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// exports.postShorten = (req, res, next) => {
//   const lUrl = req.body.lUrl;
//   let sUrl;
//   let code = req.body.code;

//   if (code) {
//     Url.findOne({ urlCode: code })
//       .then((url) => {
//         if (url && url.longUrl != lUrl) {
//           res.render("error", {
//             pageTitle: "Error",
//             path: "/error",
//             msg: "Short name already exists. If you're not sure, you can use our default name",
//           });
//         }
//       })
//       .catch((err) => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   }

//   if (!code) code = shortid.generate();

//   // sUrl = window.location.href + "/" + code; //=> window undifined
//   // sUrl = 'http://localhost:3000' + "/" + code; //=> static

//   // console.log(req.protocol); //=> http
//   // console.log(req.get("host")); //=> localhost:3000
//   // console.log(req.originalUrl); //=> /shorten

//   const host = req.protocol + "://" + req.get("host"); //=> http :// localhost:3000
//   sUrl = host + "/" + code;

//   if (validUrl.isUri(lUrl)) {
//     Url.findOne({ longUrl: lUrl })
//       .then((url) => {
//         if (!url) {
//           url = new Url({
//             longUrl: lUrl,
//             shortUrl: sUrl,
//             urlCode: code,
//             date: new Date(),
//           });
//         }
//         return url;
//       })
//       .then((url) => {
//         url.save().then((result) => {
//           return res.render("result", {
//             pageTitle: "Shorten Url",
//             path: "/result",
//             url: url.shortUrl,
//           });
//         });
//       })
//       .catch((err) => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   } else {
//     return res.render("error", {
//       pageTitle: "Error",
//       path: "/error",
//       msg: "Invalid long url",
//     });
//   }
// };
