import config from "config";
import {
  createUploadthing,
  createUploadthingExpressHandler,
  type FileRouter,
} from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  proofFiles: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 2,
    },
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 2,
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "16MB",
      maxFileCount: 2,
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
