import {  User } from '../models/users.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js'

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating the access and refresh token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty etc...
    // check if user already exists: username, email
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response
    const {username, email, password} = req.body;
    
    if([email, username, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const userExist = await User.findOne({
        $or: [{username}, {email}]
    })

    if(userExist) throw new ApiError(409, "User with username or email already exist")

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new ApiError(500, "User creation failed, internal server error, please try again")

    return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"))
})

const loginUser = asyncHandler( async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send tokens in cookies
    const {email, username, password} = req.body;

    if(!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if(!user) {
        console.error("Can't find user with matching credentials")
    }

    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Ivalid user credentials')
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, {user: loggedInUser}, "User Logged in successfully !!!"))
})

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, "User logout successful !!!"));
})


const addToWatchList = asyncHandler(async (req, res) => {
    const {coinId} = req.body;
    if(!coinId) {
        throw new ApiError(400, "coinId is required");
    }
    
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(400, "Unable to find user");
    }
    
    // if(!user.watchList.includes(coinId)) {
        user.watchList.push(coinId);
        await user.save();
    // }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Added to wachlist"));
})

const removeFromWatchList = asyncHandler(async (req, res) => {
    const {coinId} = req.body;
    if(!coinId) {
        throw new ApiError(400, "coinId is required");
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(400, "Unable to find user");
    }

    user.watchList = user.watchList.filter(id => id !== coinId);
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Remoeved from Watchlist"))
})

const getWatchList = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(400, "Unable to find user");
    }

    const watchList = user.watchList;

    return res
    .status(200)
    .json(new ApiResponse(200, {watchList}, "Retrieved Watchlist successfully"))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    addToWatchList,
    removeFromWatchList,
    getWatchList
}