import { useState } from "react";
import "./App.css";
import Lists from "./components/Lists";
import Form from "./components/Form";

export default function App() {
  //로컬스토리지에 저장할 때 텍스트로 변경해줘야함.
  const initialTodoData = localStorage.getItem("todoData")
    ? JSON.parse(localStorage.getItem("todoData"))
    : [];

  const [todoData, setTodoData] = useState(initialTodoData);

  const [value, setValue] = useState(""); //setValue는 value값을 업데이트 해주는 함수

  const handleSubmit = (e) => {
    e.preventDefault();

    let newTodo = {
      id: Date.now(),
      title: value,
      completed: false,
    };

    setTodoData([...todoData, newTodo]);
    localStorage.setItem("todoData", JSON.stringify([...todoData, newTodo]));
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
