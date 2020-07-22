const express = require('express')
const Joi = require('joi')

const app = express()
app.use(express.json())


const users = [
{
	id: 1,
	firstname: "Jhon",
	lastname: "Reese" 
},
{
	id: 2,
	firstname: "Harold",
	lastname: "Finch" 
},
{
	id: 3,
	firstname: "Joss",
	lastname: "Carter" 
},
{
	id: 4,
	firstname: "Fusco",
	lastname: "Lionell" 
}]

//Joi schema validation
const schema = Joi.object({
	firstname: Joi.string().alphanum().min(3).max(18).required(),
	lastname: Joi.string().alphanum().min(3).max(18).required()
})


app.get('/',(req, res) => {
	res.send('Welcome');
});


//-----------READ------------

//GET /api/users/  -> shows list of users
app.get('/api/users', (req, res) => {
	res.send(users);
});

//GET /api/users/id -> shows user with requested id
app.get('/api/users/:id', (req, res) => {
	let user = users.find(u => u.id === parseInt(req.params.id));
	if(!user)
		res.status(404).send();
	res.send(user);
})



//----------CREATE-----------

//POST /api/users -> inserts a new user
app.post('/api/users', async (req, res) => {
	try {
  	const value = await schema.validateAsync(req.body);
	}
	catch (err) { 
		res.status(400).send(err.details[0].message)
		return;
	}

	let userObj = {
		id: users.length+1,
		firstname: req.body.firstname,
		lastname: req.body.lastname
	}
	users.push(userObj);
	res.send(userObj);
});



//------------UPDATE------------

//PUT /api/users/id -> updates existing user info
app.put('/api/users/:id', async (req, res) => {

	let user = users.find(u => u.id === parseInt(req.params.id));
	if(!user){
		res.status(404).send("user with id:"+ req.params.id +" doesn't exist!!");
		return;
	}
	
	try {
    const value = await schema.validateAsync(req.body);
	}
	catch (err) { 
		res.status(400).send(err.details[0].message)
		return;
	}

	user.firstname = req.body.firstname
	user.lastname = req.body.lastname

	res.send(user)
})


//------------DELETE------------

//DELETE /api/users/id -> deletes a user
app.delete('/api/users/:id', async (req, res) => {

	let user = users.find(u => u.id === parseInt(req.params.id));
	if(!user){
		res.status(404).send("user with id:"+ req.params.id +" doesn't exist!!");
		return;
	}
	
	let pos = users.indexOf(user)
	users.splice(pos, 1)

	res.send(user)
})




const port = process.env.PORT || 3000;
let server = app.listen(port, () => {
	let host = server.address().address;
	let port = server.address().port;
	console.log(host+" "+port);
})