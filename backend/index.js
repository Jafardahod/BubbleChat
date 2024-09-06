const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const multer = require('multer');
const formidable = require('formidable');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');




// import { initializeApp } from 'firebase/app';
// import { getStorage, ref, getDownloadURL, uploadBytesResumable, } from 'firebase/storage';
// import config from './config.js';

const firebaseConfig = {
    apiKey: "AIzaSyALpO5lZN_0y4EX5NlXgEQnBJkvRDAEBbY",
    authDomain: "bubblechat-19154.firebaseapp.com",
    projectId: "bubblechat-19154",
    storageBucket: "bubblechat-19154.appspot.com",
    messagingSenderId: "607954212770",
    appId: "1:607954212770:web:ecf00a8324bd7824ef84fb",
    measurementId: "G-Y5XRKJNB16",
};

// console.log(firebaseConfig);

const app = express();
const port = 4000;
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const jwt = require('jsonwebtoken');

mongoose.connect(
    "mongodb+srv://jafardahod7:Jafar123@bubblechatdatabase.fy3ncil.mongodb.net/?retryWrites=true&w=majority",

).then(() => {
    console.log('Yess connected');

}).catch((err) => {
    console.log('Error', err);
});

app.listen(port, () => {
    console.log('Server running on port', port);
})

const User = require("./models/user");
const Message = require("./models/message");


//Create Token 
const createToken = (userId) => {
    const payload = {
        userId: userId,
    };


    const token = jwt.sign(payload, "Jafar is the greatest and the most precious human being on this planet", { expiresIn: "1h" });
    return token;
};

//Endpoints 

//Register
initializeApp(firebaseConfig);
const place = getStorage();
const upload1 = multer({ storage: multer.memoryStorage() });



// app.post("/Signup", (req, res) => {
//     const { name, email, password } = req.body;


//     const newUser = new User({ name, email, password });
//     const id = newUser._id;

//     newUser.save().then(() => {
//         const Token = createToken(newUser._id);

//         console.log("User registered successfully");
//         res.status(200).json({ Token, id, message: "User registered successfully" })
//     }).catch((err) => {
//         console.log("Error registering user ", err);
//         res.status(500).json({ message: "Error registering User" })
//     })




// });

//Login
app.post("/Login", (req, res) => {
    const { email, password } = req.body;
    //if any of the field is empty
    if (!email || !password) {
        return res.status(404).json({ message: "Please fill in the valid fields" })
    }

    User.findOne({ email }).then((user) => {
        //Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" })
        }

        //Check password
        if (user.password !== password) {
            return res.status(404).json({ message: "Password Invalid" })
        }
        const id = user._id;
        const Token = createToken(id);
        res.status(200).json({ Token, id, message: "Successfull LOGIN" });
    }).catch((error) => {
        console.log("Error in finding user");
        res.status(500).json({ message: "Internal Server Error" });
    });
});



//Endpoint to access all the user Id
app.get("/users/:userId", async (req, res) => {
    const LoggedInuser = req.params.userId;
    // console.log(LoggedInuser)

    const CurrentLoggedInUser = await User.findOne({ _id: LoggedInuser });
    // const freinds = CurrentLoggedInUser.freinds;
    // const sendFreindreq = CurrentLoggedInUser.SendFreindRequests;
    const excludedUsers = [...CurrentLoggedInUser.freinds, ...CurrentLoggedInUser.SendFreindRequests, LoggedInuser]
    // console.log(excludedUsers);
    User.find({
        _id: {
            $nin: excludedUsers,
        },
    }).then((users) => {
        res.status(200).json(users)
    }).catch((err) => {
        res.status(500).json({ message: "Error while retrieving users" })
        console.log(err);
    })

});

//Endpoint to access all the Freinds
app.get("/freindsList/:userId", async (req, res) => {
    const LoggedInuser = req.params.userId;
    // console.log(LoggedInuser)

    try {
        const users = await User.find({ _id: LoggedInuser });
        const freinds = users[0].freinds;
        // console.log("From here 1", freinds);
        // console.log("From here 2", freindss);
        const arr = [];
        for (let x in freinds) {
            const response = await User.findById(freinds[x]);
            arr.push(response);
        }

        // console.log(arr);
        res.status(200).json(arr);
    }
    catch (err) {
        res.status(500).json({ message: "Error while retrieving Freinds" });
        console.log(err);
    }

});


