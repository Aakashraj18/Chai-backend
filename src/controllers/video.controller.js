import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

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
    const {videoId} = req.params
})