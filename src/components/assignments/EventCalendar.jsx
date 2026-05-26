import { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Clock } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay } from "date-fns";

const TYPE_COLORS = {
  Meeting: "bg-primary/80",
  Expedition: "bg-accent/80",
  Fundraiser: "bg-emerald-500/80",
  Training: "bg-violet-500/80",
  Outreach: "bg-amber-500/80",
  Other: "bg-muted-foreground/80",
};

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    db.Event.list("date").then(setEvents);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const eventsOnDay = (day) => events.filter(e => e.date && isSameDay(new Date(e.date + "T00:00:00"), day));
  const selectedEvents = selectedDay ? eventsOnDay(selectedDay) : [];

  const upcomingEvents = events
    .filter(e => e.date && new Date(e.date + "T00:00:00") >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Event Calendar</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 frost-glass rounded-xl p-6 border border-border">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-foreground text-lg">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs text-muted-foreground font-semibold py-2">{d}</div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {days.map(day => {
              const dayEvents = eventsOnDay(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-lg text-sm transition-all ${
                    isSelected ? "bg-primary/20 border border-primary/40" :
                    isToday ? "bg-secondary border border-primary/20" :
                    "hover:bg-secondary/60"
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? "text-primary" : "text-foreground"}`}>
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                      {dayEvents.slice(0, 3).map((e, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${TYPE_COLORS[e.type] || "bg-primary"}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-border">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Day Events */}
          {selectedDay && (
            <div className="frost-glass rounded-xl p-5 border border-primary/20">
              <h4 className="font-semibold text-foreground mb-3 text-sm">
                {format(selectedDay, "MMMM d, yyyy")}
              </h4>
              {selectedEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events this day.</p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map(e => (
                    <EventItem key={e.id} event={e} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="frost-glass rounded-xl p-5 border border-border">
            <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Upcoming</h4>
            {upcomingEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming events.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(e => (
                  <EventItem key={e.id} event={e} showDate />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EventItem({ event, showDate }) {
  return (
    <div className="flex gap-3">
      <div className={`w-1 rounded-full flex-shrink-0 ${TYPE_COLORS[event.type] || "bg-primary"}`} />
      <div className="min-w-0">
        <p className="text-foreground text-sm font-medium truncate">{event.title}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {showDate && event.date && (
            <span className="text-xs text-primary">{format(new Date(event.date + "T00:00:00"), "MMM d")}</span>
          )}
          {event.time && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />{event.time}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />{event.location}
            </span>
          )}
        </div>
        {event.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
        )}
      </div>
    </div>
  );
}