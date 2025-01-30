import { useData } from '../context/DataContext';
import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/CallsPieChart.css';

const COLORS = ['#0088FE', '#1E88E5', '#90CAF9', '#64B5F6', '#42A5F5'];

export const CallsPieChart = () => {
  const { calls, accounts, selectedUser, users } = useData();
  const [selectedCallType, setSelectedCallType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;
  
  if (!selectedUser) {
    return <div className="text-center py-6 text-blue-800 font-bold bg-blue-50 rounded-lg shadow-lg mt-3">
    Please select a user to view analytics
  </div>;
  }

  const selectedUserTerritory = users.find(u => u.userName === selectedUser)?.territory;
  const territoryAccounts = accounts.filter(a => a.territory === selectedUserTerritory);
  const territoryCalls = calls.filter(c => 
    territoryAccounts.some(a => a.id === c.accountId)
  );

  const callTypes = territoryCalls.reduce((acc, call) => {
    acc[call.callType] = (acc[call.callType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(callTypes).map(([type, count], index) => ({
    name: type,
    value: count,
    color: COLORS[index % COLORS.length],
  }));

  const selectedTypeCalls = selectedCallType
    ? territoryCalls.filter(call => call.callType === selectedCallType)
    : [];
  
  const paginatedCalls = selectedTypeCalls.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  return (
    <div className="py-4 px-8">
      
      <div className="flex gap-8">
        {/* Pie chart on the left */}
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
                onClick={(entry) => setSelectedCallType(entry.name)}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Call details section (only show when a call type is selected) */}
        <div className="flex-1 w-full">
          {selectedCallType && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">{selectedCallType} Calls</h4>
                <button 
                  className="bg-red-500 text-white p-2 rounded-full"
                  onClick={() => setSelectedCallType(null)}
                >
                  ×
                </button>
              </div>
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200">
                <tr>
  <th className="px-4 py-2 border text-center">Call ID</th>
  <th className="px-4 py-2 border text-center">Account Name</th>
  <th className="px-4 py-2 border text-center">Date</th>
  <th className="px-4 py-2 border text-center">Status</th>
</tr>

                </thead>
                <tbody>
                  {paginatedCalls.map(call => {
                    const account = accounts.find(a => a.id === call.accountId);
                    return (
                      <tr key={call.id} className="border-b hover:bg-gray-100">
  <td className="px-4 py-2 text-center border-l border-r">{call.id}</td>
  <td className="px-4 py-2 text-center border-l border-r">{account?.name || 'Unknown'}</td>
  <td className="px-4 py-2 text-center border-l border-r">{new Date(call.callDate).toLocaleDateString()}</td>
  <td className="px-4 py-2 text-center border-l border-r">{call.callStatus}</td>
</tr>

                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
  <button 
    className="bg-blue-500 text-white py-2 px-4 rounded"
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
    disabled={currentPage === 0}
  >
    Previous
  </button>

  {/* Page Indicator */}
  <span className="px-4 py-2 text-lg">
    {currentPage + 1} / {Math.ceil(selectedTypeCalls.length / rowsPerPage)}
  </span>

  <button 
    className="bg-blue-500 text-white py-2 px-4 rounded"
    onClick={() => setCurrentPage(prev => (prev + 1) * rowsPerPage < selectedTypeCalls.length ? prev + 1 : prev)}
    disabled={(currentPage + 1) * rowsPerPage >= selectedTypeCalls.length}
  >
    Next
  </button>
</div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};
