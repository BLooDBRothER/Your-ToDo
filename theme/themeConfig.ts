import { ThemeConfig, theme } from 'antd';

const themeConfig: ThemeConfig = {
  "algorithm": [theme.darkAlgorithm],
  "token": {
    "colorPrimary": "#901ed6",
    "colorInfo": "#901ed6"
  },
  "components": {
    "Input": {
      "colorBgContainer": "rgba(34, 34, 37, 0.7)"
    },
    "Tree": {
      "controlItemBgActive": "#222225",
      "borderRadius": 6
    }
  },
};

export default themeConfig;
