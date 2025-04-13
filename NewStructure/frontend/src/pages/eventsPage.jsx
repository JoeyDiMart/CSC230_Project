import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './eventsPage.css';

const locales = {
    'en-US': enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

function Events({ role, email, name }) {
    const [events, setEvents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        eventName: '',
        eventDetails: '',
        location: '',
        isOnline: false,
        startDate: new Date(),
        endDate: new Date()
    });
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:8081/events', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                const formattedEvents = data.map(event => ({
                    ...event,
                    start: new Date(event.startDate),
                    end: new Date(event.endDate),
                    title: event.eventName // for react-big-calendar
                }));
                setEvents(formattedEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newEvent.eventName) {
            alert('Please enter an event name');
            return;
        }

        try {
            const url = selectedEvent
                ? `http://localhost:8081/events/${selectedEvent._id}`
                : 'http://localhost:8081/events';
            
            const method = selectedEvent ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    eventName: newEvent.eventName,
                    eventDetails: newEvent.eventDetails,
                    location: newEvent.location,
                    isOnline: newEvent.isOnline,
                    startDate: newEvent.startDate,
                    endDate: newEvent.endDate
                })
            });

            if (response.ok) {
                fetchEvents();
                handleModalClose();
            } else {
                const error = await response.json();
                alert(error.message || 'Error saving event');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error saving event');
        }
    };

    const handleSelectSlot = () => {
        console.log('Slot selected');
    };

    const handleSelectEvent = (event) => {
        if (!['admin', 'publisher'].includes(role)) {
            alert('Only administrators and publishers can edit events');
            return;
        }
        setSelectedEvent(event);
        setNewEvent({
            eventName: event.eventName,
            eventDetails: event.eventDetails,
            location: event.location || '',
            isOnline: event.isOnline || false,
            startDate: new Date(event.start),
            endDate: new Date(event.end)
        });
        setShowAddModal(true);
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        setSelectedEvent(null);
        setNewEvent({
            eventName: '',
            eventDetails: '',
            location: '',
            isOnline: false,
            startDate: new Date(),
            endDate: new Date()
        });
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;

        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`http://localhost:8081/events/${selectedEvent._id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    fetchEvents();
                    handleModalClose();
                } else {
                    const error = await response.json();
                    alert(error.message || 'Error deleting event');
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Error deleting event');
            }
        }
    };

    const handleNavigate = (action) => {
        const currentDate = new Date(date);
        
        switch (action) {
            case 'PREV':
                switch (view) {
                    case 'month':
                        setDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
                        break;
                    case 'week':
                        setDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
                        break;
                    case 'day':
                        setDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
                        break;
                }
                break;
            case 'NEXT':
                switch (view) {
                    case 'month':
                        setDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
                        break;
                    case 'week':
                        setDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
                        break;
                    case 'day':
                        setDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
                        break;
                }
                break;
            case 'TODAY':
                setDate(new Date());
                break;
            default:
                setDate(new Date(action));
                break;
        }
    };

    const formatDateLabel = () => {
        const options = {
            month: 'long',
            year: 'numeric'
        };

        if (view === 'week') {
            const weekStart = new Date(date);
            const weekEnd = new Date(date);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return `${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} ${weekStart.getFullYear()}`;
        }

        if (view === 'day') {
            options.day = 'numeric';
        }

        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <div className="calendar-wrapper">
            <div className="events-page">
                <div className="events-header">
                    <h1>Events Calendar</h1>
                    {['admin', 'publisher'].includes(role) && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="add-event-btn"
                        >
                            Add Event
                        </button>
                    )}
                </div>

                <div className="calendar-container">
                    <div className="calendar-controls">
                        <div className="view-controls">
                            <button 
                                onClick={() => setView('month')}
                                className={view === 'month' ? 'active' : ''}
                            >
                                Month
                            </button>
                            <button 
                                onClick={() => setView('week')}
                                className={view === 'week' ? 'active' : ''}
                            >
                                Week
                            </button>
                            <button 
                                onClick={() => setView('day')}
                                className={view === 'day' ? 'active' : ''}
                            >
                                Day
                            </button>
                        </div>
                        <div className="current-date">
                            {formatDateLabel()}
                        </div>
                        <div className="navigation-controls">
                            <button onClick={() => handleNavigate('PREV')}>Previous</button>
                            <button onClick={() => handleNavigate('TODAY')}>Today</button>
                            <button onClick={() => handleNavigate('NEXT')}>Next</button>
                        </div>
                    </div>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        selectable
                        tooltipAccessor={event => `${event.eventName}\n${event.eventDetails || ''}`}
                        eventPropGetter={(event) => ({
                            style: {
                                backgroundColor: '#C8102E',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }
                        })}
                        views={['month', 'week', 'day']}
                        view={view}
                        onView={setView}
                        date={date}
                        onNavigate={handleNavigate}
                        toolbar={false}
                    />
                </div>

                {showAddModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>{selectedEvent ? 'Edit Event' : 'Add New Event'}</h2>
                            <form onSubmit={handleSubmit} className="event-form">
                                <div className="form-group">
                                    <label>Event Name</label>
                                    <input
                                        type="text"
                                        value={newEvent.eventName}
                                        onChange={(e) => setNewEvent({...newEvent, eventName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Event Details</label>
                                    <textarea
                                        value={newEvent.eventDetails}
                                        onChange={(e) => setNewEvent({...newEvent, eventDetails: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newEvent.isOnline}
                                            onChange={(e) => setNewEvent({...newEvent, isOnline: e.target.checked})}
                                        />
                                        Online Event
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="datetime-local"
                                        value={format(newEvent.startDate, "yyyy-MM-dd'T'HH:mm")}
                                        onChange={(e) => setNewEvent({...newEvent, startDate: new Date(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="datetime-local"
                                        value={format(newEvent.endDate, "yyyy-MM-dd'T'HH:mm")}
                                        onChange={(e) => setNewEvent({...newEvent, endDate: new Date(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    {selectedEvent && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleModalClose}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        {selectedEvent ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events;
