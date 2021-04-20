const express = require('express');
const app = express();

const config = require('config');
const debug = require('debug')('app:startup');

const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');

const logger = require('./logger');
const auth = require('./auth');

app.set('view engine', 'pug');
app.set('views', './views'); //default

console.log('Node_ENV', process.env.NODE_ENV);
console.log(`app: ${app.get('env')}`);

//third parties middleware
app.use(express.json()); //req.body
app.use(express.urlencoded({extended: true})); //key=value&key=value  req.body
app.use(express.static('public'));
app.use(helmet());

//custom middleware
app.use(logger);
app.use(auth);

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...'); // console.log()
}


// console.log('App name:' + config.get('name'));
// console.log('Mail server:' + config.get('mail.host'));
// console.log('Mail password:' + config.get('mail.password'));



const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
];

app.get('/', (req, res) => {
    // res.send('Hello World!!!');
    //for template engine
    res.render('index', {title: 'My Express App', message: 'hello'});
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//POST

app.post('/api/courses', (req, res) => {

    const result = validateCourse(req.body);

    if(result.error) {
        //400 Bad request
        res.status(400).send(result.error.details[0].message);
        return false;
    }

    const course = {
      id: courses.length + 1,
      name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

// /api/courses/1

//GET

app.get('/api/courses/:id', (req, res) => {

    //v1 -- find (return the first element which satisfies the provided testing function.
    const course = courses.find((item) => {
        return item.id === parseInt(req.params.id);
    });
    if(!course) {
        //404
        res.status(404).send('The course with the given ID was not found');
        return false;
    } else {
        res.send(course);
    }
});

//PUT

app.put('/api/courses/:id', (req, res) => {
    //look up the course
    //if not existing, return 404
    const course = courses.find((item) => {
        return item.id === parseInt(req.params.id);
    });
    if(!course) {
        //404
        res.status(404).send('The course with the given ID was not found');
        return false;
    }

    //validate
    //if invalid, return 400 - bad request
    const result = validateCourse(req.body);

    if(result.error) {
        //400 Bad request
        res.status(400).send(result.error.details[0].message);
        return false;
    }

    //update course
    //return the updated course
    course.name = req.body.name;
    res.send(course);

});

//DELETE

app.delete('/api/courses/:id', (req, res) => {
    //look up the course
    //not existing, return 404

    const course = courses.find((item) => {
        return item.id === parseInt(req.params.id);
    });
    if(!course) {
        //404
        res.status(404).send('The course with the given ID was not found');
        return false;
    }

    //delete

    let index = courses.indexOf(course);
    courses.splice(index, 1);
    // const newCourses = courses.slice(0, index).concat(courses.slice(index + 1, courses.length));

    //return the same course

    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);

}

    //v2 -- filter (return array which satisfies the provided testing function)
    // const course = courses.filter((item) => {
    //     return item.id === parseInt(req.params.id);
    // });
    // if(!course) {
    //     //404
    //     res.status(404).send('The course with the given ID was not found');
    // } else {
    //     res.send(course);
    // }

    //v3 -- for clasic (return elements which satisfies the provided testing function)

// function getCourse(item) {
//     for(let i in courses) {
//         if(courses[i].id === parseInt(req.params.id)) {
//             item = courses[i];
//         }
//     }
//     return item;
// }
//
// const movie = getMovie();
//

    // if(!course) {
    //     res.status(404).send('The course with the given ID was not found');
    // } else {
    //     res.send(course);
    // }



//PORT

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
// app.listen(3000, () => console.log('Listening…on port 3000'));
