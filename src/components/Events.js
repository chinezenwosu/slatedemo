export const replaceText = (options) => {
  const { text, code, isShiftKey = false } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, data, change) {
      if (event.which === code && event.shiftKey === isShiftKey) {
          // Prevent the character from being inserted.
          event.preventDefault();

          // Change the state by inserting 'text' at the cursor's position.
          change.insertText(text);
          return true;
      }
    },
  };
};
