import { model, Schema } from "mongoose";

export interface Person {
  name: string;
  image: string;
}

export const PersonSchema = new Schema<Person>({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

export const PersonModel = model<Person>("Person", PersonSchema);
