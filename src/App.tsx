import "./App.css";

function App() {
  return (
    <div className="min-h-screen">
      <h1 className="flex justify-center items-center text-4xl">
        Login
      </h1>
      <div className="flex justify-center items-center">
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 p-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </form>
    </div>
    </div>
  );
}

export default App;
