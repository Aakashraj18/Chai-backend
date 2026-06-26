import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                status: "OK",
                message: "Server is running successfully",
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            },
            "OK status"
        )
    );
})

export {healthcheck}