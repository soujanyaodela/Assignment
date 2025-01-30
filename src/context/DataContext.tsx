import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  territory: string;
  userName: string;
  userId: string;
  userProfile: string;
}

interface Account {
  name: string;
  id: string;
  type: string;
  territory: string;
  speciality: string;
}

interface Call {
  id: string;
  accountId: string;
  callType: string;
  callDate: string;
  callStatus: string;
}

interface Email {
  id: string;
  accountId: string;
  emailDate: string;
  status: string;
}

interface DataContextType {
  users: User[];
  accounts: Account[];
  calls: Call[];
  emails: Email[];
  selectedUser: string;
  setSelectedUser: (user: string) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, accountsRes, callsRes, emailsRes] = await Promise.all([
          fetch('/data/users.json'),
          fetch('/data/accounts.json'),
          fetch('/data/calls.json'),
          fetch('/data/emails.json')
        ]);

        const [usersData, accountsData, callsData, emailsData] = await Promise.all([
          usersRes.json(),
          accountsRes.json(),
          callsRes.json(),
          emailsRes.json()
        ]);

        setUsers(usersData);
        setAccounts(accountsData);
        setCalls(callsData);
        setEmails(emailsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{
      users,
      accounts,
      calls,
      emails,
      selectedUser,
      setSelectedUser,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};