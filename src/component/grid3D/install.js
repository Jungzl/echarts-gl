// TODO ECharts GL must be imported whatever component,charts is imported.
import '../../echarts-gl.js';

import Grid3DModel from './Grid3DModel.js';
import Grid3DView from './Grid3DView.js';
import grid3DCreator from '../../coord/grid3DCreator.js';
import Axis3DModel from './Axis3DModel.js';
import createAxis3DModel from './createAxis3DModel.js';


function getAxisType(axisDim, option) {
    // Default axis with data is category axis
    return option.type || (option.data ? 'category' : 'value');
}
export function install(registers) {
    registers.registerComponentModel(Grid3DModel);
    registers.registerComponentView(Grid3DView);

    registers.registerCoordinateSystem('grid3D', grid3DCreator);


    ['x', 'y', 'z'].forEach(function (dim) {
        createAxis3DModel(registers, dim, Axis3DModel, getAxisType, {
            name: dim.toUpperCase()
        });
        const AxisView = registers.ComponentView.extend({
            type: dim + 'Axis3D'
        });
        registers.registerComponentView(AxisView);
    });


    registers.registerAction({
        type: 'grid3DChangeCamera',
        event: 'grid3dcamerachanged',
        update: 'series:updateCamera'
    }, function (payload, ecModel) {
        ecModel.eachComponent({
            mainType: 'grid3D', query: payload
        }, function (componentModel) {
            componentModel.setView(payload);
        });
    });

    registers.registerAction({
        type: 'grid3DShowAxisPointer',
        event: 'grid3dshowaxispointer',
        update: 'grid3D:showAxisPointer'
    }, function (payload, ecModel) {
    });

    registers.registerAction({
        type: 'grid3DHideAxisPointer',
        event: 'grid3dhideaxispointer',
        update: 'grid3D:hideAxisPointer'
    }, function (payload, ecModel) {
    });
}

