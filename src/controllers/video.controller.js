import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
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