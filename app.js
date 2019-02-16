//Sanitizing the data require only at two places as user is entering data only at two places- 1st place Edit route and 2nd one is Update Route
//<%- %> if user enter the code(like html or js) instead of his plain content text then this(i.e. <%- %>) will return the changes on the respect
//ive return page....(see line 17 in edit.ejs file webDevBackend>views>edit.ejs)
//A user may enter script tag in form instead of plain text(or html as it not harm our site) to harm our site but by using espress-sanitizer we get
//rid from this problem (see in this app.js file)
var express    = require("express"),
    bodyparser = require("body-parser"),
    Mongoose   = require("mongoose"),
    expresSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    app        = express();
//App configuration
Mongoose.connect("mongodb://localhost:27017/blogapp", function(err, success){
   if(err){
       console.log("Error with connection");
   }else{
       console.log("Fine0");
   }
});
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(expresSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

//Mongo Model configuration
var blogSchema = new Mongoose.Schema({
    name: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = Mongoose.model("Blog", blogSchema);

// Blog.create({
//     name: "lona",
//     image: "https://images.unsplash.com/photo-1541348263662-e068662d82af?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b58ecb83df5c508d1cfabfa1f287330c&auto=format&fit=crop&w=500&q=60",
//     body: "Audi is just looking amazing"
// },function(err, success){
//     if(err){
//         console.log("there is some error with the create function");
//     }else{
//         console.log("fine1");
//     }
// });

//RESTful Routes

//Index route
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        }else{
            res.render("index", {blogs: blogs});
        }
    });

});

//New route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//Create Route
app.post("/blogs", function(req, res){
//santizing the user entered data
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log("something is going wrong.....");
        }else{
            res.redirect("/blogs");
        }
    });
});

//Show Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("something is going wrong");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});


//Edit Route
app.get("/blogs/:id/edit", function(req, res){

    Blog.findById(req.params.id, function(err,data){
        if(err){
            console.log("Error !");
        }else{
            res.render("edit", {blog: data});
        }
    });
});

// update route is like the COMBO of Show and Edit route
//Update Route
app.put("/blogs/:id", function(req, res){
  //Sanitizing the user entered data   
  req.body.blog.body = req.sanitize(req.body.blog.body);  
    // findByIdAndUpdate- it will take 3 arguments(id, newData, Callback)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, newUpdatedData){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Delete Route
//destroy 
//redirect to somewhere
app.delete("/blogs/:id" ,function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("There is some Error with Delete Route......");
        }else{
            res.redirect("/blogs");
        }
    });
});



app.listen(5656, function(req, res){
    console.log("server is working");
});