import { useState } from "react";
import "./App.css";
import Lists from "./components/Lists";
import Form from "./components/Form";

export default function App() {
  const [todoData, setTodoData] = useState([
    {
      id: "1",
      title: "공부하기",
      completed: false,
    },
    {
      id: "2",
      title: "청소하기",
      completed: false,
    },
  ]);

  const [value, setValue] = useState(""); //setValue는 value값을 업데이트 해주는 함수

  const handleSubmit = (e) => {
    e.preventDefault();

    let newTodo = {
      id: Date.now(),
      title: value,
      completed: false,
    };

    setTodoData([...todoData, newTodo]);
    setValue("");
  };

  return (
    //jsx 코드를 작성
    <div className="container">
      <div className="todoBlock">
        <div className="title">
          <h1>할 일 목록</h1>
        </div>

        <Lists todoData={todoData} setTodoData={setTodoData} />
        {/*이렇게 하면 App.jsx가 Lists.jsx의 부모가됨. App.jsx 안에서 Lists 컴포넌트를 렌더링 */}
        {/*자식에게 내려주는 방법 */}

        <Form handleSubmit={handleSubmit} value={value} setValue={setValue} />
      </div>
    </div>
  );
}
