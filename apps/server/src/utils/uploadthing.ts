import {
  createUploadthing,
  createUploadthingExpressHandler,
  type FileRouter,
} from "uploadthing/express";
import { env } from "../env";

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

const uploadthingId = env.UPLOADTHING_APP_ID;
const uploadthingSecret = env.UPLOADTHING_SECRET;

export const uploadthingHandler = createUploadthingExpressHandler({
  router: uploadRouter,
  config: {
    uploadthingId,
    uploadthingSecret,
  },
});
