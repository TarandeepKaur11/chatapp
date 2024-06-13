const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");
const { AsyncLocalStorage } = require("async_hooks");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
main().then(()=>{
    console.log("connection successful");
}).catch(err=>console.log(err));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//INDES ROUTE
app.get("/chats", async (req,res)=>{
    let chats= await Chat.find();
  
   
    res.render("index.ejs",{chats});
});
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
});
app.post("/chats",(req,res)=>{
    let {from, to, message}=req.body;
    let newChat= new Chat({
        from:from,
        to:to,
        message:message,
        created_at:new Date()
    });
   newChat.save().then((res)=>{console.log("chat was saved");

   }).catch((err)=>{
     console.log(err);
   });
res.redirect("/chats");
});
//Edit route
app.get("/chats/:id/edit",async(req,res)=>{
    let{id}=req.params;
    let chat=  await Chat.findById(id);
    res.render("edit.ejs",{chat});
});
//update route
app.put("/chats/:id",(req,res)=>{
    let{id}= req.params;
    let{message:newMessage}= req.body;
    let updatedChat=Chat.findByIdAndUpdate(id,{message:newMessage},{runValidators:true},{new:true}).then((res)=>{
        console.log("it is edited");
    }).catch((err)=>{
        console.log(err);
    });
    console.log(updatedChat);
    console.log("this is new message"+newMessage);
    res.redirect("/chats");
});
//delete route
app.delete("/chats/:id",async(req,res)=>{
    let{id}=req.params;
    try{
await Chat.findByIdAndDelete(id);
console.log("This is deleted!!");
    }catch(err){
console.log(err);
    }
    res.redirect("/chats");
});
   

app.get("/",(req,res)=>{
    res.send("root is working");
});
app.listen(8087,()=>{
    console.log("app is listening");
});
