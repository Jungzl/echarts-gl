// TODO ECharts GL must be imported whatever component,charts is imported.
import '../../echarts-gl.js';

import FlowGLSeries from './FlowGLSeries.js';
import FlowGLView from './FlowGLView.js';

export function install(registers) {
    registers.registerChartView(FlowGLView);
    registers.registerSeriesModel(FlowGLSeries);
}
