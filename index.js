import express from "express";
import session from "express-session";
import env from "dotenv";

// Allow access to the environment variables inside .env file through process.env.VARIABLE_NAME
env.config();

const app = express();
const port = 3000;

// Enable express to parse the form data (url encoded) to the req.body
app.use(express.urlencoded({extended:false}))

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
app.get("/", preventLoginPage,(req, res) => {
    res.render("login.ejs");
})

// Authenticate user credentials. Send back error message if username or password don't match
// Modify the req.session (add a dynamic property that identifies the user) object. It will serialize (store) the object to the session store and send a signed cookie with the session id
// Then redirect to the user homepage
app.post("/login", (req, res) => {
    const { body: { username, password }} = req;

    if (username !== "tadanama") return res.status(401).render("login.ejs", { error: "Invalid username"});
    if (password !== "123") return res.status(401).render("login.ejs", { error: "Invalid password"});

    req.session.user = username;
    res.redirect("/home");
});

app.get("/home", isUserLoggedIn,(req, res) => {
    res.render("home.ejs");
})

// Destroy the session
// The session object for the session id will be removed from the session store
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.clearCookie("sesiTemuduga");
    res.redirect("/");
})

// Middleware to determine if the incoming request is from a user that is already logged in
function isUserLoggedIn(req, res, next) {
    // When the user is already authenticated, it should have the req.session.user object because it was set in /login post route
    if (req.session.user) {
        next();
    } else {
        res.redirect("/");
    }
}

// Middleware to prevent authenticated user from accessing the login page
function preventLoginPage(req, res, next){
    // Allow users that don't have the a session object that identifies them to render the login page
    if (!req.session.user){
        next();
    } else {
        res.redirect("/home");
    }
}

// Server listening for requests
app.listen(port, () => console.log(`Listening on port ${port}`));
