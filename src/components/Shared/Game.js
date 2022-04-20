import { v4 as uuidv4 } from "uuid";

export default class Game {
  constructor(props) {
    const timeStamp = new Date().toISOString();
    this._game = {
      eventId: props.eventId,
      eventName: props.eventName,
      round: props.round,
      whiteMemberId: props.whiteMemberId,
      whiteRating: props.whiteRating ? props.whiteRating : null,
      whiteName: props.whiteName,
      blackMemberId: props.blackMemberId,
      blackRating: props.blackRating ? props.blackRating : null,
      blackName: props.blackName,
      result: props.result,
      date: props.date,
      type: props.type,
      // pre-sets:
      id: uuidv4(),
      _version: 1,
      shouldSave: true,
      updatedAt: timeStamp,
      createdAt: timeStamp,
      __typename: "Game",
      _lastChangedAt: Date.now()
    };
  }

  toJSON() {
    return JSON.stringify(this._game);
  }

  get game() {
    return this._game;
  }
}
