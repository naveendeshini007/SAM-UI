import AppRoutes from "./routes";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* You could put a Global Navbar here */}
      <main>
        <AppRoutes /> 
      </main>
    </div>
  );
}

export default App;