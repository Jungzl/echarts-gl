/* jshint node: true */
import {defineConfig} from '@rspack/cli';

export default defineConfig((env, options) => {
  return {
    entry: {
      'echarts-gl': './src/export/all.js'
    },
    optimization: {
      concatenateModules: true
    },
    devtool: options.mode === 'production' ? false :'source-map',
    output: {
      libraryTarget: 'umd',
      library: ['echarts-gl'],
      path: './dist',
      filename: options.mode === 'production' ? '[name].min.cjs' : '[name].cjs',
    },
    externals: {
      'echarts/lib/echarts': 'echarts'
    }
  };
});
