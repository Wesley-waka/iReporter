import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';

import StatsDashboard from '../StatsDashboard';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: 'id',
    direction: 'asc',
  });

  // Fetch all reports
  useEffect(() => {
    fetch('https://ireporter1.onrender.com/reports')
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setInitialRecords(sortBy(data, 'description'));
      });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  // Filter the reports based on search
  useEffect(() => {
    setInitialRecords(() => {
      return reports.filter((item) => {
        const lowerCaseSearch = search.toLowerCase();
        return (
          item.user.surname.toLowerCase().includes(lowerCaseSearch) ||
          item.user.first_name.toLowerCase().includes(lowerCaseSearch) ||
          item.report_status.name.toString().toLowerCase().includes(lowerCaseSearch) ||
          item.report_type.name.toLowerCase().includes(lowerCaseSearch) ||
          item.user.email.toLowerCase().includes(lowerCaseSearch) ||
          item.description.toLowerCase().includes(lowerCaseSearch)
        );
      });
    });
  }, [search, reports]);

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortStatus]);

  function redirectOnclick(id) {
    window.location.href = `/adminreportdetails/${id}`;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <img
                className="h-7"
                src={require('../../assets/images/i-reporter_adminDashboard.png')}
                alt="Company name"
              />
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              {/* Stats Section */}
              <StatsDashboard records={recordsData} />
              {/* End of Stats Section */}
              {/* User Dashboard Content */}
              {/* Data Table */}
              <div className="mt-6 overflow-hidden rounded-lg bg-white shadow p-6  border  border-gray-300">
                <div className="sm:flex sm:items-center ">
                  {/* ... (remaining code) ... */}
                </div>
                <div className="min-w-full divide-y divide-gray-300 mt-6">
                  {/* ... (remaining code) ... */}
                  <DataTable
                    className="whitespace-nowrap table-hover cursor-pointer"
                    records={recordsData}
                    columns={[
                      // ... (remaining columns)
                    ]}
                    totalRecords={initialRecords.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) =>
                      `Showing  ${from} to ${to} of ${totalRecords} entries`
                    }
                  />
                </div>
                {/* End of Data Tables */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
