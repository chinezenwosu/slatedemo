export default function(state = [], action) {
  switch(action.type) {
    case 'CREATE_USER':
      console.log('action', action.data);
      return state;
      break;
    default:
      return state;
  }
}
