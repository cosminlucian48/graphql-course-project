const User = require ('../models/User');

module.exports = {
    Query: {
        async getUserById(_, { ID}){ //parent, args,
            return await User.findById(ID);
        },
        async getAllUsers(){
            return await User.find();
        }
    },
    Mutation:{
        async registerUser(_, {userInput: {firstName, lastName, email, password}}){
            const createdUser = new User({
                firstName:firstName,
                lastName:lastName,
                email:email,
                createdAt: new Date().toISOString(),
                password:password
            });

            const res = await createdUser.save(); //Mongodb saving

            return {
                id: res.id,
                ...res._doc // I DONT KNOW WHY
            }
        },
        async deleteUser(_, {ID}){
            const res = await User.deleteOne({_id: ID});  // return 3 fields, last beeing deleteCount
            const wasDeleted = res.deletedCount;
            return wasDeleted;
        },
        async editUser(_, {ID, userInput: {firstName, lastName, email, password}}){
            const res = await User.updateOne({_id:ID},{
                lastName:lastName,
                firstName:firstName,
                email:email,
                password:password
            });
            const wasUpdated = res.modifiedCount;
            return wasUpdated;
        }
    }
}