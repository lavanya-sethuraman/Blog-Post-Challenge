const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require ('./models');
const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

BlogPosts.create('WWE superstar', 'My favorite WWE superstar is John Cena.', 'Jaden','04-04-16');
BlogPosts.create('Aaron rodgers', 'Aaron Rodgers is the quarterback for the Green Bay Packers.', 'Jaden','05-04-16');
BlogPosts.create('Neil Armstrong', 'Neil Armstrong is a very famous astronaut.', 'Jaden','06-04-16');
BlogPosts.create('Book: The view from Saturday', 'It is a two time Newbery Medal Award Winner.', 'Jaden','07-04-16');

app.get('/blogposts', (req,res) => {
 res.json(BlogPosts.get());
});

app.post('/blogposts', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content' , 'author','publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

app.put('/blogposts/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content','author','publishDate' ,'id'];
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
  console.log(`Updating recipe item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).json(updatedItem);
});

app.delete('/blogPosts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted recipe \`${req.params.ID}\``);
  res.status(204).end();
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
