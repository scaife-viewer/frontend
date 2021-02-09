import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons';

const iconMap = [faCog, faTimes].reduce((map, obj) => {
    return {
        ...map,
        [obj.iconName]: obj,
    };
}, {});

export default iconMap;
