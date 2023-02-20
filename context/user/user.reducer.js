export const userReducer = (state = {}, payload) => {
  state = JSON.parse(JSON.stringify(payload));
  return state;
};
