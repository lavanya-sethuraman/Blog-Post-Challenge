const express = require('express');
const router = express.Router();
const moment = require('moment');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require ('./models');

BlogPosts.create('WWE superstar', 'My favorite WWE superstar is John Cena.', 'Jaden','2017-04-04');
BlogPosts.create('Aaron rodgers', 'Aaron Rodgers is the quarterback for the Green Bay Packers.', 'Jaden','2017-04-05');
BlogPosts.create('Neil Armstrong', 'Neil Armstrong is a very famous astronaut.', 'Jaden','2017-04-06');
BlogPosts.create('Book: The view from Saturday', 'It is a two time Newbery Medal Award Winner.', 'Jaden','2017-04-07');

router.get('/', (req,res) => {
 res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content' , 'author','publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author,req.body.publishDate);
  res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id','title', 'content','author','publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({id: req.body.id,title: req.body.title,content: req.body.content,author: req.body.author,
    publishDate:moment(req.body.publishDate).format('YYYY-MM-DD')});
  res.status(200).json(updatedItem);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog \`${req.params.id}\``);
  res.status(204).end();
});


module.exports = router;
