export interface PostReqData {
  title?: string;
}

export interface PatchReqData extends PostReqData {
  completed?: boolean;
}
