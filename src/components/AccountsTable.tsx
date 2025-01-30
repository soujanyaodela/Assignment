import { useData } from '../context/DataContext';
import { useState } from 'react';

export const AccountsTable = () => {
  const { accounts, calls, emails, selectedUser, users } = useData();
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  if (!selectedUser) {
    return <div className="text-center py-6 text-blue-800 font-bold bg-blue-50 rounded-lg shadow-lg mt-3">Please select a user to view account details</div>;
  }

  const selectedUserTerritory = users.find(u => u.userName === selectedUser)?.territory;
  const territoryAccounts = accounts.filter(a => a.territory === selectedUserTerritory);

  const accountDetails = territoryAccounts.map(account => {
    const accountCalls = calls.filter(c => c.accountId === account.id);
    const accountEmails = emails.filter(e => e.accountId === account.id);
    
    return {
      name: account.name,
      totalCalls: accountCalls.length,
      totalEmails: accountEmails.length,
      latestCallDate: accountCalls.length > 0 
        ? new Date(Math.max(...accountCalls.map(c => new Date(c.callDate).getTime()))).toLocaleDateString()
        : '-',
      latestEmailDate: accountEmails.length > 0
        ? new Date(Math.max(...accountEmails.map(e => new Date(e.emailDate).getTime()))).toLocaleDateString()
        : '-'
    };
  });

  const paginatedAccounts = accountDetails.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  return (
    <div className="py-4 px-8">
      <h3 className="text-xl font-semibold text-center mb-6">User's Territory Account Details</h3>
      {accountDetails.length > 0 ? (
        <>
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-200">
            <tr>
  <th className="px-4 py-2 border text-center">Account Name</th>
  <th className="px-4 py-2 border text-center">Total Calls</th>
  <th className="px-4 py-2 border text-center">Total Emails</th>
  <th className="px-4 py-2 border text-center">Latest Call Date</th>
  <th className="px-4 py-2 border text-center">Latest Email Date</th>
</tr>

            </thead>
            <tbody>
              {paginatedAccounts.map((account, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 text-center border-l border-r">{account.name}</td>
        <td className="px-4 py-2 text-center border-l border-r">{account.totalCalls}</td>
        <td className="px-4 py-2 text-center border-l border-r">{account.totalEmails}</td>
        <td className="px-4 py-2 text-center border-l border-r">{account.latestCallDate}</td>
        <td className="px-4 py-2 text-center border-l border-r">{account.latestEmailDate}</td>
      
              </tr>
              
              ))}
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
    {currentPage + 1} / {Math.ceil(accountDetails.length / rowsPerPage)}
  </span>

  <button 
    className="bg-blue-500 text-white py-2 px-4 rounded"
    onClick={() => setCurrentPage(prev => (prev + 1) * rowsPerPage < accountDetails.length ? prev + 1 : prev)}
    disabled={(currentPage + 1) * rowsPerPage >= accountDetails.length}
  >
    Next
  </button>
</div>

        </>
      ) : (
        <p className="text-center mt-4">No accounts found for this territory</p>
      )}
    </div>
  );
};
