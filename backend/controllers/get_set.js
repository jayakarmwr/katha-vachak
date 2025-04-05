const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const nodemailer=require("nodemailer");
const {User,Story,Feedback} =require("../Schema");
require('dotenv').config();



const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(200).json({msg:"User not found"});
        }

        const isPasswordValid= await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(200).json({msg:"Incorrect password"});
        }
        
        res.status(200).json({
            msg: "ok",
            id: user._id,
            username: user.username,
            });
    }catch(error){
        console.log("Login error:", error);
        res.status(500).json({msg:"Server error"});
    }
};

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'arepallenehasri@gmail.com',
        pass:'njhpjjurmacbzwhf',
    },
});


const signup=async(req,res)=>{
    const {username,email}=req.body;
    try{
        const existingUser=await User.findOne({email});
        console.log(existingUser);
        if(existingUser){
            console.log("User exixts");
            return res.status(409).json({msg:"User already exists"});
        }
        console.log("Creating new user...");
        const newUser=new User({
            username,   
            email,
        });
        await newUser.save();
        const token=jwt.sign({email:newUser.email},process.env.JWT_SECRET,{expiresIn:'1h'});

        const confirmationLink=`http://localhost:5173/confirm-email/${token}`;

        const mailOptions={
            from:"arepallenehasri@gmail.com",
            to:email,
            subject:'Email Confirmation',
            html:`
                <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7;">
                    <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #6a0dad; text-align: center;">Welcome to Our Service!</h1>
                        <p style="font-size: 16px; color: #333333;">
                            Thank you for signing up, <strong>${username}</strong>! Please confirm your email address by clicking the link below.
                        </p>
                        <a href="${confirmationLink}" style="display: inline-block; margin: 20px auto; padding: 10px 20px; background-color: #6a0dad; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirm Email</a>
                        <p style="font-size: 14px; color: #777777; text-align: center;">
                            If you did not sign up for this account, please ignore this email.
                        </p>
                    </div>
                    <footer style="text-align: center; margin-top: 20px; padding: 10px; font-size: 12px; color: #888888;">
                        &copy; ${new Date().getFullYear()}Kathavachak. All rights reserved.
                    </footer>
                </div>
                `
        };
         transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.error("Error sending email:",error);
                return res.status(500).json({msg:"Error sending confirmation email"});
            }
            console.log('Email sent: '+info.response);
            res.status(201).json({msg:"User created successfully. Check your email to confirm"});
        });
    }catch(error){
        console.error("Signup error:",error);
        res.status(500).json({msg:"Server error"});
    }
};
const confirmPassword = async (req, res) => {
    const { password, confirm, token } = req.body;

    if (password !== confirm) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const user = await User.findOne({ email });
        if (!user ) {
            return res.status(404).json({ msg: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: "Email confirmed and password set successfully." });
    } catch (error) {
        console.error("Error confirming email:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

const changePassword=async(req,res)=>{
    const {email,password,confirm}=req.body;
    if(password!==confirm){
        return res.status(400).json({msg:"Passwords do not match"});
    }
    try{
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.findOneAndUpdate(
            {email},
            {password:hashedPassword},
            {new:true}
        );
        if(!user){
            return res.status(404).json({msg:"User not found"});
        }
        res.status(200).json({msg:"ok"});
    }catch(error){
        console.error("Error updating password",error);
        res.status(500).json({msg:"Server error"});
    }
};

const getProfile= async (req, res) => {
    const { _id } = req.query;

  if (!_id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const stories = await Story.find({ userId: user._id }).select('genre');
  //console.log(stories);

  const genreCounts = {};
  stories.forEach((story) => {
    const genre = story.genre.trim(); 
    if (genre) { 
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    }
  });
  //console.log(genreCounts); 

  const achievements = [];
  for (const [genre, count] of Object.entries(genreCounts)) {
    if (count >= 2) {  
      achievements.push(`Master of ${genre}`);
    }
  }
  //console.log(achievements);  

  res.status(200).json({ user, achievements,genreCounts });
  };


const savestory = async (req, res) => {
    const { genre, title, generatedStory, images, email_id } = req.body;
    console.log(req.body.title);
    
    try {
        
        const user = await User.findOne({ email: email_id }).select('_id');
        if (!user) {
            return res.status(400).json({ message: 'User not found with the provided email' });
        }

        const Storygeneration = new Story({
            userId: user._id,
            genre,
            title,
            generatedStory,
            images
        });

       
        await Storygeneration.save();
        res.status(201).json({ message: 'Story saved successfully' });
    } catch (error) {
        console.error('Error saving story:', error.message || error);
        res.status(500).json({ message: 'Error saving the story' });
    }
};

const storyHistory = async (req, res) => {
  const { email_id } = req.query;
  if (!email_id) {
      return res.status(400).json({ message: "Email is required to fetch story history." });
  }
  try {
      const user = await User.findOne({ email: email_id }).select('_id');
      if (!user) {
          return res.status(400).json({ message: 'User not found with the provided email' });
      }

    const stories = await Story.find({ userId: user._id }).select('_id genre title');
    res.status(200).json( stories );
  } catch (error) {
    console.error("Error fetching story history:", error);
    res.status(500).json({ msg: "Server error." });
  }
};
const setlike = async (req, res) => {
    try {
      const { email, title } = req.body;
  
     
      const user = await User.findOne({ email }).select("_id");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      
      const story = await Story.findOneAndUpdate({ userId: user._id, title },{ liked: true },{ new: true });
      if (!story) {
        return res.status(404).json({ message: "Story not found for the user." });
      }
  
      

      res.status(200).json({ message: "Story liked successfully!" });
    } catch (error) {
      console.error("Error in setlike function:", error);
      res.status(500).json({ message: "An error occurred while liking the story." });
    }
  };



const getlikedstories=async(req,res)=>
  {
    try {
        const { id } = req.query;
        //console.log(id);
        if (!id) {
          return res.status(400).json({ message: "User ID is required." });
        }
        const stories = await Story.find({ userId: id ,liked:true}).select('_id genre title');
        //console.log(stories);
    
        
        if (stories.length === 0) {
          return res.status(404).json({ message: "No stories found for this user." });
        }
    
        res.status(200).json(stories);
      } catch (error) {
        console.error("Error fetching stories:", error.message);
        res.status(500).json({ message: "An error occurred while fetching stories." });
      }
  }

  const setdislike=async(req,res)=>
  {
    
    try{
        const {id}=req.body;
        if (!id) 
        {
            return res.status(400).json({ message: "User ID is required." });
        }
        const stories=await Story.findByIdAndUpdate({_id:id},{liked:false},{new: true});
        if (stories.length === 0) {
            return res.status(404).json({ message: "No stories found for this user." });
          }
          res.status(200).json(stories);
      } catch (error) {
          console.error("Error fetching stories:", error.message);
          res.status(500).json({ message: "An error occurred while fetching stories." });
      }
  }
  
  const getStoryById = async (req, res) => {
    const { id } = req.params; 
    try {
      const story = await Story.findById(id); 
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.status(200).json(story);
    } catch (error) {
      console.error("Error fetching story by ID:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  const submitFeedback = async (req, res) => {
    const { email, feedback, rating } = req.body;

    if (!feedback) {
      return res.status(400).json({ msg: "Email and feedback are required." });
    }

    try {
    // Save feedback to the database
      const newFeedback = new Feedback({
        email,
        feedback,
        rating, // Optional: Include rating if provided
      });

      await newFeedback.save();
      res.status(200).json({ msg: "Feedback submitted successfully." });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ msg: "Server error." });
    }
  };

module.exports={login,signup,confirmPassword,changePassword,getProfile,savestory,storyHistory,getStoryById,setlike,getlikedstories,setdislike,submitFeedback};
  
