export default {
    NO_STORAGE: () => new Error('Missing chrome storage'),

    TAB_HAS_ID: () => new Error('Tab already has ID'),
    TAB_NO_ID: () => new Error('Tab has no ID'),
    TAB_NO_URL: () => new Error('Tab has no url (required)'),

    TAB_ID_NOT_FOUND: () => new Error('Tab id is not stored in array')
};
