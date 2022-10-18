const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}

const password = process.argv[2]
const usrName = process.argv[3]
const usrNum = process.argv[4]

console.log('User name :', usrName);
console.log('User number :', usrNum);


const url = `mongodb+srv://leofullstack:${password}@cluster0.zofgqgo.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name:String,
  number:String,
})

const Person = mongoose.model('Perosn', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    if (usrName && usrNum) {
        const person = new Person({
            name: usrName,
            number: usrNum
        })

        person
            .save()
            .then(() => {
                console.log(`added ${usrName} ${usrNum}`);
                mongoose.connection.close()
            })
    } else {
        console.log('phonebook:');
        Person.find({}).then(result => {
            result.map(p => console.log(p.name, p.number))
        })
        mongoose.connection.close()
    }
    // Note.find({}).then(result => {
    //   result.forEach(note => {
    //     console.log(note)
    //   })
    //   mongoose.connection.close()
    // })
  })
  .catch((err) => console.log(err))