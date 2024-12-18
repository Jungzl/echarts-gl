import Maptalks3D from './maptalks3D/Maptalks3D.js';
import createMapService3DCreator from './mapServiceCommon/createMapService3DCreator.js';

var maptalks3DCreator = createMapService3DCreator('maptalks3D', Maptalks3D, function (maptalks3DList) {
    maptalks3DList.forEach(function (maptalks3D) {
        maptalks3D.setCameraOption(maptalks3D.model.getMaptalksCameraOption());
    });
});

export default maptalks3DCreator;
