import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notDeepEqual } from "assert";
import { validateHeaderName } from "http";
import { exists } from "fs";

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

    const video = await Video.findById(videoId)

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

    const comment = await Comment.findById(commentId) 

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



const toggleTweetLike = asyncHandler(async(req, res) => {

    // Get tweetId
    // validate
    // find tweet
    // tweet exists
    // find like 
    // if Yes then delete and return 
    // else liked and return 


    const { tweetId } = req.params

    if( !isValidObjectId(tweetId) ){
        throw new ApiError(400, "tweet id is invalid")
    }

    const tweet = await Tweet.findById(tweetId)

    if( !tweet ){
        throw new ApiError(404, "Tweet not found")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if( existingLike ){
        await existingLike.deleteOne();

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { liked: false},
                "Tweet unliked successfully"
            )
        );
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            { liked: true},
            "Tweet liked successfully"
        )
    );
})


const getLikedVideos = asyncHandler(async(req, res) => {

    // Get current user ID
    // Find all Like documents where:
    //     likedBy = req.user._id
    //     video exists
    // Extract video IDs
    // Fetch video details
    // Return liked videos


    const userId = req.user._id

    const likes = await Like.find({
        likedBy: userId,
        video: { $exists: true}
    })

    const videoId = likes.map(like => like.video)

    const videos = await Video.find({
        _id: { $in: videoIds }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "Liked video fetched successfully"
        )
    );
})



export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}