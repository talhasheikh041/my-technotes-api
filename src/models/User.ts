import mongoose from "mongoose"

interface User {
  username: string
  password: string
  roles: string[]
  active: boolean
}

const userSchema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["Employee"],
  },
  active: {
    type: Boolean,
    default: true,
  },
})

export const UserModel = mongoose.model<User>("User", userSchema)
