const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");
const ExpressError3=require("./ExpressError3");
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
app.get("/chats", asyncWrap(async(req,res)=>{
  
        let chats=await Chat.find({});
        res.render("index.ejs",{chats});

}));

//new route
app.get("/chats/new",(req,res,)=>{
   
        res.render("new.ejs");
});

//create route
app.post("/chats",asyncWrap(async(req,res)=>{
 
        let {from, to, message}=req.body;
        let newChat= new Chat({
            from:from,
            to:to,
            message:message,
            created_at:new Date(),
        });
     await  newChat.save()//.then((res)=>{console.log("chat was saved");
    
      // }).catch((err)=>{
      //   console.log(err);
      // });
    res.redirect("/chats");
 
}));

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch(err=>next(err));
        
    }
}


// Middleware to check for valid ObjectId
app.use('/chats/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ExpressError3(400, "Invalid ID format"));
    }
    next();
});



//show route
app.get("/chats/:id",asyncWrap(async(req,res,next)=>{
    
        let{id}=req.params;
        let chat=await Chat.findById(id);
        if(!chat){
            next(new ExpressError3("404","Sorry! This page is not found"));
        }
        res.render("edit.ejs",{chat});



}));
//Edit route
app.get("/chats/:id/edit",asyncWrap(async(req,res)=>{
  
        let{id}=req.params;
        let chat=  await Chat.findById(id);
        res.render("edit.ejs",{chat});

}));
//update route
app.put("/chats/:id",asyncWrap(async(req,res)=>{
   
        let{id}= req.params;
        let{message:newMessage}= req.body;
        let updatedChat= await Chat.findByIdAndUpdate(id,{message:newMessage},{runValidators:true},{new:true}).then((res)=>{
            console.log("it is edited");
        }).catch((err)=>{
            console.log(err);
        });
        console.log(updatedChat);
        console.log("this is new message"+newMessage);
        res.redirect("/chats");
    
   
}));
//delete route
app.delete("/chats/:id",asyncWrap(async(req,res)=>{
   
        let{id}=req.params;
        try{
    await Chat.findByIdAndDelete(id);
    console.log("This is deleted!!");
        }catch(err){
    console.log(err);
        }
        res.redirect("/chats");
    }  
));
   

app.get("/",(req,res)=>{
    res.send("root is working");
});
const handleValidationError=(err)=>{
     console.log("This was a validation Error");
console.dir(err);
return err;
}

app.use((err,req,res,next)=>{
console.log(err.name);
if(err.name==="Validation"){

    err=handleValidationError(err);
}
next(err);
});
//Error Handling Middleware
app.use((err,req,res,next)=>{
let{status=500,message="Some Error Occured"}=err;
res.status(status).send(message);
});
app.listen(8087,()=>{
    console.log("app is listening");
});

