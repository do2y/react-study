import List from "./List";

export default function Lists({ todoData, setTodoData }) {
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
