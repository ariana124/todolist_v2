const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// This is what creates the todolist database and it opens it on port 27017.
mongoose.connect("mongodb://localhost:27017/todolistDB", { useUnifiedTopology: true });

const itemsSchema = {
  name: String
};

// Good practice to have mongoose models capitalized.
// The first argument is the singular version of the collections name and the second argument is the schema you are going to use.
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Get food"
});

const item2 = new Item ({
  name: "Complete the mongoose udemy module"
});

const item3 = new Item ({
  name: "Hit the + button to add a new item"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  const day = date.getDate();

  // Empty curly braces means find all the items in the collection.
  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to the database.");
        }
      });
      // When the foundItems array is empty it will fall into the if statement and add the 3 default items to the list.
      // Then we direct it back to the home route and it if the foundItems is not empty it will fall into the else statement and render the items on the page.
      res.redirect("/");
    } else {
        res.render("list", {listTitle: day, newListItems: foundItems});
    }
  })

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
