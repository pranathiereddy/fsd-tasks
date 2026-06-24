import './App.css';
import { useState } from 'react';
let istudents =[{name:"cvr",age:20,grade:"s"},{name:"abc",age:21,grade:"b"},{name:"xyz",age:22,grade:"c"}]

function App() {
  let [students,setStudents]=useState(istudents)
  let [editIndex,setEditIndex] = useState(null)
  let [search,setSearch] = useState("")
  let [formData,setFormData]=useState({name:"",age:"",grade:""})
  let [ascending,setAscending]=useState(true)
   const handleDelete = (i) =>{
    const updatedStudents=students.filter((s,index)=>index!==i)
    setStudents(updatedStudents)
  }
  
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleAdd=()=>{
    setStudents([...students,formData])
    setFormData({name:"",age:"",grade:""})
  }
  const handleEdit=(i)=>{
    setEditIndex(i)
    setFormData(students[i])
  }
  const handleUpdate=()=>{
    const updatedStudents = students.map((s,i)=>i===editIndex?formData:s)
    setStudents(updatedStudents)
    setFormData({name:"",age:"",grade:""})
    setEditIndex(null)
    
  }
  const filteredStudents=students.filter((s)=>s.name.toLowerCase().includes(search.toLowerCase()))
  const sortedStudents=filteredStudents.sort((a,b)=> ascending ? a.name.localeCompare(b.name):b.name.localeCompare(a.name))

  return (
    <div className="App">
      <div className='form'>
        <input className='form-control' name="search" placeholder='Type to search' onChange={(e)=>setSearch(e.target.value)}></input>
        <h2>{editIndex == null? "Add Student": "Update Student"}</h2>
        <input className='form-control m-2' name='name' value={formData.name} onChange={handleChange}></input>
        <input className='form-control m-2' name='age'value={formData.age} onChange={handleChange}></input>
        <input className='form-control m-2' name='grade' value={formData.grade} onChange={handleChange}></input>
        {editIndex==null? <button className='btn btn-success m-2' onClick={()=>handleAdd()}>Add Student</button>
        :<button className = 'btn btn-success m-2' onClick={()=>handleUpdate()}>Update Students</button>}
      </div>
      <h2>Student List</h2>
      <table className="table table-bordered">
        <thead>
          <th style={{cursor:"pointer"}} onClick={()=>setAscending(!ascending)}>Name<i className={ascending?"bi bi-arrow-up":"bi bi-arrow-down"}></i></th>
          <th>Age</th><th>Grade</th><th>Actions</th>
        </thead>
        <tbody>
          {sortedStudents.map((s,index)=>
          <tr><td>{s.name}</td><td>{s.age}</td><td>{s.grade}</td>
          <td><button className='btn btn-primary m-2'onClick={()=>handleEdit(index)}>Edit</button>
          <button className = 'btn btn-danger' onClick={()=>handleDelete(index)}>Delete</button></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default App;
