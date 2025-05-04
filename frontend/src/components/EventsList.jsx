import React from 'react';
import { format } from 'date-fns';

const EventsList = ({ events }) => {
  // Group events by month and year
  const groupedEvents = events.reduce((groups, event) => {
    const date = new Date(event.startDate);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push(event);
    return groups;
  }, {});

  // Sort months chronologically
  const sortedMonths = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  return (
    <div className="events-list">
      {sortedMonths.map(month => (
        <div key={month} className="event-month">
          <h2 className="month-heading">{month}</h2>
          <div className="month-events">
            {groupedEvents[month].map(event => (
              <div key={event._id} className="event-card">
                <div className="event-date">
                  <div className="event-day">{format(new Date(event.startDate), 'dd')}</div>
                  <div className="event-weekday">{format(new Date(event.startDate), 'EEE')}</div>
                </div>
                <div className="event-details">
                  <h3 className="event-title">{event.eventName}</h3>
                  <p className="event-time">
                    {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                  </p>
                  <p className="event-location">
                    {event.isOnline ? '🌐 Online Event' : `📍 ${event.location}`}
                  </p>
                  <p className="event-description">{event.eventDetails}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {sortedMonths.length === 0 && (
        <div className="no-events">
          <p>No upcoming events found.</p>
        </div>
      )}
    </div>
  );
};

export default EventsList;
