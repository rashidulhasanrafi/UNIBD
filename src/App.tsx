/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Routine } from "./pages/Routine";
import { CgpaTracker } from "./pages/CgpaTracker";
import { Tuition } from "./pages/Tuition";
import { Planner } from "./pages/Planner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/cgpa" element={<CgpaTracker />} />
          <Route path="/tuition" element={<Tuition />} />
          <Route path="/planner" element={<Planner />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
