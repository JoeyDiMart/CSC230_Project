import React from 'react';
import {BiTrendingUp,BiTrendingDown} from 'react-icons/bi';

const stats = [
  {
    title: 'Total Website Views',
    value: '1,250.00',
    trendIcon: <BiTrendingUp />,
    trend: '+12.5%',
    trendDirection: 'up',
    footer: 'Trending up this month',
    description: 'Visitors for the last 6 months'
  },
  {
    title: 'New Users',
    value: '1,234',
    trendIcon: <BiTrendingUp />,
    trend: '-20%',
    trendDirection: 'down',
    footer: 'Down 20% this period',
    description: 'Acquisition needs attention'
  },
  {
    title: 'Total Publications',
    value: '45,678',
    trendIcon: <BiTrendingUp />,
    trend: '+12.5%',
    trendDirection: 'up',
    footer: 'Strong user retention',
    description: 'Engagement exceed targets'
  },
  {
    title: 'Growth Rate',
    value: '4.5%',
    trendIcon: <BiTrendingUp />,
    trend: '+4.5%',
    trendDirection: 'up',
    footer: 'Steady performance',
    description: 'Meets growth projections'
  }
];

const StatCard = ({ title, value, trend, trendIcon, trendDirection, footer, description }) => {
    const Icon = trendDirection === 'up' ? <BiTrendingUp/> : <BiTrendingDown />;
    const trendColor = trendDirection === 'up' ? 'text-green-600' : 'text-red-500';

  return (
    <div className="bg-none rounded-xl shadow p-4 relative border-solid border-2 border-testingColorGrey ">
      <div className="text-sm flex justify-start text-testingColorSubtitle ">{title}</div>
      <div className="text-2xl text-testingColorWhite font-semibold mt-1 flex justify-start ">{value}</div>
      <div className=" bg-cirtGrey absolute top-4 right-4  px-2 py-1 rounded text-xs flex items-center gap-1 ">
        <span className={trendColor}>{trendIcon}</span>
        <span className={trendColor}>{trend}</span>
      </div>
      
      <div className="text-testingColorSubtitle mt-4 text-sm font-medium flex items-center gap-2">
        {footer} {trendIcon}
      </div>
      <div className="text-sm text-white flex items-start">{description}</div>
    </div>
  );
};

const SectionCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default SectionCards;
