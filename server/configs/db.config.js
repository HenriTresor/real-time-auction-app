const mongoose = require('mongoose')


const db = mongoose.connection

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connected to mongoodb successfully'))
    .catch((err) => {
        console.log('error connecting to mongoodb:', err.message);
        db.close()
        process.exit(0)
})


db.on('disconnect', () => {
    console.log('disconnected from mongoodb');
})
