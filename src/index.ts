import "reflect-metadata";
import { createConnection } from "typeorm"; // For creating connections
import { User } from "./entity/User"; // Import this entity
import express, { Request, Response } from "express";
import { Post } from "./entity/Post";
import { validate } from "class-validator"; // DO NOT FORGET THIS WHEN USING VALIDATION

const app = express();
app.use(express.json()); // Really don't know what this does...yet...?

// CREATE (Try this on postman POST at https://localhost:5000/users with raw json name, email, role)
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, role } = req.body; // Will get the name. email, role from json request

  try {
    const user = User.create({ name, email, role }); // Will create a User entity using the fields name, email, role

    const errors = await validate(user); // Will get errors if there are any

    // Will throw errors if there is any
    if (errors.length > 0) {
      throw errors;
    }

    await user.save(); // Will actually save that to database

    return res.status(201).json(user); // Will return a json response of status 201 and fata of created user
  } catch (err) {
    // Just for errors
    console.log(err);

    return res.status(500).json(err);
  }
});

// READ
app.get("/users", async (_: Request, res: Response) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
});

// UPDATE
// PUT uuid in URL
app.put("/user/:uuid", async (req: Request, res: Response) => {
  const uuid = req.params.uuid; // Dunno I guess to get UUID?

  const { name, email, role } = req.body;

  try {
    const user = await User.findOneOrFail({ uuid }); // Will fiind or return error using uuid=uuid

    user.name = name || user.name; // Manual way of assigning value to fields even if none is passed
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    return res.json(user);
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
});

// DELETE
// Change put to delete
app.delete("/user/:uuid", async (req: Request, res: Response) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.findOneOrFail({ uuid });

    await user.remove(); // Insted of save just remove()

    return res.status(204).json({ message: "User deleted succesfully!" }); // Change json response
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
});

// FIND
// For find just get and show user
app.get("/user/:uuid", async (req: Request, res: Response) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.findOneOrFail({ uuid });

    return res.json(user);
  } catch (err) {
    console.log(err);

    return res.status(404).json(err);
  }
});

// CREATE Post
app.post("/posts", async (req: Request, res: Response) => {
  const { userUUID, title, body } = req.body; // Add an extra field for userUUID

  try {
    const user = await User.findOneOrFail({ uuid: userUUID });

    const post = new Post({ title, body, user }); // This is possible if you have a constructor also don't forget the user

    await post.save();

    return res.json(post);
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
});

// READ Posts
app.get("/posts", async (_: Request, res: Response) => {
  try {
    // Will get the users in each post
    // const posts = await Post.find({ relations: ["user"] });

    // Will get the posts of each user
    const users = await User.find({ relations: ["posts"] });

    return res.json(users);
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
});

// This is the main index file
createConnection()
  .then(async (connection) => {
    // const user = new User(); // Creates a new User Entity but does not save it yet
    // // Assigning Values to the fields in User/user
    // user.name = "Arvin Bareng";
    // user.email = "ambareng@test.com";
    // user.role = "admin";
    // await user.save(); // Saves this to database actually
    // console.log("User Created!");

    // Will listen in port 5000
    app.listen(5000, () => console.log("Server Up at http://localhost:5000"));
  })
  .catch((error) => console.log(error));
