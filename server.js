const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:sudosu@projetodesafio-znyj5.gcp.mongodb.net/test?retryWrites=true&w=majority"

var porta = process.env.PORT || 8080;

MongoClient.connect(uri, (err, client) => {
	if (err) return console.log(err)
	db=client.db('projetodesafio')
  // ... start the server
    
    app.listen(porta, () => {
	console.log('server running on port 3000')
	})

})

app.use(bodyParser.urlencoded({ extended: true}))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().sort({name:1}).toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs',{ data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('data').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
    })
})

app.route('/edit/:id')

	.get((req, res) => {
		var id = req.params.id
		var ObjectId = require('mongodb').ObjectId;

		db.collection('data').find(ObjectId(id)).toArray((err, result) => {
			if (err) return res.send(err)
				res.render('edit.ejs', {data: result})
		})
	})

	.post((req, res) => {
		var id = req.params.id
		var name = req.body.name
		var surname = req.body.surname
		var regime = req.body.regime
		var endereco = req.body.endereco
		var telefone = req.body.telefone
		var ObjectId = require('mongodb').ObjectId;

		db.collection('data').updateOne({_id: ObjectId(id)}, {
		$set: {
			name: name,
			surname: surname,
			regime: regime,
			endereco: endereco,
			telefone: telefone
			}
		}, (err, result) => {
			if (err) return res.sen(err)
			res.redirect('/show')
			console.log('Atualizado com sucesso!')
		})															
	})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id;
  var ObjectId = require('mongodb').ObjectId;

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})
