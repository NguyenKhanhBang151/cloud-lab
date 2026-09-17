import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        name,
        email,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setStudents([...students, data]);

      setStudentId("");
      setName("");
      setEmail("");

      alert("Thêm sinh viên thành công!");
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/students/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        name,
        email,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setStudents(
        students.map((student) =>
          student._id === editingId ? data : student
        )
      );

      setEditingId(null);
      setStudentId("");
      setName("");
      setEmail("");

      alert("Cập nhật sinh viên thành công!");
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này không?")) {
      return;
    }

    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      setStudents(
        students.filter((student) => student._id !== id)
      );

      alert("Xóa sinh viên thành công!");
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      <h2>{editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}</h2>

      <form onSubmit={editingId ? handleUpdate : handleSubmit}>
        <div>
          <label>MSSV: </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
            required
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <br />

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>

        <br />

        <button type="submit">
          {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Hủy
          </button>
        )}
      </form>

      <hr />

      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Chưa có sinh viên</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              {student.studentId} - {student.name} - {student.email}{" "}
              <button onClick={() => handleEdit(student)}>
                Sửa
              </button>{" "}
              <button onClick={() => handleDelete(student._id)}>
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
