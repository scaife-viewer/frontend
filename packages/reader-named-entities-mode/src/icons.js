import {
  faGripLines,
  faGripLinesVertical,
  faAlignLeft,
} from "@fortawesome/free-solid-svg-icons";


const iconMap = [faGripLines, faGripLinesVertical, faAlignLeft].reduce(
  (map, obj) => {
    return {
      ...map,
      [obj.iconName]: obj,
    };
  },
  {}
);

export default iconMap;
