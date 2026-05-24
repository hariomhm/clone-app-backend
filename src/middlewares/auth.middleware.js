import { jwt } from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user.model";

const authJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = await req.cookies?.accessToken || req.header("Authorization").remove("Bearer ", "");

        if (!token) { throw new ApiError(401, "Unauthorized request") }

        const deCodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(deCodedToken._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(404, "Invalid Access Token")
        }

        res.user;
        next();
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})


export { autJWT };