import { useState, useEffect } from 'react';
import {
  History as HistoryIcon, Search, Filter,
  ChevronRight, ArrowRight, CheckCircle2,
  ShieldCheck, Zap, Download
} from 'lucide-react';

const History = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!customerId) return;
      try {
        const response = await fetch(`http://localhost:5000/service-status?customerId=${customerId}`);
        const data = await response.json();
        if (data.success) {
          setRecords(data.requests);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
    fetchHistory();
  }, [customerId]);

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.Product_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `REQ-${r.Request_ID}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || r.Status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    if (filteredRecords.length === 0) return;

    const headers = ['Request ID', 'Product', 'Model', 'Date', 'Status', 'Cost', 'Technician'];
    const csvRows = [
      headers.join(','),
      ...filteredRecords.map(r => [
        `REQ-${r.Request_ID}`,
        `"${r.Product_Name}"`,
        `"${r.Model_Number}"`,
        new Date(r.Request_Date).toLocaleDateString(),
        r.Status,
        r.Cost || '0.00',
        `"${r.TechnicianName || 'N/A'}"`
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `Service_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  return (
    <div className="space-y-12 font-sans">
      {/* Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">Service History.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">Complete history of your product service requests and status updates.</p>
        </div>
      </div>

      {/* History Controls */}
      <div className="flex flex-col md:flex-row gap-6 mt-12 bg-bg-secondary p-5 rounded-[2rem] border border-border-color shadow-sm transition-colors">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
          <input
            placeholder="Search history by request ID or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-primary border border-border-color rounded-xl pl-11 pr-4 py-3 text-[13px] font-bold focus:ring-1 focus:ring-brand outline-none text-text-primary"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="secondary-button px-6 py-3 text-[11px] font-bold uppercase tracking-widest bg-bg-primary border border-border-color rounded-xl cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            onClick={handleExport}
            className="secondary-button px-8 py-3 text-[11px] font-bold uppercase tracking-widest"
          >
            <Download className="w-4 h-4 opacity-50" /> Export
          </button>
        </div>
      </div>

      {/* History Registry */}
      <div className="bg-bg-primary rounded-[2rem] overflow-hidden border border-border-color shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color bg-bg-secondary/50">
                <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">ID</th>
                <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Product</th>
                <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Request Date</th>
                <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Status</th>
                <th className="px-10 py-6 text-right text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {isLoading ? (
                <tr><td colSpan="5" className="px-10 py-20 text-center animate-pulse text-text-secondary">Loading your history...</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan="5" className="px-10 py-20 text-center text-text-secondary">No service history found.</td></tr>
              ) : filteredRecords.map((r) => (
                <tr key={r.Request_ID} className="group hover:bg-bg-secondary transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="font-mono text-[14px] font-black text-text-primary tracking-tighter italic uppercase">REQ-{r.Request_ID}</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-[14px] font-bold text-text-primary tracking-tight italic">{r.Product_Name}</div>
                  </td>
                  <td className="px-10 py-8 text-[13px] font-bold text-text-secondary opacity-80">{new Date(r.Request_Date).toLocaleDateString()}</td>
                  <td className="px-10 py-8">
                    <span className={`badge ${r.Status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>
                      {r.Status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button
                      onClick={() => {
                        setSelectedRecord(r);
                        setIsModalOpen(true);
                      }}
                      className="text-[11px] font-bold uppercase text-brand hover:underline underline-offset-4 bg-transparent border-none cursor-pointer group-hover:translate-x-1 transition-transform"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-brand text-bg-primary rounded-[3rem] p-16 flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden group transition-colors">
        <div className="z-10 text-center md:text-left mb-10 md:mb-0 max-w-xl">
          <h4 className="text-4xl font-bold tracking-tight mb-4 italic uppercase serif-heading">Service Integrity.</h4>
          <p className="opacity-70 text-lg font-medium leading-relaxed italic">All service records are securely logged and verified to ensure accurate warranty tracking and support history.</p>
        </div>
        <div className="z-10 bg-bg-primary/10 border border-bg-primary/20 p-10 rounded-[2rem] flex flex-col items-center">
          <ShieldCheck className="w-10 h-10 text-bg-primary mb-4 scale-100 group-hover:scale-110 transition-transform" />
          <div className="text-[10px] font-bold uppercase tracking-[.3em] opacity-40 mb-2 italic">Secure Registry</div>
          <div className="text-2xl font-black italic serif-heading uppercase">VERIFIED</div>
        </div>
      </div>

      {isModalOpen && selectedRecord && (
        <HistoryDetailModal
          record={selectedRecord}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const HistoryDetailModal = ({ record, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60000] flex items-center justify-center p-10 bg-black/5 backdrop-blur-sm animate-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div
        className="w-full max-w-2xl bg-bg-primary border border-border-color rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col transition-all"
        style={{ backgroundColor: 'var(--bg-primary)', opacity: 1 }}
      >
        <div className="p-10 border-b border-border-color bg-bg-secondary/30 flex justify-between items-center">
          <div>
            <div className="text-[10px] font-black text-brand uppercase tracking-widest mb-1">RECORD-{record.Request_ID}</div>
            <h3 className="text-3xl font-bold text-text-primary italic serif-heading tracking-tight">{record.Product_Name}</h3>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40 mt-1 italic">Verified Service Entry</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-bg-primary border border-border-color flex items-center justify-center text-text-primary hover:bg-bg-secondary transition-all cursor-pointer">✕</button>
        </div>
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2">Request Date</div>
              <div className="text-[14px] font-bold text-text-primary">{new Date(record.Request_Date).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2">Completion Status</div>
              <div className={`badge ${record.Status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>{record.Status}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2">Lead Technician</div>
              <div className="text-[14px] font-bold text-text-primary">{record.TechnicianName || 'Awaiting Assignment'}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2">Final Service Cost</div>
              <div className="text-[14px] font-mono font-bold text-text-primary text-brand">${record.Cost || '0.00'}</div>
            </div>
          </div>
          <div className="pt-8 border-t border-border-color">
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2">Issue Logged</div>
            <p className="text-[14px] font-medium text-text-primary leading-relaxed italic">"{record.Issue_Description}"</p>
          </div>
        </div>
        <div className="p-10 bg-bg-secondary/30 border-t border-border-color flex justify-end">
          <button onClick={onClose} className="secondary-button px-8 py-3 text-[11px] font-bold uppercase tracking-widest border border-border-color rounded-xl">Dismiss</button>
        </div>
      </div>
    </div>
  );
};


export default History;
