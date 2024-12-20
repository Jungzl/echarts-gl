// TODO ECharts GL must be imported whatever component,charts is imported.
import '../../echarts-gl.js';


import registerBarLayout from './bar3DLayout.js';
import Bar3DSeries from './Bar3DSeries.js';
import Bar3DView from './Bar3DView.js';

export function install(registers) {
    registers.registerChartView(Bar3DView);
    registers.registerSeriesModel(Bar3DSeries);

    registerBarLayout(registers);

    registers.registerProcessor(function (ecModel, api) {
        ecModel.eachSeriesByType('bar3d', function (seriesModel) {
            var data = seriesModel.getData();
            data.filterSelf(function (idx) {
                return data.hasValue(idx);
            });
        });
    });
}
