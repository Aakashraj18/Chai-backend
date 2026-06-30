import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notDeepEqual } from "assert";

const toggleVideoLike = asyncHandler( async( req, res) => {

    // Get videoId
    // validate videoId
    // check video
    // search for a liked 
    // if exists then delete and responds
    // else liked and responds


    const { videoId } = req.params;

    if( !isValidObjectId(videoId)){
        throw new ApiError(400, "video id is ot valid")
    }

    const video = await findById(videoId)

    if( !video ){
        throw new ApiError(404, "video is not valid")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if( existingLike ) {
        await existingLike.deleteOne();

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { liked: false},
                "videp unliked successfully"
            )
        );
    }

    await Like.create({
        video: videoId,
        likedBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {liked: true},
            "videp liked successfully"
        )
    );
})


const toggleCommentLike = asyncHandler(async(req, res) => {

    // get commentId
    // validate comment
    // find comment
    // check comment exists or not
    // find like exists 
    // if Yes then delete and return 
    // else liked nad return 

    const { commentId } = req.params

    if( !isValidObjectId(commentId) ){
        throw new ApiError(400, " comment id is not valid")
    }

    const comment = await findById(commentId) 

    if( !comment ){
        throw new ApiError(404, "comment is not valid")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if( existingLike ){
        await existingLike.deleteOne()

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { liked : false},
                "comment unliked successfully"
            )
        );
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            { liked: true },
            "comment liked successfully"
        )
    );
})


export {
    toggleVideoLike,
    toggleCommentLike
}