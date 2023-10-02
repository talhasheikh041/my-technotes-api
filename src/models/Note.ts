import mongoose, { Model } from "mongoose"

interface INotes {
  user: mongoose.Schema.Types.ObjectId
  title: string
  text: string
  completed: boolean
  ticket: Number
}

interface INotesModel extends Model<INotes> {
  getTicket(): number
}

interface ICount {
  seq: number
}

const countSchema = new mongoose.Schema<ICount>({
  seq: {
    type: Number,
  },
})

export const CountModel = mongoose.model<ICount>("Count", countSchema)

const noteSchema = new mongoose.Schema<INotes, INotesModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },
    ticket: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

noteSchema.static("getTicket", async () => {
  const ret = await CountModel.findByIdAndUpdate(
    "6514c5f8863f3702b50aa0f7",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  return ret.seq
})

export const NoteModel = mongoose.model<INotes, INotesModel>("Note", noteSchema)
