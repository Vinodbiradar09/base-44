import mongoose from "mongoose";

export interface GeminiResponse{
    optimizedCode : string,
    issuesAndFixes: string;
    performanceMetrics: string;
    scalingArchitecture: string;
    implementationRoadmap: string;
    productionDeployment: string;
}


export interface API {
    success : boolean,
    message : string,
    sections?: GeminiResponse,
    chatId?: mongoose.Types.ObjectId | string,
}