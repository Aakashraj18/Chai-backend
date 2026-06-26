import { comment } from '../models/comment.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const getVideoComments = asyncHandler(async(req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
})


const addComment = asyncHandler(async(req, res) => {

    // Get videoId
    // Validate videoId
    // Find video
    // If video doesn't exist → 404
    // Get comment content
    // Validate content (not empty)
    // Create comment
    // Return created comment


    const { videoId } = req.params

    if( !validateObjectId(videoId) ){
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Invalid video")
    }

    const { content } = req.body

    if( !content?.trim ()){
        throw new ApiError(400, "comment cannot be empty")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            comment,
            "Comment added successfully"
        )
    );
})


export {
    getVideoComments,
    addComment
}