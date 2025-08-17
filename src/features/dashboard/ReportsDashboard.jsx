import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const PROJECT_COLORS = ["#1976d2", "#2e7d32", "#ffd600"];
const TASK_COLORS = ["#0288d1", "#c62828"];

export default function ReportsDashboard({ projects = [], tasks = [] }) {
  projects = projects.length ? projects : [
    { name: "Website", status: "In Progress" },
    { name: "App", status: "Completed" },
    { name: "Portal", status: "To Do" },
  ];
  tasks = tasks.length ? tasks : [
    { title: "Design", status: "Completed" },
    { title: "Develop", status: "In Progress" },
    { title: "Test", status: "To Do" },
    { title: "Deploy", status: "Completed" },
  ];

  const projectData = [
    { name: "To Do", value: projects.filter((p) => p.status === "To Do").length },
    { name: "In Progress", value: projects.filter((p) => p.status === "In Progress").length },
    { name: "Completed", value: projects.filter((p) => p.status === "Completed").length },
  ];
  const taskData = [
    { name: "Open", value: tasks.filter((t) => t.status !== "Completed").length },
    { name: "Completed", value: tasks.filter((t) => t.status === "Completed").length },
  ];

  const productivityData = [
    { day: "Mon", completed: 1 },
    { day: "Tue", completed: 2 },
    { day: "Wed", completed: 1 },
    { day: "Thu", completed: 2 },
    { day: "Fri", completed: 3 },
  ];

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
      <Paper sx={{ p: 3, flex: 1, minWidth: 340 }}>
        <Typography variant="h6" gutterBottom>Project Status</Typography>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={projectData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {projectData.map((entry, idx) => (
                <Cell key={entry.name} fill={PROJECT_COLORS[idx % PROJECT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
      <Paper sx={{ p: 3, flex: 1, minWidth: 340 }}>
        <Typography variant="h6" gutterBottom>Task Completion</Typography>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={taskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {taskData.map((entry, idx) => (
                <Cell key={entry.name} fill={TASK_COLORS[idx % TASK_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
      <Paper sx={{ p: 3, flex: 1, minWidth: 400 }}>
        <Typography variant="h6" gutterBottom>Productivity This Week</Typography>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={productivityData}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#1976d2" name="Tasks Completed" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
