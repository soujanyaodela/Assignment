import { DataProvider } from './context/DataContext';
import { UserSelector } from './components/UserSelector';
import { CallsPieChart } from './components/CallsPieChart';
import { AccountsTable } from './components/AccountsTable';
import './styles/index.css';

function App() {
  return (
    <DataProvider>
      <div>
        <UserSelector />
        <CallsPieChart />
        <AccountsTable />
      </div>
    </DataProvider>
  );
}

export default App;