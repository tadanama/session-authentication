import express from "express";
import session from "express-session";
import env from "dotenv";

// Allow access to the environment variables inside .env file through process.env.VARIABLE_NAME
env.config();

const app = express();
const port = 3000;

// Set and configure express-session as middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		name: "sesiTemuduga",
		cookie: {
			maxAge: 1000 * 60 * 60,
		},
	})
);

// Render the login page whne user visits '/' endpoint
app.get("/", (req, res) => {
    res.render("login.ejs");
})

// Server listening for requests
app.listen(port, () => console.log(`Listening on port ${port}`));
