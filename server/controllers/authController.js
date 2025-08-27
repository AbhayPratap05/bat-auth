import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { text } from 'express';
import transporter from '../config/nodemailer.js';
import { WELCOME_TEMPLATE, PASSWORD_RESET_TEMPLATE, VERIFY_ACCOUNT_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: "All fields are required!"});
    }
    
    try {

        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.json({success: false, message: "User already exists!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to the Shadows!',
            // text: `Welcome ${name},\n\nThank you for registering with us! We are excited to have you on board.\nYour account is created successfully with email: ${email}\n\nBest regards,\nAbhayPratap Team`
            html: WELCOME_TEMPLATE.replace('{{email}}', email)
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "Registration successful!"});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const login = async (req, res)=>{
    const{email, password} = req.body;
    
    if(!email || !password){
        return res.json({success: false, message: "All fields are required!"});
    }

    try {
        
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "Invalid email!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: "Invalid password!"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true, message: "Login successful!"});

    } catch (error) {
        res.json({success: false, message: error.message});
        
    }
}

export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });

        return res.json({success: true, message: "Logged Out!"});``

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified!"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // generate a 6-digit OTP
        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Account',
            // text: `Your verification OTP is ${otp}.\nOTP is valid for 10 minutes.`
            html: VERIFY_ACCOUNT_TEMPLATE.replace('{{OTP}}', otp)
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "OTP sent to your email!"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const verifyEmail = async(req, res)=>{
    const {otp} = req.body;
    const userId = req.userId;

    if(!userId || !otp){
        return res.json({success: false, message: "User ID and OTP are required!"});
    }

    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: "User not found!"});
        }

        if(user.verifyOtp === '' || user.verifyOtp != otp){
            return res.json({success: false, message: "Invalid OTP!"});
        }

        if(user.verifyOtpExpiresAt < Date.now()){
            return res.json({success: false, message: "OTP expired!"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiresAt = 0;

        await user.save();
        return res.json({success: true, message: "Account verified successfully!"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const sendResetOtp = async (req, res) => {
    const {email} = req.body;

    if(!email){
        return res.json({success: false, message: "Email is required!"});
    }

    try {
        
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found!"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // generate a 6-digit OTP
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Your Password',
            // text: `Your password reset OTP is ${otp}.\nIt is valid for 10 minutes.`
            html: PASSWORD_RESET_TEMPLATE.replace('{{OTP}}', otp)
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message:"Password reset OTP sent to your email!"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP are required!" });
    }
  
    try {
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.json({ success: false, message: "User not found!" });
      }
  
      if (!user.resetOtp || user.resetOtp !== otp) {
        return res.json({ success: false, message: "Invalid OTP!" });
      }
  
      if (user.resetOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: "OTP expired!" });
      }
  
      return res.json({ success: true, message: "OTP verified. You can now reset your password." });
  
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
  

export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: "All fields are required!"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found!"});
        }
        if(user.resetOtp === '' || user.resetOtp != otp){
            return res.json({success: false, message:"Invalid OTP!"});
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired!"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        res.json({success: true, message: "Password reset successfully!"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const updateUsername = async (req, res) => {
    const {newName} = req.body;
    const userId = req.userId;

    if(!newName || newName === ''){
        return res.json({success: false, message: "UserName is required"});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found!"});
        }
        if(newName === user.name){
            return res.json({success: false, message: "Use other UserName"});
        }
        user.name = newName;
        await user.save();

        res.json({success: true, message: "UserName updated successfully!"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}