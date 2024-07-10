import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from "react-router-dom";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // temporary navigation to the rest of the app

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        alert(`Logging in with username: ${username} and password: ${password}`);
        navigate("/inventory"); // Temporary navigation to the rest of the app

    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex flex-1 bg-blue-300">
                {/* Desktop Welcome Card */}
                <div className="flex items-center justify-center w-full">
                    <div className="text-center p-8 bg-blue-900 text-white rounded-lg shadow-lg">
                        <img src="src/assets/TradeTrackLogo.png" alt="Company Logo" className="w-32 h-32 mx-auto" />
                        <h1 className="text-4xl font-bold mt-4">Welcome to TradeTrack</h1>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-white">
                {/* Login Card */}
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
                            Login
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        Don't have an account? <a href="/register" className="text-blue-500">Register</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
