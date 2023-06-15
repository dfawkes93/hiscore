import "./App.css";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App bg-gray-800 text-slate-300">
      <Header />
      <div className="container mx-auto">
        <Outlet />
      </div>
      <div>
        Developed by Dylan Fawkes. Send bug reports and feature requests to the{" "}
        <a
          href="https://github.com/dfawkes93/hiscore/issues"
          className="text-indigo-400"
        >
          Github Repo
        </a>
      </div>
    </div>
  );
}

export default App;
