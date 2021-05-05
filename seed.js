const mongoose = require('mongoose');
const Book = require('./models/books');


mongoose.connect('mongodb://localhost:27017/projecttest', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongo connected")
    })
    .catch(err => {
        console.log(`mongo error ${err}`)
    })
// const booksSchema = new Schema({
//     title: { type: String }

// })

// const usersSchema = new Schema({
//     username: { type: String },
//     status: { type: Schema.Types.ObjectId, ref: "Status" }
// })

// const statusSchema = new Schema({
//     signDate: { type: Number },
//     users: [{ type: Schema.Types.ObjectId, ref: "User" }],
//     books: [{ type: Schema.Types.ObjectId, ref: "Book" }]
// })

// const Book = new mongoose.model('Book', booksSchema)
// const User = new mongoose.model('User', usersSchema)
// const Status = new mongoose.model('Status', statusSchema)



// const books = [
//     {
//         Title: "book1",
//         Author: "3bdlah",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },

//     {
//         Title: "book2",
//         Author: "3bdlah2",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },
//     {
//         Title: "book3",
//         Author: "3bdlah3",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },
//     {
//         Title: "book4",
//         Author: "3bdlah4",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },
//     {
//         Title: "book5",
//         Author: "3bdlah5",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },
//     {
//         Title: "book6",
//         Author: "3bdlah6",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },
//     {
//         Title: "book7",
//         Author: "3bdlah7",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },
//     {
//         Title: "book8",
//         Author: "3bdlah8",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },
//     {
//         Title: "book9",
//         Author: "3bdlah9",
//         Isbn: 124123214,
//         Category: "math",
//         Price: 42,
//         Description: "gsdgeryurtjfgjtywqqr qwrwtg sdfqwe qsdf "
//     },
// ]

const seedDB = async () => {
    await Book.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const ISBN = Math.floor(Math.random() * 1000000) + 10000;
        const stock = Math.floor(Math.random() * 1) + 10;
        const book = new Book({
            title: `book${i + 1}`,
            author: `3bdlah${i + 1}`,
            image: 'https://source.unsplash.com/collection/430456',
            ISBN,
            category: "math",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            stock
        })
        await book.save();
    }
}
seedDB()

// const users = [
//     {
//         username: 'user1',
//     },
//     {
//         username: 'user2',
//     },
//     {
//         username: 'user3',
//     },
// ]

//DELETE ALL
// const seedDB = async () => {
//     await Book.deleteMany({});
//     await User.deleteMany({});

// }

// seedDB()



// async function addstatusmshanallah() {
//     const firstUser = await User.findById('6051045b0e7fa918b0f49715')

//     const firstBook = await Book.findById('6051045b0e7fa918b0f4970f')

//     const newStatus = await new Status({ books: firstBook._id, signDate: 2020, users: firstUser._id })

//     await newStatus.save()
// }
// addstatusmshanallah()

// async function check3bdlah() {
//     const newStatus2 = await Status.findById('605104ca0607f31ed49e4058')
//     const firstUser = await User.findByIdAndUpdate('6051045b0e7fa918b0f49715', { $set: { status: newStatus2 } })
//     firstUser.save();
// }

// check3bdlah()
// async function populate3blah() {
//     const firstUser = await User.findById('6051045b0e7fa918b0f49715').populate('status')
//     console.log(firstUser);
// }
// populate3blah();
//
// newStatus.save()
//     .then(res => {
//         console.log(res)
//     })
//     .catch(e => {
//         console.log(e)
//     })

