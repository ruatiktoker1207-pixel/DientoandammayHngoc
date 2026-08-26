import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  // State cho form
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ID của sinh viên đang sửa
  const [editingId, setEditingId] = useState(null);

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

  // Xóa dữ liệu trong form
  const resetForm = () => {
    setStudentId("");
    setName("");
    setEmail("");
    setEditingId(null);
  };

  // Xử lý thêm hoặc cập nhật sinh viên
  const handleSubmit = (event) => {
    event.preventDefault();

    // Kiểm tra dữ liệu
    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Nếu đang sửa thì dùng PUT
    if (editingId) {
      fetch(`/api/students/${editingId}`, {
        method: "PUT",
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
            throw new Error("Không thể cập nhật sinh viên");
          }

          return response.json();
        })
        .then((data) => {
          console.log("Sinh viên đã cập nhật:", data);

          alert("Cập nhật sinh viên thành công!");

          resetForm();
          fetchStudents();
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật sinh viên:", error);
          alert("Có lỗi xảy ra khi cập nhật sinh viên!");
        });

      return;
    }

    // Nếu không sửa thì dùng POST để thêm
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

        resetForm();
        fetchStudents();
      })
      .catch((error) => {
        console.error("Lỗi khi thêm sinh viên:", error);
        alert("Có lỗi xảy ra khi thêm sinh viên!");
      });
  };

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);

    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // Xóa sinh viên
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(`/api/students/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể xóa sinh viên");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Sinh viên đã xóa:", data);

        alert("Xóa sinh viên thành công!");

        fetchStudents();
      })
      .catch((error) => {
        console.error("Lỗi khi xóa sinh viên:", error);
        alert("Có lỗi xảy ra khi xóa sinh viên!");
      });
  };

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      {/* FORM THÊM / CẬP NHẬT SINH VIÊN */}
      <h2>
        {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
      </h2>

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
          {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Hủy
          </button>
        )}
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

              <button
                type="button"
                onClick={() => handleEdit(student)}
                style={{ marginLeft: "10px" }}
              >
                Sửa
              </button>

              <button
                type="button"
                onClick={() => handleDelete(student._id)}
                style={{ marginLeft: "5px" }}
              >
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