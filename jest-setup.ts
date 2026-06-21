jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest setup file, need to use require() instead of import.
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)
