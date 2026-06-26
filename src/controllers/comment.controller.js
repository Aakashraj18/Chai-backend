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


const updateComment = asyncHandler(async(req, res) => {

    // Get commentId
    // Validate commentId
    // Get new content from req.body
    // Validate content
    // Find comment
    // If not found → 404
    // Check user is the owner
    // Update content
    // Save
    // Return updated comment


    const { commentId } = req.params

    if( !validateObjectId(commentId) ){
        throw new ApiError(400, "Invalid comment id")
    }

    const { content } = req.body

    if( !content?.trim()){
        throw new ApiError(400, "Comment cannot be empty")
    }


    const comment = await Comment.findById(commentId)

    if( !comment ){
        throw new ApiError(404, "comment not found")
    }


    if(comment.owner.toString !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized")
    }

    comment.content = content
    await comment.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment updated successfully"
        )
    );
})


const deleteComment = asyncHandler(async(req, res) => {

    // Get commentId
    // Validate commentId
    // Find comment
    // If not found → 404
    // Check user is the owner
    // Delete comment
    // Return success response


    const { commentId } = req.params

    if( !validateObjectId(commentId) ){
        throw new ApiError(400, " comment id not found")
    }

    const comment = await comment.findById(commentId)

    if( !comment ){
        throw new ApiError(404, "comment not found")
    }

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized user")
    }

    await comment.deleteComment()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    );
})


export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}