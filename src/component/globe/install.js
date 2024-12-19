// TODO ECharts GL must be imported whatever component,charts is imported.
import '../../echarts-gl.js';

import GlobeModel from './GlobeModel.js';
import GlobeView from './GlobeView.js';
import globeCreator from '../../coord/globeCreator.js';

export function install(registers) {
    registers.registerComponentModel(GlobeModel);
    registers.registerComponentView(GlobeView);

    registers.registerCoordinateSystem('globe', globeCreator);

    registers.registerAction({
        type: 'globeChangeCamera',
        event: 'globecamerachanged',
        update: 'series:updateCamera'
    }, function (payload, ecModel) {
        ecModel.eachComponent({
            mainType: 'globe', query: payload
        }, function (componentModel) {
            componentModel.setView(payload);
        });
    });

    registers.registerAction({
        type: 'globeUpdateDisplacment',
        event: 'globedisplacementupdated',
        update: 'update'
    }, function (payload, ecModel) {
        // Noop
    });

}
