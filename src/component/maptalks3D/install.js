// TODO ECharts GL must be imported whatever component,charts is imported.
import '../../echarts-gl.js';

import Maptalks3DModel from './Maptalks3DModel.js';
import Maptalks3DView from './Maptalks3DView.js';
import maptalks3DCreator from '../../coord/maptalks3DCreator.js';

export function install(registers) {
    registers.registerComponentModel(Maptalks3DModel);
    registers.registerComponentView(Maptalks3DView);

    registers.registerCoordinateSystem('maptalks3D', maptalks3DCreator);

    registers.registerAction({
        type: 'maptalks3DChangeCamera',
        event: 'maptalks3dcamerachanged',
        update: 'maptalks3D:updateCamera'
    }, function (payload, ecModel) {
        ecModel.eachComponent({
            mainType: 'maptalks3D', query: payload
        }, function (componentModel) {
            componentModel.setMaptalksCameraOption(payload);
        });
    });
}
