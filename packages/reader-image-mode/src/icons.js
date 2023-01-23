import {
  faBookOpen,
  faSearchMinus,
  faSearchPlus,
  faHighlighter,
  faHome,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons';

const iconMap = [
  faBookOpen,
  faSearchMinus,
  faSearchPlus,
  faHighlighter,
  faHome,
  faWindowMaximize,
].reduce((map, obj) => {
  return { ...map, [obj.iconName]: obj };
}, {});

export default iconMap;
