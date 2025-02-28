import React from "react";

const page = () => {
  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to the Admin Panel
        </h1>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700">Recent Orders</h2>
          <table className="min-w-full mt-4 bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Order ID</th>
                <th className="py-2 px-4 border-b text-left">Customer</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">#1234</td>
                <td className="py-2 px-4 border-b">John Doe</td>
                <td className="py-2 px-4 border-b text-green-500">Completed</td>
                <td className="py-2 px-4 border-b">$150.00</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">#1235</td>
                <td className="py-2 px-4 border-b">Jane Smith</td>
                <td className="py-2 px-4 border-b text-yellow-500">Pending</td>
                <td className="py-2 px-4 border-b">$250.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
