// const path = require('path');

// module.exports = {
//     // ... other webpack configuration ...

//     module: {
//         rules: [
//             {
//                 test: '/\.(js|jsx)$',
//                 exclude: /node_modules\/(?!mapbox-gl)/, // Exclude node_modules except mapbox-gl
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: ['@babel/preset-env', '@babel/preset-react'],
//                         // Add other Babel options here as needed
//                     }
//                 }
//             },
//             // ... other rules ...
//         ]
//     },

//     resolve: {
//         alias: {
//             // You can use an alias to map mapbox-gl to a specific file if needed.
//             // Example:
//             // 'mapbox-gl': path.resolve(__dirname, 'node_modules/mapbox-gl/dist/mapbox-gl.js')
//         }
//     }
// };
