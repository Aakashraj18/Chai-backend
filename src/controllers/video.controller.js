import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model.js"
import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js"
import { app } from "../app";

const getAllvideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query,sortBy, sortType, userId } = req.query
    const filter = {};

    if(query) {
        filter.title = {
            $regex: query,
            $options: "i"
        }
    }

    if(userId) {
        filter.owner = userId;
    }

    const sort = {};

    if(sortBy) {
        sort[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sort.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const videos = await Video.find(filter)
                   .sort(sort)
                   .skip(skip)
                   .limit(Number(limit));

    const totalVideos = await Video.countDocuments(filter);


    // return 
    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {
                videos,
                totalVideos,
                currentPage = Number(page),
                totalPages = Math.ceil(totalVideos / limit) 
            },
            "Videos fetches successfully"
        )
    );
})



const publishAVideo = asyncHandler(async (req, res) => {

    // User sends form-data
    // Validate fields
    // Get files from multer
    // Upload thumbnail to Cloudinary
    // Upload video to Cloudinary
    // Create MongoDB document
    // Return created video


    // title and description in body fetch using request
    const { title, description } = req.body

    if(!title?.trim() && !description?.trim()) {
        throw new ApiError(400, "Titles and description are required");
    }


    // upload videofiles and thumbnail by users
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ])


    // Temporarily stored in local Multer
    const videoFile = req.files?.videoFile?.[0]

    if( !videoFile ){
        throw new ApiError(400, "Video file is required")
    }

    const thumbnail = req.files?.thumbnail?.[0]

    if( !thumbnail ){
        throw new ApiError(400, "Thumbnail is required")
    }


    // upload in cloudinary
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!video){
        throw new ApiError(500, "Video upload Failed")
    }

    if( !thumbnail ){
        throw new ApiError(500, "Thumbnail upload Failed")
    }


    // stored in Database
    const createdVideo = await Video.create({     
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration,
        owner: req.user._id
    })

    if( !createdVideo ){
        throw new ApiError(500, "Failed to publish video")
    }

    // Return response
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            createdVideo,
            "Video Published successfuly"
        )
    );
})



const getVideoById = asyncHandler(async ( req, res) => {
    const { videoId } = req.params

    // check videoId
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    // take video from Id
    const video = await Video.findById(videoId);
    

    // validate video
    if(!video){
        throw new ApiError(404,"video not found")
    }


    // return 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "video fetched successfully"
        )
    );
})



const updateVideo = asyncHandler(async (req, res) => {

    // Get videoId
    // Validate videoId
    // Find video
    // Check video exists
    // Check user owns the video (optional but important)
    // Update title/description if provided
    // Upload new thumbnail if provided
    // Upload new video file if provided
    // Save changes.  
    // Return updated video

    
    // get videoId
    const { videoId } = req.params

    if ( !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    // take video and check
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not exists")
    }


    // check user own the video
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized");
    }

    // update title
    if (title) {
        video.title = title
    }

    // update description
    if (description) {
        video.description = description
    }

    // take thumbnailpath and update 
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    
    if (thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        video.thumbnail = url;
    }

    // take videopath and update
    const videoLocalPath = req.files?.videoFile?.[0]?.path

    if (videoLocalPath) {
        const videoFile = await uploadOnCloudinary(videoLocalPath)
        video.videoFile = url
    }

    // save and update video
    await video.save({validateBeforeSave: false})
})



const deleteVideo = asyncHandler( async (req, res) => {

    // Get videoId
    // Validate videoId
    // Find the video
    // If not found → 404
    // Check user is the owner
    // Delete video from Cloudinary
    // Delete thumbnail from Cloudinary
    // Delete document from MongoDB
    // Return success response


    const { videoId } = req.params

    if( !isValidObjectId(videoId) ) {
        throw new ApiError(400, "Invaid video id")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "video is not present")
    }

    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"Unauthorized")
    }

    await deleteFromCloudinary(video,videoFile)
    await deleteFromCloudinary(video.thumbnail)

    await Video.findByIdAndDelete(videoId)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Video deleted succesfully"
        )
    );
})


const togglePublishStatus = asyncHandler(async(req, res) => { 

    // Get videoId
    // Validate videoId
    // Find video
    // If not found → 404
    // Check owner
    // Toggle isPublished
    // Save
    // Return updated video

    const { videoId } = req.params

    if( !validateObjectId(videoId) ){
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if( !video ){
        throw new ApiError(404, "video not found")
    }

    if( video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized")
    }

    // toggle video
    video.isPublished = !video.isPublished


    // save video
    await video.save({ validateBeforeSave: false})

    //return
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Publish status updated successfully"
        )
    );
})


export {
    getAllvideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
}

