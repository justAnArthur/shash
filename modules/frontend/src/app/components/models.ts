export interface IMessage {
  content: String;
  userId: String;
  user: any;
  createdAt: EpochTimeStamp;
  id?: String;
}
