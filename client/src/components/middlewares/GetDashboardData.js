const getDashboardData = async (setEmpData,setAttendanceToday) => {
    let api = await fetch(`${import.meta.env.VITE_API_URL}/api/get-dashboard-data`);
    let res = await api.json();
    setEmpData(res.employees)
    setAttendanceToday(res.attendance)
  }

  export default getDashboardData