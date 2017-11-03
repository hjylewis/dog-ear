export default {
  NO_STORAGE: () => new Error('Missing chrome storage'),

  TAB_HAS_ID: () => new Error('Tab already has ID'),
  TAB_RESERVED_ID: () => new Error('Tab has a reserved ID'),
  TAB_NO_ID: () => new Error('Tab has no ID'),
  TAB_NO_URL: () => new Error('Tab has no url (required)'),

  TAB_ID_NOT_FOUND: id => new Error(`Tab id (${id}) is not stored in array`),
};
