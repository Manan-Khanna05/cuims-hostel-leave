import { Navigate, Route, Routes } from 'react-router-dom'
import LeaveApply from './pages/LeaveApply'
import LeaveDetails from './pages/LeaveDetails'
import LeaveEdit from './pages/LeaveEdit'
import { AppDataProvider } from './store/AppData'

export default function App() {
  return (
    <AppDataProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/leave" replace />} />
        <Route path="/leave" element={<LeaveApply />} />
        <Route path="/leave/details/:id" element={<LeaveDetails />} />
        <Route path="/leave/edit/:id" element={<LeaveEdit />} />
        <Route path="*" element={<Navigate to="/leave" replace />} />
      </Routes>
    </AppDataProvider>
  )
}
