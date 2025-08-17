import React, { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';


const sampleActivities = [
  { id: 1, time: "2025-08-17 09:26", user: "Bob Manager", action: "created Project: Website Redesign" },
  { id: 2, time: "2025-08-17 09:27", user: "Alice Admin", action: "added user: Charlie Employee" },
  { id: 3, time: "2025-08-17 09:29", user: "Charlie Employee", action: "completed task: Design new homepage" },
];


export default function RecentActivityFeed({ activities }) {
  
  const [feed, setFeed] = useState(activities ?? sampleActivities);

  
  useEffect(() => {
    async function fetchFeed() {
      const res = await fetch('/api/activity'); 
      const data = await res.json();
      setFeed(data);
    }
    fetchFeed();
    const interval = setInterval(fetchFeed, 10000); 
    return () => clearInterval(interval);
  }, []);
  

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <HistoryIcon sx={{ mr: 1, color: 'primary.main', fontSize: 26 }} />
        <Typography variant="h6" fontWeight={700}>Recent Activity Feed</Typography>
      </Box>
      <List dense>
        {feed.map(act => (
          <ListItem key={act.id} divider>
            <ListItemText
              primary={`${act.user} ${act.action}`}
              secondary={act.time}
              primaryTypographyProps={{ fontSize: 14 }}
              secondaryTypographyProps={{ fontSize: 12 }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
