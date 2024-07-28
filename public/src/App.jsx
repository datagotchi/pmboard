import React from "react";
import ResearchWidget from "./components/ResearchWidget";
// import VisionWidget from "./src/components/VisionWidget";
import Dashboard from "./components/Dashboard";

const App = () => (
  <Dashboard>
    <ResearchWidget />
    {/* <VisionWidget /> */}
  </Dashboard>
);

export default App;
