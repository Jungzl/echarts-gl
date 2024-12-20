// TODO ECharts GL must be imported whatever component,charts is imported.
import '../../echarts-gl.js';

import Geo3DModel from './Geo3DModel.js';
import Geo3DView from './Geo3DView.js';
import geo3DCreator from '../../coord/geo3DCreator.js';

export function install(registers) {
    registers.registerComponentModel(Geo3DModel);
    registers.registerComponentView(Geo3DView);

    registers.registerAction({
        type: 'geo3DChangeCamera',
        event: 'geo3dcamerachanged',
        update: 'series:updateCamera'
    }, function (payload, ecModel) {
        ecModel.eachComponent({
            mainType: 'geo3D', query: payload
        }, function (componentModel) {
            componentModel.setView(payload);
        });
    });

    registers.registerCoordinateSystem('geo3D', geo3DCreator);

}
