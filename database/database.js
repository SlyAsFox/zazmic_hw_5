const mongoose = require('mongoose');

// const user = ;
// const password = ;
// const db = ;

const connectionString = process.env.MONGO_DATABASE_URL;

class Database {
    static async connect(){
        try{
            return mongoose.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                replicaSet: 'mentorship-shard-0'
            })
        }catch (e) {
            throw e
        }
    }
}

module.exports = Database;