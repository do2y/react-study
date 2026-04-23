export default function List({ title, completed, id, todoData, setTodoData }) {
  const btnStyle = {
    color: "#fff",
    border: "none",
    padding: "5px 9px",
    borderRadius: "50%",
    cursor: "pointer",
    float: "right",
  };

  const getStyle = (completed) => {
    return {
      padding: "10px",
      borderBottom: "1px #ccc dotted",
      textDecoration: completed ? "line-through" : "none",
    };
  };

  const handleCompleteChange = (id) => {
    let newTodoData = todoData.map((data) => {
      if (data.id === id) {
        data.completed = !data.completed;
      }
      return data;
    });

    setTodoData(newTodoData);
  };

  return (
    <div>
      <div style={getStyle(completed)}>
        <input
          type="checkbox"
          onChange={() => handleCompleteChange(id)}
          checked={completed}
        />
        {title}
        <button style={btnStyle} onClick={() => handleClick(id)}>
          X
        </button>
      </div>
    </div>
  );
}
