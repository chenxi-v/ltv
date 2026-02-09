/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WeekdaySelectorProps {
  onWeekdayChange: (weekday: string) => void;
  className?: string;
}

const weekdays = [
  { value: 'Mon', label: '周一', shortLabel: '周一' },
  { value: 'Tue', label: '周二', shortLabel: '周二' },
  { value: 'Wed', label: '周三', shortLabel: '周三' },
  { value: 'Thu', label: '周四', shortLabel: '周四' },
  { value: 'Fri', label: '周五', shortLabel: '周五' },
  { value: 'Sat', label: '周六', shortLabel: '周六' },
  { value: 'Sun', label: '周日', shortLabel: '周日' },
];

const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  onWeekdayChange,
  className = '',
}) => {
  // 获取今天的星期数，默认选中今天
  const getTodayWeekday = (): string => {
    const today = new Date().getDay();
    // getDay() 返回 0-6，0 是周日，1-6 是周一到周六
    const weekdayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdayMap[today];
  };

  const [selectedWeekday, setSelectedWeekday] =
    useState<string>(getTodayWeekday());

  // 添加指示器状态
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  // 按钮引用
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 更新指示器位置
  const updateIndicatorPosition = (weekdayValue: string) => {
    const index = weekdays.findIndex((w) => w.value === weekdayValue);
    const button = buttonRefs.current[index];
    if (button) {
      const timeoutId = setTimeout(() => {
        const buttonRect = button.getBoundingClientRect();
        const container = button.parentElement;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          setIndicatorStyle({
            left: buttonRect.left - containerRect.left,
            width: buttonRect.width,
          });
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  };

  // 监听选中星期变化
  useEffect(() => {
    const cleanup = updateIndicatorPosition(selectedWeekday);
    return cleanup;
  }, [selectedWeekday]);

  // 组件初始化时通知父组件默认选中的星期
  useEffect(() => {
    onWeekdayChange(getTodayWeekday());
  }, []); // 只在组件挂载时执行一次

  return (
    <div
      className={`relative inline-flex bg-gray-200/60 rounded-full p-0.5 sm:p-1 dark:bg-gray-700/60 backdrop-blur-sm ${className}`}
    >
      {/* 滑动的白色背景指示器 */}
      {indicatorStyle.width > 0 && (
        <div
          className='absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 bg-white dark:bg-gray-500 rounded-full shadow-sm transition-all duration-300 ease-out'
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      )}

      {weekdays.map((weekday, index) => {
        const isActive = selectedWeekday === weekday.value;
        return (
          <button
            key={weekday.value}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onClick={() => {
              setSelectedWeekday(weekday.value);
              onWeekdayChange(weekday.value);
            }}
            className={`
              relative z-10 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap
              ${
                isActive
                  ? 'text-gray-900 dark:text-gray-100 font-semibold cursor-default'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer'
              }
            `}
            title={weekday.label}
          >
            {weekday.shortLabel}
          </button>
        );
      })}
    </div>
  );
};

export default WeekdaySelector;
