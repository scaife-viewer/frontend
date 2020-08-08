import {
  faChevronDown,
  faChevronRight,
  faArrowLeft,
  faArrowRight,
  faCog,
  faPlusSquare,
  faCheckSquare,
  faSquare,
  faMinusCircle
} from '@fortawesome/free-solid-svg-icons';

import faExpand from './faExpand';
import faCompress from './faCompress';

const iconMap = [
  faArrowLeft,
  faArrowRight,
  faExpand,
  faCog,
  faCompress,
  faChevronDown,
  faChevronRight,
  faMinusCircle,
  faSquare,
  faPlusSquare,
  faCheckSquare,
].reduce((map, obj) => {
  // eslint-disable-next-line no-param-reassign
  map[obj.iconName] = obj;
  return map;
}, {});

export default iconMap;
