const User = require("../models/user.model");
const ApiFilters = require("../utils/apiFilter");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");






exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("🔹 Token from header:", token);
  } 
  // Check for token in cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
    console.log("🍪 Token from cookie:", token);
  }

  if (!token) {
    console.log("🚨 No token found!");
    return next(new AppError("You are not logged in, please login first", 401));
  }

  try {
    // Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded);

    // Get user from token
    const userExists = await User.findById(decoded.id);
    if (!userExists) {
      console.log("❌ User not found in DB");
      return next(new AppError("This user no longer exists", 404));
    }

    req.user = userExists;
    console.log("🟢 User attached to req.user:", req.user);
    
    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err);
    return next(new AppError("Invalid or expired token", 401));
  }
});

// Get all users with filters
exports.getUsers = async (req, res) => {
  try {
    const filter = new ApiFilters(User.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

    const users = await filter.query;
    res.status(200).json({
      status: "success",
      length: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Using MongoDB ObjectId

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};




// Sign JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signUp = async (req, res) => {
  console.log("📩 Sign-up triggered");

  try {
    const { firstName, lastName, email, password, gender, languages, phoneNumber, DOB } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      DOB,
      gender,
      profilePicture: req.file ? req.file.path : "/images/default.jpg",
      languages: languages || [],
      age: DOB ? new Date().getFullYear() - new Date(DOB).getFullYear() : undefined,
    });

    const token = signToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      message: "success",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("❌ Sign-Up Error:", error);
    res.status(500).json({ message: "fail", error: error.message });
  }
};


exports.login = async (req, res) => {
  console.log("🔹 Login triggered");

  try {
    const { email, password } = req.body;

    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Step 2: Get user and explicitly select password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 3: Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 4: Sign JWT token
    const token = signToken(user._id);

    // Step 5: Remove password before sending user object
    user.password = undefined;

    // Step 6: Send cookie + response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "success",
      user,
      token,
      userId: user._id,
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "fail", error: error.message });
  }
};


exports.logout = (req, res) => {
  console.log("🚪 Logout triggered");

  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};


// Update user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(204).json(); 
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};




