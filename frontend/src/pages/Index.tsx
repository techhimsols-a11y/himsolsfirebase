import Home from './Home';
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex items-center">
      <Home />
      {/* Admin button for accessing the admin panel */}
      <Link to="/admin" className="admin-nav-btn px-4 py-2 mt-4 ml-4 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors">Admin</Link>
    </div>
  );
};

export default Index;
