import List from "./List";

export default function Lists({ todoData, setTodoData }) {
  const handleClick = (id) => {
    let newTodoData = todoData.filter((data) => data.id !== id);
    console.log(newTodoData);
    setTodoData(newTodoData);
  };

  return (
    <div>
      {todoData.map((data) => (
        <List
          key={data.id}
          title={data.title}
          completed={data.completed}
          id={data.id}
          todoData={todoData}
          setTodoData={setTodoData}
        />
      ))}
    </div>
  );
}
