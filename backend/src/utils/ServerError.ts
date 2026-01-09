import ApiResponse from "./ApiResponse";
import {Response} from "express"
export default function ServerError(res: Response, err?: any){
     return res.status(500).json(
            new ApiResponse(false, "Internal server error", null, err)
        )
}