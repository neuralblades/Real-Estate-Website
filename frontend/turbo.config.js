module.exports = {
  // Configure loaders for different file types
  loaders: {
    // Handle media files
    '*.{webp,webm,mp4}': {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'static/media/',
      },
    },
  },
  
  // Configure resolve options
  resolve: {
    // Configure module aliases
    alias: {
      '@': './src',
    },
  },
};
