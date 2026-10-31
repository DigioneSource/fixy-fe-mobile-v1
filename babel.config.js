module.exports = function (api) {
  api.cache(true);
  // Các plugin class "loose" (sửa crash Hermes) chạy TRƯỚC preset TypeScript. Với file .ts/.tsx trong
  // node_modules có "parameter properties" (vd. expo/src/async-require/fetchAsync.native.ts:
  // constructor(public url: string)), chúng sinh ra mã không hợp lệ và làm hỏng bước biên dịch Hermes
  // của bản release. Vì vậy chỉ áp dụng cho mã của app và thư viện đã biên dịch sẵn sang JS.
  const classPlugins = [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['@babel/plugin-transform-classes', { loose: true }],
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: ['react-native-worklets/plugin'],
    overrides: [
      {
        exclude: /node_modules[\\/].*\.tsx?$/,
        plugins: classPlugins,
      },
    ],
  };
};
