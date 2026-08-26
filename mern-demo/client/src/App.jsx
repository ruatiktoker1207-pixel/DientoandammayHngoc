import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  // State cho form
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Lấy danh sách sinh viên từ Backend
  const fetchStudents = () => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sinh viên:", error);
      });
  };

  // Chạy khi mở trang
  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thêm sinh viên
  const handleSubmit = (event) => {
    event.preventDefault();

    // Kiểm tra dữ liệu
    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Gửi POST đến Backend
    fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: studentId,
        name: name,
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể thêm sinh viên");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Sinh viên vừa thêm:", data);

        alert("Thêm sinh viên thành công!");

        // Xóa dữ liệu trong form
        setStudentId("");
        setName("");
        setEmail("");

        // Tải lại danh sách sinh viên
        fetchStudents();
      })
      .catch((error) => {
        console.error("Lỗi khi thêm sinh viên:", error);
        alert("Có lỗi xảy ra khi thêm sinh viên!");
      });
  };

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      {/* FORM THÊM SINH VIÊN */}
      <h2>Thêm sinh viên</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>

          <input
            type="text"
            placeholder="Nhập MSSV"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>

          <input
            type="text"
            placeholder="Nhập họ tên"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Email: </label>

          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Thêm sinh viên
        </button>
      </form>

      <hr />

      {/* DANH SÁCH SINH VIÊN */}
      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Chưa có sinh viên</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              {student.studentId} - {student.name} - {student.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;