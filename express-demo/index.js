const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const logger = require('./logger'); // './' means current folder
const authenticate = require('./authenticate'); // in current folder
const express = require('express'); 
const app = express();

 
app.use(express.json()); //adding and using middleware
// json is a middle ware and parses the body of the request 
//req prossessing pipeline... request -> middleware -> middleware -> ... -> response
// req -> json() -> route() -> ... -> res
app.use(express.urlencoded({extended: true}));  // key=value&key=value and parses like req.body  extended: true means we can pass arrays using url encoded formats
app.use(express.static('public')); //css images and other static assets inside the public forlder
app.use(helmet());

if (app.get('env') === 'development'){
    app.use(morgan('tiny')); // if we are in a developmental environment, we will enable the http logging from morgan
    //console.log(`app: ${app.get('env')}`);
    console.log('Morgan enabled');
}

app.use(logger);
app.use(authenticate);

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'}

];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

//app.post creates new course
app.post('/api/courses', (req,res) => {
    
    const { error } = validateCourse(req.body); //object destructuring equivalent to result.error
    if(error)return res.status(400).send(error.details[0].message);
   
    const course = {
        id: courses.length + 1, 
        name: req.body.name 
    };
    courses.push(course);
    res.send(course);
});

//app.put for updating resources 
app.put('/api/courses/:id', (req,res) => {


    //look up the course
    //if not existing, return 404
    const course = courses.find (c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).send('The course with the given ID is not found');
        
   

    //validate 
    //if valid, return 400 -bad request
    const { error } = validateCourse(req.body); //object destructuring equivalent to result.error
    if(error) return res.status(400).send(error.details[0].message);

    //update course
    //return the updated course 
    course.name = req.body.name;
    res.send(course);

});

//validation logic
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    

     return Joi.validate(course, schema);

}

app.delete('/api/courses/:id', (req, res) => {
    //look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).send('The course with the given ID is not found');

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return the same course
    res.send(course);
});

app.get('/api/courses/:id' , (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id)); 
    if (!course) return res.status(404).send('The couse with the given ID is not found.');
    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));