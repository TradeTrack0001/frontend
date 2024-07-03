import Sidebar from "../components/sidebar";

export default function Checkout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="flex-1 p-5">
                <div className="bg-white p-3 shadow rounded">
                    <h2 className="text-gray-800 text-2xl mb-4">Check Out Details</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Material Details */}
                        <div>
                            <h3 className="text-gray-800 text-xl mb-2">Material Details</h3>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700">ID</label>
                                    <input 
                                        type="text"
                                        placeholder="1"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        placeholder="4' ABS Pipe"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        placeholder="Warehouse"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Check Out Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="1"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Available Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="99"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </form>
                        </div>
                        
                        {/* Check Out To */}
                        <div>
                            <h3 className="text-gray-800 text-xl mb-2">Check Out To</h3>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Employee ID</label>
                                    <input
                                        type="text"
                                        placeholder="12345"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Employee Name</label>
                                    <input
                                        type="text"
                                        placeholder="XXXX"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Check Out Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Duration</label>
                                    <input
                                        type="number"
                                        placeholder="1"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Due On</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
