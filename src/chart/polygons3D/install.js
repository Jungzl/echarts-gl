// TODO ECharts GL must be imported whatever component,charts is imported.
import '../../echarts-gl.js';

import Polygons3DSeries from './Polygons3DSeries.js';
import Polygons3DView from './Polygons3DView.js';

export function install(registers) {
    registers.registerChartView(Polygons3DView);
    registers.registerSeriesModel(Polygons3DSeries);
}
