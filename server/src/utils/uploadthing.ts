import config from "config";
import {
  createUploadthing,
  createUploadthingExpressHandler,
  type FileRouter,
} from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  videoAndImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
    video: {
      maxFileSize: "16MB",
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

const uploadthingId = config.get<string>("uploadthingId");
const uploadthingSecret = config.get<string>("uploadthingSecret");

export const uploadthingHandler = createUploadthingExpressHandler({
  router: uploadRouter,
  config: {
    uploadthingId,
    uploadthingSecret,
  },
});

export type OurFileRouter = typeof uploadRouter;
