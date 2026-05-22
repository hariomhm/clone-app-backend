import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, fullName, password} = req.body;

    if(
        [username, email, fullName, password].some((field) => field?.trim() == "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with this email or username already existed.")
    }

    const avatarLocalFilePath = req.files?.avatar?.[0]?.path
    const coverImageLocalFilePath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalFilePath){
        throw new ApiError(400, "Avatar Image is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);

    const user = await User.create({
        username : username.toLowerCase(),
        email,
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(200).json(
        ApiResponse(201, createdUser, "User Registered Successfully")
    )

})

export default registerUser;