import express from "express";
import session from "express-session";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;

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

app.listen(port, () => console.log(`Listening on port ${port}`));
