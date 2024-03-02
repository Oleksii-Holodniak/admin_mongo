import AdminJSExpress from "@adminjs/express";
import { Database, Resource } from "@adminjs/mongoose";
import uploadFileFeature from "@adminjs/upload";
import AdminJS from "adminjs";
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { PersonModel } from "./model";

dotenv.config();

const PORT = 3001;

AdminJS.registerAdapter({
  Database,
  Resource,
});

const start = async (): Promise<void> => {
  const app = express();

  await mongoose.connect(`${process.env.MONGO_URL}`);

  const admin = new AdminJS({
    resources: [
      {
        resource: PersonModel,
        options: {
          editProperties: ["name", "uploadImageUrl"],
          filterProperties: ["name"],
          listProperties: ["image", "name"],
          showProperties: ["image", "name"],
        },
        features: [
          uploadFileFeature({
            provider: {
              local: {
                bucket: path.join(__dirname, "uploads"),
              },
            },
            properties: {
              key: "image",
              file: "uploadImageUrl",
            },
            uploadPath: (record, filename) => {
              return `product-${record.get("name")}/${filename}`;
            },
          }),
        ],
      },
    ],
  });

  const adminRouter = AdminJSExpress.buildRouter(admin);

  app.use(admin.options.rootPath, adminRouter);
  app.use("/uploads", express.static("uploads"));

  app.listen(PORT, () => {
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`
    );
  });
};

start();
