import React from 'react';
import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

/**
 * 飞书图标SVG组件
 * 提供飞书Logo的矢量图形显示
 */
const FeishuSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M282.112 190.5664a1160.2432 1160.2432 0 0 1 259.072 305.1008l66.7136-65.8432A328.3456 328.3456 0 0 1 718.5408 358.4a506.7264 506.7264 0 0 0-90.88-173.8752 26.368 26.368 0 0 0-20.6848-9.9328H287.7952a9.0112 9.0112 0 0 0-5.7344 15.9744z m185.088 421.888c48.4352 20.6848 98.8672 38.0928 150.3232 51.968 91.4432 24.7296 178.2784-12.1856 221.0816-94.0032l51.8656-103.3728c11.5712-25.2416 26.3168-48.64 43.9296-69.888a280.7808 280.7808 0 0 0-97.6896-17.3568A281.4976 281.4976 0 0 0 638.464 460.8l-79.2576 78.2848a560.5888 560.5888 0 0 1-92.0576 73.3696zM104.8576 423.7824a9.0112 9.0112 0 0 0-15.2576 6.4512l0.2048 312.1664c0 9.0112 4.4032 17.2544 11.6736 22.016a507.8528 507.8528 0 0 0 282.112 84.992 508.7744 508.7744 0 0 0 354.9184-143.5136c-41.2672 12.0832-86.528 12.8-132.1472 0.512-192.768-51.968-361.1648-146.944-501.504-282.624z" />
  </svg>
);

/**
 * 飞书图标组件
 * 基于Ant Design Icon封装的飞书图标组件
 * @param props - 继承自Ant Design Icon的属性
 * @param ref - 组件引用
 * @returns 飞书图标React组件
 */
const FeishuIcon = React.forwardRef<HTMLSpanElement, Partial<CustomIconComponentProps>>((props, ref) => {
  return <Icon ref={ref} component={FeishuSvg} {...props} />;
});

FeishuIcon.displayName = 'FeishuIcon';

export default FeishuIcon;
