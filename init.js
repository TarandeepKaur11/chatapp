const mongoose=require("mongoose");
const Chat=require("./models/chat.js");
main().then(()=>{
    console.log("connection successful");
}).catch(err=>console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}
    let allChats=[{
        from:"neha",
        to:"priya",
        message:"send me your exam sheets",
        created_at:new Date()
    },{
        from:"rohit",
        to:"mohit",
        message:"teach me JS callbacks",
        created_at:new Date(),
    },{
        from:"amit",
        to:"sumit",
        message:"all the best for your exam",
        created_at:new Date(),  
    },
    {
        from:"tony",
        to:"Peter",
        message:"Love you 3000",
        created_at:new Date(),
    }
];
   
Chat.insertMany(allChats);