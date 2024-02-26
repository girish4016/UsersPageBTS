import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface IUsers {
  name: string;
  email: string;
  emp_id: string;
  date_added: Date;
  last_activity: Date;
  department: string;
  [key: string]: string | Date;
}
interface IAddUserForm{
  first_name:string;
  last_name:string;
  email:string;
  password:string;
  confirm_password:string;
  department:string;
  role:string;
}
const dateModel: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};
const emptyAddUserForm = {
  first_name:'',
  last_name:'',
  email:'',
  password:'',
  confirm_password:'',
  department:'',
  role:''
}

export const UserSection = () => {
  const [userData, setUserData] = useState<IUsers[]>([]);
  const [displayData, setDisplayData] = useState<IUsers[]>([]);
  const [tablePage, setTablePage] = useState(0);
  const [tableSize, setTableSize] = useState(10);
  const [sorting, setSorting] = useState("Newest");
  const [filter, setFilter] = useState('All');
  const [addUserModalVisible, setAddUserModalVisible] = useState(0);
  const [addUserForm, setAddUserForm] = useState<IAddUserForm>(emptyAddUserForm);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const apiFetchHandler = async () => {
      const apiData = await fetch(
        "https://yti-b2b-api-dev.azurewebsites.net/api/users",
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxNzI1IiwiRW1haWwiOiJhYmhpc2hla0BiZXRhdGVzdHNvbHV0aW9ucy5jb20iLCJPcmdhbml6YXRpb24iOiIwIiwicm9sZSI6Ik9yZ2FuaXphdGlvblVzZXJBZG1pbiIsIm5iZiI6MTcwODg1ODgwNCwiZXhwIjoxNzA4OTAyMDA0LCJpYXQiOjE3MDg4NTg4MDR9.clpzobiSW-ymh_2aRAcBWAWrLtkyItsBgr6pypgWXdmQzHtFkqY4p42bmyS3RbKX9lKTl3MjtywvrpVkssGDRw",
          },
        }
      );

      const data = await apiData.json();
      console.log(data);
      setUserData(data);
    };

    try {
      // apiFetchHandler();
      let dummyData = [];
      for (let i = 0; i < 200; i++) {
        dummyData.push({
          name: "Girish Basandani",
          email: "gbasandani@betatestsolutions.com",
          emp_id: "XYZ 123" + i,
          date_added: (i<100)? new Date("1 mar 2024"): new Date("2 mar 2024"),
          last_activity: new Date("2 mar 2024"),
          department: "Finance",
        });
        dummyData[i].name += i;
      }
      setUserData(dummyData);
    } catch (e) {
      console.log(e);
      console.error(e);
    }
  }, []);

  useEffect(()=>{
    let dataAfterSortingAndFilter = [];
    // console.log(sorting)
    // console.log(filter)
    if(sorting==='Oldest')
    dataAfterSortingAndFilter = userData.sort((a:IUsers,b:IUsers)=>a.date_added.getTime()-b.date_added.getTime());
    else
    dataAfterSortingAndFilter = userData.sort((a:IUsers,b:IUsers)=>b.date_added.getTime()-a.date_added.getTime());
  
    dataAfterSortingAndFilter = dataAfterSortingAndFilter.filter((it)=>(it.department===filter||filter==='All'))
    // console.log(dataAfterSortingAndFilter)
    setDisplayData(dataAfterSortingAndFilter);
  },
  [sorting,filter,userData])

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTableSize(parseInt(e.target.value));
  };
  const handleIncrementPageNumber = (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    setTablePage((prev) => {
      if ((prev + 1) * tableSize < userData.length) return prev + 1;
      return prev;
    });
  };
  const handleDecrementPageNumber = (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    setTablePage((prev) => {
      if (prev) return prev - 1;
      return prev;
    });
  };
  const handleSortingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSorting(e.target.value);
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  const handleFormState = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setAddUserForm((prev)=>({
      ...prev,
      [e.target.name]:e.target.value
    }))
  }
  const handleAddUserFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    //adduserapi//
    /////////////
    e.preventDefault();
    const newUser:IUsers = {
      name:addUserForm.first_name +' '+addUserForm.last_name,
      email:addUserForm.email,
      date_added:new Date(Date.now()),
      emp_id:'XYZ 123'+userData.length,
      last_activity:new Date(Date.now()),
      department:addUserForm.department
    }
    setUserData((prev)=>([...prev,newUser]));
    setAddUserForm(emptyAddUserForm);
    setAddUserModalVisible(0);
  }
  const userSelectHandler = (e:React.ChangeEvent<HTMLInputElement>, id:string)=>{
    if(selectedUsers.includes(id))
    setSelectedUsers((prev)=>prev.filter((it)=>it!==id));
    else
    setSelectedUsers((prev)=>[...prev,id]);
  }
  const deleteUserHandler = ()=>{
    // console.log(selectedUsers.length + 'fdsa')
    const userDataAfterDeletion = userData.filter(it=> !selectedUsers.includes(it.emp_id));
    // console.log(userDataAfterDeletion.length + 'asdf')
    setUserData(userDataAfterDeletion);
  }
  const handleDownloadUserDisplayData = ()=>{
    const csvRows = [];
    const headers = Object.keys(displayData[0]);
    csvRows.push(headers.join(','));

    for (const row of displayData) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  }

  // console.log(userData)
  // console.log((tablePage*tableSize) ,  (tableSize)*(tablePage+1));
  // console.log(addUserModalVisible) 
  // console.log(userData.length)
  // console.log(selectedUsers.length)

  return (
    <div className="user-section">
      <p className="section-name">Users</p>
      <div className="seats-container">
        <p>No. Of Seats: </p>
        <div className="seats">
          <p>Used: 160</p>
          <div className="seats-seperator"></div>
          <p>Remaining: 40</p>
        </div>
      </div>

      <div className="user-table-container">
        <div className="user-table-header">
          <label htmlFor="Id_sort_by">Sort By: </label>
          <select
            name=""
            id="Id_sort_by"
            value={sorting}
            onChange={handleSortingChange}
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>
          <label htmlFor="Id_filter">Filter: </label>
          <select name="" id="Id_filter" value={filter} onChange={handleFilterChange}>
            <option>All</option>
            <option>Finance</option>
            <option>Sales</option>
            <option>HR</option>
            <option>Technology</option>
          </select>
          <button onClick={()=>setAddUserModalVisible(1)}>Add user</button>
          <button onClick={deleteUserHandler}>Delete user</button>
        </div>

        <div className={`${(addUserModalVisible)?"add-user-modal visible":"add-user-modal"}`}>
            <form onSubmit={handleAddUserFormSubmit}>
              <div className="add-user-input-fields">
                <input type="text" required value={addUserForm.first_name} name="first_name" onChange={handleFormState} placeholder="First Name"/>
                <input type="text" required value={addUserForm.last_name} name="last_name" onChange={handleFormState} placeholder="Last Name"/>
                <input type="text" required value={addUserForm.email} name="email" onChange={handleFormState} placeholder="Email"/>
                <input type="password" required value={addUserForm.password} name="password" onChange={handleFormState} placeholder="Password"/>
                <input type="password" required value={addUserForm.confirm_password} name="confirm_password" onChange={handleFormState} placeholder="Confirm Password"/>
                <input type="text" required value={addUserForm.department} name="department" onChange={handleFormState} placeholder="Department"/>
                <input type="text"  required value={addUserForm.role} name="role" onChange={handleFormState} placeholder="Role"/>
              </div>
              <div className="add-user-buttons">
                <button type="submit">Add User</button>
                <button onClick={(e)=>{setAddUserModalVisible(0)}}>Cancel</button>
              </div>
            </form>
        </div>

        <div className="user-table">
          <div className="col-head">
            <span className="col-name">Name</span>
            <span className="col-email">Email</span>
            <span className="col-emp-id">Emp ID</span>
            <span className="col-date-added">Date added</span>
            <span className="col-last-activity">Last Activity</span>
            <span className="col-department">Department</span>
          </div>
          <div className="user-table-content">
            {displayData
              .slice(tablePage * tableSize, tableSize * (tablePage + 1))
              .map((it: IUsers) => (
                <div className="user-row" key={it.emp_id}>
                  <div className="col-name">
                    <input type="checkbox" onChange={(e)=>userSelectHandler(e,it.emp_id)} />
                    <span>{it.name}</span>
                  </div>
                  <span className="col-email">{it.email}</span>
                  <span className="col-emp-id">{it.emp_id}</span>
                  <span className="col-date-added">
                    {it.date_added.toLocaleDateString("en-GB", dateModel)}
                  </span>
                  <span className="col-last-activity">{it.last_activity.toLocaleDateString("en-GB", dateModel)}</span>
                  <span className="col-department">{it.department}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="table-operations-section">
        <div className="user-table-range">
          <FaAngleLeft onClick={handleDecrementPageNumber} />
          <FaAngleRight onClick={handleIncrementPageNumber} />
          <span>
            {tablePage * tableSize}-
            {Math.min(userData.length, (tablePage + 1) * tableSize)} Of{" "}
            {userData.length}
          </span>
        </div>
        <div className="items-per-page">
          <label htmlFor="Id_items_per_page">Items per page</label>
          <select
            id="Id_items_per_page"
            value={tableSize}
            onChange={handlePageSizeChange}
          >
            <option>10</option>
            <option>20</option>
            <option>30</option>
          </select>
        </div>
        <button onClick={handleDownloadUserDisplayData}>Export User Data</button>
        <button>Bulk Upload</button>
        <button>User Statistics</button>
      </div>
    </div>
  );
};
