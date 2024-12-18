// TODO ECharts GL must be imported whatever component,charts is imported.
import '../../echarts-gl.js';

import LinesGLSeries from './LinesGLSeries.js';
import LinesGLView from './LinesGLView.js';

export function install(registers) {
    registers.registerChartView(LinesGLView);
    registers.registerSeriesModel(LinesGLSeries);
}
