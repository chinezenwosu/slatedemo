function createUserAction(data) {
  console.log(data);
  return {
    type: 'CREATE_USER',
    data: data,
  };
}

export function userSignUpRequest(data) {
  return dispatch => {
    createUserAction(data);
  };
}
