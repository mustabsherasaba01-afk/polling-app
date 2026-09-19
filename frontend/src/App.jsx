import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePoll from "./pages/CreatePoll";
import PollResults from "./pages/PollResults";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/create-poll"
            element={
              <ProtectedRoute>
                <CreatePoll />
              </ProtectedRoute>
            }
          />

          <Route
            path="/poll/:pollId"
            element={<PollResults />}
          />

        </Routes>
      </main>
    </>
  );
}

export default App;