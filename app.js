const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/views/date.js");
const _ = require("lodash");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/assets", express.static("assets"));

//db code

mongoose.connect("mongodb://localhost:27017/todoDB").then(() => {
  console.log(" db connected successfully");
});

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [todoSchema],
});
const Item = mongoose.model("item", todoSchema);
const List = mongoose.model("List", listSchema);

//routing
app.get("/", function (req, res) {
  const day = date.getdate();
  Item.find()
    .then((todoitem) => {
      res.render("list", { listTitle: day, newListItems: todoitem });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/:customList", function (req, res) {
  const CustomList = _.capitalize(req.params.customList);
  List.findOne({ name: CustomList })
    .then((foundlist) => {
      if (foundlist) {
        res.render("list", {
          listTitle: foundlist.name,
          newListItems: foundlist.items,
        });
      } else {
        const list = new List({
          name: CustomList,
          items: [],
        });
        list.save();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  const day = date.getDayName();

  const item = req.body.newitem;
  if (req.body.List == day + ",") {
    Item.insertMany({ name: item })
      .then(() => {
        console.log("task inserted in todo list");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  } else {
    List.findOne({ name: req.body.List })
      .then((foundlist) => {
        foundlist.items.push({ name: item });
        foundlist.save();
        res.redirect("/" + req.body.List);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/delete", (req, res) => {
  const deleteId = req.body.checkDelete;
  const day = date.getDayName();
  if (req.body.listname == day + ",") {
    Item.deleteOne({ _id: deleteId })
      .then(() => {
        console.log("deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  }
  else
  {
    List.findOneAndUpdate({name:req.body.listname},{$pull: {items: {_id:deleteId}}}).then(()=>{
      res.redirect("/"+req.body.listname);
    }).catch((err)=>{
      console.log(err);
    });
  }
});
app.listen(5000, function () {
  console.log("Server started on port 5000.");
});
//end
