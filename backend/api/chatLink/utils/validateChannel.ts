import { LINK_COLLECTION } from "../../../db/const";
import db from "../../../db";

export enum CHANNLE_STATE {
  "NOT_FOUND" = "NOT_FOUND",
  "ACTIVE" = "ACTIVE",
  "DELETED" = "DELETED",
  "EXPIRED" = "EXPIRED",
}

type ValidationStatus = {
  valid: boolean,
  state: CHANNLE_STATE
}

const channelValid = async (channel: string): Promise<ValidationStatus> => {
  if (!channel) {
    throw new Error("channel - required param");
  }
  const ifExists = await db.findOneFromDB({ hash: channel }, LINK_COLLECTION);
  if (!ifExists) {
    return {
      valid: false,
      state: CHANNLE_STATE.NOT_FOUND
    };
  }
  const { expired, deleted } = ifExists;
  const inValid = expired || deleted;

  const validState = CHANNLE_STATE.ACTIVE;
  const invalidState = (deleted && CHANNLE_STATE.DELETED) || (expired && CHANNLE_STATE.EXPIRED);

  const state = inValid ? invalidState : validState;
  return {
    valid: !inValid,
    state
  };
};

export default channelValid;
