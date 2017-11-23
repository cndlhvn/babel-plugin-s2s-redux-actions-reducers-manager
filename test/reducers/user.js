import { handleActions } from "redux-actions";
import * as actions from "../actions";

const initialState = {
  coins: [],
  coinsRequest: false
};

export default handleActions({
  [actions.getCoinsRequest]: (state, action) => ({
    ...state
  }),
}, initialState);