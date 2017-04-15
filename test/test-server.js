const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const {app, runServer, closeServer} = require('../server');

const should = chai.should();


chai.use(chaiHttp);


describe('Blog Post', function() {

  
  before(function() {
    return runServer();
  });

  
  after(function() {
    return closeServer();
  });

  
  it('should list blogs on GET', function() {
   
    return chai.request(app)
      .get('/blogposts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        
        const expectedKeys = ['id','title', 'content', 'author','publishDate'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  
  it('should add a blog on POST', function() {
    
    const newItem = {title: 'Aaron Rogers', content: 'quarter-back',author:'Tom',publishDate:'2017-04-11'};
    
    return chai.request(app)
      .post('/blogposts')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id','title', 'content', 'author','publishDate');
        res.body.id.should.not.be.null;
        newItem.publishDate = moment('2017-04-11').format("YYYY-MM-DD");
        res.body.should.deep.equal(Object.assign({id: res.body.id},newItem));
      });
  });

  
  it('should update a blog on PUT', function() {
  
    const updateData = { title: 'Aaron Rogers', content: 'quarter-back',author:'Tom',publishDate:'2017-04-11' };

    return chai.request(app)
      
      .get('/blogposts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blogposts/${updateData.id}`)
          .send(updateData);
      })
      
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        updateData.publishDate = moment('2017-04-11').format("YYYY-MM-DD");
        res.body.should.deep.equal(updateData);
      });
  });

  it('should delete a blog on DELETE', function() {
    return chai.request(app)
      
      .get('/blogposts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blogposts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});


 