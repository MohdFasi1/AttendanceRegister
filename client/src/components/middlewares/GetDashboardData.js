const getDashboardData = async (setEmpData,setAttendanceToday) => {
    let api = await fetch(`${process.env.REACT_APP_API_URL}/api/get-dashboard-data`);
    let res = await api.json();
    setEmpData(res.employees)
    setAttendanceToday(res.attendance)
  }

  export default getDashboardData