// Endpoint for sending friend request
app.post("/friendRequest", async (req, res) => {
    const { CurrentUser, selectedUser } = req.body;
    console.log(CurrentUser, selectedUser);
    try {


        await User.findByIdAndUpdate(selectedUser, {
            $addToSet: { freindRequests: CurrentUser },
        });

        await User.findByIdAndUpdate(CurrentUser, {
            $addToSet: { SendFreindRequests: selectedUser },
        });

        res.sendStatus(200);
        console.log("Success");
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});



// endpoint for showing Freind request

app.get("/freindRequestRecieve/:userId", async (req, res) => {
    const LoggedInuser = req.params.userId;

    try {
        const users = await User.find({ _id: LoggedInuser });
        const fReqRecieved = users[0].freindRequests;
        console.log("From here down", fReqRecieved);

        const arr = [];
        for (let x in fReqRecieved) {
            const response = await User.findById(fReqRecieved[x]);
            arr.push(response);
        }

        // console.log(arr);
        res.status(200).json(arr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Endpoint for accepting freind request

app.post("/friendAccept", async (req, res) => {
    const { CurrentUser, selectedUser } = req.body;
    console.log(CurrentUser, selectedUser);
    try {
        //deleteing sendFreindreq from the sender
        await User.findByIdAndUpdate(selectedUser, {
            $pull: { SendFreindRequests: CurrentUser }
        },

            {
                new: true
            });
        //deleting freindRequest from the current User
        await User.findByIdAndUpdate(CurrentUser, {
            $pull: { freindRequests: selectedUser },
        },
            {
                new: true
            }
        );
        //Adding the sender to the freinds
        await User.findByIdAndUpdate(CurrentUser, {
            $addToSet: { freinds: selectedUser },
        });

        //Adding the currentuser to the senders friends list
        await User.findByIdAndUpdate(selectedUser, {
            $addToSet: { freinds: CurrentUser },
        })

        res.sendStatus(200);
        console.log("Success");
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});


//Endpoint to reject the freind request


app.post("/freindReject", async (req, res) => {
    const { CurrentUser, selectedUser } = req.body;
    console.log(CurrentUser, selectedUser);
    try {
        //deleteing freindRequests from the Current User
        await User.findByIdAndUpdate(CurrentUser, {
            $pull: { freindRequests: selectedUser }
        },

            {
                new: true
            }
        );
        //deleting SendFreindRequests from the current User
        await User.findByIdAndUpdate(selectedUser, {
            $pull: { SendFreindRequests: CurrentUser },
        },
            {
                new: true
            }
        );
        res.sendStatus(200);
        console.log("Success");
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});
//configure multer for file uploads

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './files');
//     },
//     filename: function (req, file, cb) {
//         const uniquefileSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniquefileSuffix + '-' + file.originalname);
//     }
// })

//firebase backchodi
initializeApp(firebaseConfig);
const space = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

// endpoint post message and files upload and store  it in backend

app.post("/Signup", upload.single("File"), async (req, res) => {
    console.log(req.file); 
    try {
        if (req.file) {
            console.log(req.file);
            const dateTime = giveCurrentDateTime();
            const storageRef = ref(space, `profiles/${req.file.originalname + "   " + dateTime}`);

            const metadata = {
                contentType: req.file.mimetype,
            }

            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            global.downloadURL = await getDownloadURL(snapshot.ref);

        }

        // console.log(downloadURL);
        if (global.downloadURL) {

            console.log('YES FINALLY');
            const { name, email, password, image } = req.body; 
            console.log(image);


            const newUser = new User({ name, email, password, image: global.downloadURL });
            const id = newUser._id;

            newUser.save().then(() => {
                const Token = createToken(id);
                console.log(Token)
                console.log("User registered successfully");
                res.status(200).json({ Token, id, message: "User registered successfully" })
            }).catch((err) => {
                console.log("Error registering user ", err);
                res.status(500).json({ message: "Error registering User" })
            })
        }
        else {
            console.log('YES FINALLY');
            const { name, email, password, image } = req.body;
            // console.log(image);


            const newUser = new User({ name, email, password, image: null });
            const id = newUser._id;

            newUser.save().then(() => {
                const Token = createToken(newUser._id);

                console.log("User registered successfully");
                res.status(200).json({ Token, id, message: "User registered successfully" })
            }).catch((err) => {
                console.log("Error registering user ", err);
                res.status(500).json({ message: "Error registering User" })
            })
        }
    } catch (error) {
        console.log(error);
    }




});
app.post("/messages", upload.single("File"), async (req, res) => {
    try {
        if (req.file) {
            console.log(req.file);
            const dateTime = giveCurrentDateTime();
            const storageRef = ref(space, `files/${req.file.originalname + "   " + dateTime}`);

            const metadata = {
                contentType: req.file.mimetype,
            }

            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            global.downloadURL = await getDownloadURL(snapshot.ref);

        }

        // console.log(downloadURL);
        console.log('YES FINALLY');
        const { senderId, recieverId, messageType, message } = req.body;
        if (global.downloadURL) {
            const newMessage = new Message({
                senderId,
                recieverId,
                messageType,
                message,
                timestamp: new Date(),
                FileUrl: messageType === "text" ? null : downloadURL


            });
            await newMessage.save();

            res.status(200).json({ message: "Message sent Successfully" });
        }
        else {
            const newMessage = new Message({
                senderId,
                recieverId,
                messageType,
                message,
                timestamp: new Date(),
                FileUrl: null


            });
            await newMessage.save();

            res.status(200).json({ message: "Message sent Successfully" });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

//Endpoint to fetch messages between 2 users
app.get("/messages/:CurrentUserId/:SelectedUserId", async (req, res) => {
    try {
        const { CurrentUserId, SelectedUserId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: CurrentUserId, recieverId: SelectedUserId },
                { senderId: SelectedUserId, recieverId: CurrentUserId },
            ]
        }).populate("senderId", "_id name");
        res.json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server error" });
    }
})


//endpoint for handling file uploads

// app.post('/upload', upload.single('File'), (req, res) => {
//     try {
//         // Checking if a file is recieved
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         const uploadedFile = req.file;
//         console.log(uploadedFile);

//         res.status(200).json({ message: 'File uploaded successfully', file: uploadedFile });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });