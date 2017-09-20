export default (options) => {
  const { type, code, isAltKey = false } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, data, change) {
      // Check that the key pressed matches our `code` option.
      if (!event.metaKey || event.which != code || event.altKey != isAltKey) return;

      // Prevent the default characters from being inserted.
      event.preventDefault();

      // Toggle the mark `type`.
      change.toggleMark(type);
      return true;
    },
  };
};
