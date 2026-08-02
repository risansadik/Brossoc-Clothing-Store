const User = require('../../models/userSchema');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const env = require('dotenv').config();
const session = require('express-session');

function generateOtp() {
    const digits = "1234567890";
    let otp = "";
    for (let i = 0; i < 4; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];  
    }
    return otp;
}

const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
            debug: true
        });

        await transporter.verify();

        const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background-color: #f4f5f3; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e2e5e0; text-align: center; }
        .logo { font-size: 24px; font-weight: 700; color: #1a1a1a; letter-spacing: 2px; margin-bottom: 30px; text-transform: uppercase; font-family: 'Playfair Display', serif; }
        .title { font-size: 20px; color: #1a1a1a; margin-bottom: 15px; font-weight: 600; }
        .message { color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 30px; }
        .otp-box { background-color: #4a5225; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 6px; padding: 15px 30px; border-radius: 4px; display: inline-block; margin-bottom: 30px; }
        .footer { font-size: 12px; color: #9ca3af; border-top: 1px solid #e2e5e0; padding-top: 20px; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">BROSSOC</div>
        <div class="title">Password Reset Verification</div>
        <div class="message">Please use the verification code below to securely reset your password. This code will expire in 2 minutes.</div>
        <div class="otp-box">${otp}</div>
        <div class="message" style="font-size: 13px;">If you did not request a password reset, please safely ignore this email. Your account remains secure.</div>
        <div class="footer">
            &copy; 2026 Brossoc. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

        const mailOptions = {
            from: `"Brossoc" <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject: "Brossoc - Password Reset Verification",
            text: `Your Brossoc password reset code is ${otp}. Please use this to verify your identity.`,
            html: emailTemplate
        };

        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Detailed error in sending email:", error);
        return false;
    }
}

const securePassword = async (password) => {
    if (!password) {
        throw new Error('Password is required');
    }
    
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.error('Password hashing failed:', error);
        throw error; 
    }
};

const getForgotPassPage = async (req, res) => {
    try {
        res.render('forgot-password');
    } catch (error) {
        console.error("Error in getForgotPassPage:", error);
        res.status(500).redirect('/pageNotFound');
    }
}

const forgotEmailValid = async (req, res) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ email: email });

        if (findUser) {
            const otp = generateOtp();

            await sendVerificationEmail(email, otp);

            req.session.userOtp = otp;
            req.session.email = email;
            return res.render('forgotPass-otp');
        } else {
            return res.render('forgot-password', {
                message: "User with this email does not exist"
            });
        }
    } catch (error) {
        console.error("Error in forgotEmailValid:", error);
        return res.status(500).redirect('/pageNotFound');
    }
}

const verifyForgotPassOtp = async (req, res) => {

    try {

        const enteredOtp = req.body.otp;
        if (enteredOtp === req.session.userOtp) {

            res.json({ success: true, redirectUrl: '/reset-password' });
        } else {

            res.json({ success: false, message: "OTP not matching" });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "An error occured please try again" });

    }
}

const getResetPassPage = async (req, res) => {

    try {

        res.render('reset-password')
    } catch (error) {

        res.redirect('/pageNotFound')

    }
}

const resendOtp = async (req, res) => {

    try {

        const otp = generateOtp();
        req.session.userOtp = otp;
        const email = req.session.email;
        const emailSent = await sendVerificationEmail(email, otp);
        if (emailSent) {
            res.status(200).json({ success: true, message: "Resend OTP successful" });

        }

    } catch (error) {

        console.error("Error in resending otp", error);
        res.status(500).json({ success: false, message: "Internal Server error" });

    }
}

const postNewPassword = async (req, res) => {
    try {
        const { newPass1, newPass2 } = req.body;
        const email = req.session.email;  

        if (!email) {
            return res.json({
                success: false,
                message: "Session expired. Please try again"
            });
        }

        if (!newPass1 || !newPass2) {
            return res.json({
                success: false,
                message: "Please provide both passwords"
            });
        }

        if (newPass1 !== newPass2) {
            return res.json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const passwordHash = await securePassword(newPass1);
        await User.updateOne({ email: email }, { $set: { password: passwordHash } });

        req.session.userOtp = null;
        req.session.email = null;

        return res.json({ success: true });

    } catch (error) {
        console.error('Password reset error:', error);
        return res.json({
            success: false,
            message: "An error occurred while changing your password"
        });
    }
};
const loadDashboard = async (req, res) => {
    try {

       const user = req.user || await User.findOne({_id:req.session.user});

       if(user){

        const isGoogle = !!req.user.googleId

        res.render('dashboard',{

            id:user._id,
            name:user.name,
            email:user.email,
            isGoogle:isGoogle
            
        })

        }else{

            res.status(404).send('User not found')
        }

    } catch (error) {

        res.redirect('/pageNotFound')

    }
}

const getUserEditPage = async (req,res) => {

    try {

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        const user = req.user || await User.findOne({_id:req.session.user});

        if(user){

            res.render('edit-userProfile',{

                id:user._id,
                user:user,
                name:user.name,
                isGoogle:req.user.googleId
            });
        }
       
    } catch (error) {

        res.redirect('/pageNotFound');
        
    }
}

const editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {name, password, cPassword} = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        const updateData = {
            name: name
        };

        if (!user.googleId && password) {
            if (password !== cPassword) {
                return res.status(400).json({success: false, message: "Passwords don't match"});
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {new: true}
        );

        return res.json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"});
    }
};

module.exports = {
    getForgotPassPage,
    forgotEmailValid,
    verifyForgotPassOtp,
    getResetPassPage,
    resendOtp,
    postNewPassword,
    loadDashboard,
    getUserEditPage,
    editUser

};