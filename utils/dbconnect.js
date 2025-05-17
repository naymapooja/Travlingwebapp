import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect("mongodb+srv://poojadhakad:pooja123@cluster0.reklj.mongodb.net/tour")
        console.log("mogoDB connected successfully", mongoose.connection.host);
    } catch (error) {
        console.log("mongoDB connection is faild", error);

    }
}
export default dbConnect;