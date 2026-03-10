import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TheaterList from "./pages/TheaterList";
import ShowList from "./pages/ShowList";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import { getAuth, clearAuth } from "./utils/storage";

function LegacyPage({ Component, auth, setAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const route = useMemo(
    () => ({
      path: location.pathname,
      query: new URLSearchParams(location.search),
    }),
    [location.pathname, location.search]
  );

  const logout = () => {
    clearAuth();
    setAuth(null);
    navigate("/home");
  };

  return <Component route={route} auth={auth} navigate={navigate} logout={logout} />;
}

function ProtectedRoute({ auth, children, redirectTo = "/login" }) {
  const location = useLocation();
  if (!auth?.token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return children;
}

function AdminRoute({ auth, children }) {
  if (auth?.role !== "ADMIN") {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

function App() {
  const [auth, setAuth] = useState(() => getAuth());

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <Home
              auth={auth}
              onLogout={() => {
                clearAuth();
                setAuth(null);
              }}
            />
          }
        />
        <Route
          path="/movies"
          element={
            <Movies
              auth={auth}
              onLogout={() => {
                clearAuth();
                setAuth(null);
              }}
            />
          }
        />
        <Route path="/login" element={<Login onLogin={setAuth} />} />
        <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
        <Route path="/admin-login" element={<Login onLogin={setAuth} adminOnly />} />
        <Route path="/register" element={<LegacyPage Component={Register} auth={auth} setAuth={setAuth} />} />

        <Route
          path="/theaters"
          element={
            <ProtectedRoute auth={auth}>
              <LegacyPage Component={TheaterList} auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shows"
          element={
            <ProtectedRoute auth={auth}>
              <LegacyPage Component={ShowList} auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seats"
          element={
            <ProtectedRoute auth={auth}>
              <LegacyPage Component={SeatSelection} auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute auth={auth}>
              <LegacyPage Component={Payment} auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute auth={auth}>
              <LegacyPage Component={BookingSuccess} auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute auth={auth}>
              <LegacyPage Component={MyBookings} auth={auth} setAuth={setAuth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute auth={auth} redirectTo="/admin-login">
              <AdminRoute auth={auth}>
                <LegacyPage Component={AdminDashboard} auth={auth} setAuth={setAuth} />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
