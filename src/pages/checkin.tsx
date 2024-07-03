import Sidebar from "../components/sidebar";

export default function Checkin() {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="flex-1 p-5">
                <div className="bg-white p-3 shadow rounded">
                    <h2 className="text-gray-800 text-2xl">Checkin</h2>
                    /* Add your main content here */
                </div>
            </div>
        </div>
    );
    }
