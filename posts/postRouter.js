const express = require("express");
const db = require("./postDb");
const router = express.Router();

router.get("/", (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  db.remove(req.params.id)
    .then(post => {
      res.status(200).end();
    })
    .catch(err => {
      res.status(500).json({
        error: "The post could not be removed."
      });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  const postInfo = req.body;

  if (!postInfo) {
    res.status(400).json({
      error: "Missing post data"
    });
  }

  db.update(req.params.id, postInfo)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({
        error: "The post information could not be modified."
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;

  db.getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "invalid post id" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "There is an error in your request." });
    });
}

module.exports = router;
