import {BiTrendingUp,BiTrendingDown} from 'react-icons/bi';
import React, { useState, useEffect } from 'react';

const statsTemplate = [
  {
    title: 'Total Website Views',
    value: '',
    trend: '+12.5%',
    trendDirection: 'up',
    footer: 'Trending up this month',
    description: 'Visitors for the last 6 months'
  },
  {
    title: 'New Users',
    value: '',
    trend: '+20%',
    trendDirection: 'up',
    footer: 'Down 20% this period',
    description: 'Acquisition needs attention'
  },
  {
    title: 'Total Publications',
    value: '',
    trend: '+12.5%',
    trendDirection: 'up',
    footer: 'Strong user retention',
    description: 'Engagement exceed targets'
  },
    {
        title: 'Active Reviewers',
        value: '',
        trend: '+5%',
        trendDirection: 'up',
        footer: 'Reviewer activity increasing',
        description: 'Total active reviewers in the system'
    }
];

const StatCard = ({ title, value, trend, trendDirection, footer, description }) => {
    const isUp = trendDirection === 'up';
    const trendIcon = isUp ? <BiTrendingUp/> : <BiTrendingDown />;
    const trendColor = isUp ? 'text-green-600' : 'text-red-500';

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
    const [stats, setStats] = useState(statsTemplate);

    useEffect(() => {
        // get total publications
        const fetchTotalPublications = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/publications/count'); // Replace ith your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch total publications');
                }
                const { total } = await response.json();

                setStats((prevStats) =>
                    prevStats.map((stat) =>
                        stat.title === 'Total Publications' ? { ...stat, value: total } : stat
                    )
                );
            } catch (error) {
                console.error('Error fetching total publications:', error);
            }
        };
        // get total views
        const fetchTotalViews = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/views/count'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch total views');
                }
                const { total } = await response.json();

                setStats((prevStats) =>
                    prevStats.map((stat) =>
                        stat.title === 'Total Website Views' ? { ...stat, value: total } : stat
                    )
                );
            } catch (error) {
                console.error('Error fetching total views:', error);
            }
        };
        // gets the total amount of users
        const fetchTotalUsers = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/users/count'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch total users');
                }
                const { total } = await response.json();

                setStats((prevStats) =>
                    prevStats.map((stat) =>
                        stat.title === 'New Users' ? { ...stat, value: total } : stat
                    )
                );
            } catch (error) {
                console.error('Error fetching total users:', error);
            }
        };

        // Fetch active reviewers
        const fetchActiveReviewers = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/reviewers/active'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch active reviewers');
                }
                const { total } = await response.json();

                setStats((prevStats) =>
                    prevStats.map((stat) =>
                        stat.title === 'Active Reviewers' ? { ...stat, value: total } : stat
                    )
                );
            } catch (error) {
                console.error('Error fetching active reviewers:', error);
            }
        };
        fetchTotalUsers();
        fetchTotalViews();
        fetchTotalPublications();
        fetchActiveReviewers();

    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    );
};
export default SectionCards;
