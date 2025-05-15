import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleComplete, deleteTodo, setFilter } from "./todoSlice";

const Todo = () => {
  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState(new Date().getFullYear());
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("00");

  const todos = useSelector((state) => state.todos.todos);
  const filter = useSelector((state) => state.todos.filter);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim()) {
      setTextError("");
    }
  };

  const handleTimeChange = (type, value) => {
    const cleanedValue = value.replace(/\D/g, '');
    
    if (type === "hours") {
        const hours = Math.min(parseInt(cleanedValue || 0), 23);
        setHours(hours.toString().padStart(2, '0'));
    } else {
        const minutes = Math.min(parseInt(cleanedValue || 0), 59);
        setMinutes(minutes.toString().padStart(2, '0'));
    }
  };

  const getSelectedDeadline = () => {
    const date = new Date(year, month - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    return date.toISOString();
  };

  const handleAddTodo = () => {
    if (!text.trim()) {
      setTextError("Задача не была введена");
      return;
    }

    const deadline = getSelectedDeadline();
    dispatch(addTodo({ text, deadline }));
    setText("");
    setTextError("");
    setHours("12");
    setMinutes("00");
  };

  const handleToggleComplete = (id) => dispatch(toggleComplete(id));
  const handleDeleteTodo = (id) => dispatch(deleteTodo(id));
  const handleFilterChange = (filter) => dispatch(setFilter(filter));

  const getDeadlineColor = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - currentDate;
    const oneDay = 24 * 60 * 60 * 1000;

    if (timeDiff < 0) return "#ff6b6b"; 
    if (timeDiff > oneDay) return "#51cf66"; 
    return "#fcc419"; 
  };

  const getTodosToShow = () => {
    const now = new Date();

    return todos.filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "active") return !todo.completed;
      if (filter === "red") return !todo.completed && new Date(todo.deadline) < now;
      if (filter === "yellow") {
        const diff = new Date(todo.deadline) - now;
        return !todo.completed && diff >= 0 && diff <= 24 * 60 * 60 * 1000;
      }
      if (filter === "green") {
        const diff = new Date(todo.deadline) - now;
        return !todo.completed && diff > 24 * 60 * 60 * 1000;
      }
      return true; 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "0 auto", 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#000",
      color: "#fff",
      minHeight: "100vh"
    }}>
      <h2 style={{ 
        color: "purple", 
        textAlign: "center",
        marginBottom: "30px"
      }}>
        todo list
      </h2>

      <div style={{ 
        backgroundColor: "#222", 
        padding: "20px", 
        borderRadius: "10px",
        marginBottom: "20px"
      }}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Введите задачу"
            style={{ 
              width: "100%", 
              padding: "10px", 
              borderRadius: "5px",
              border: textError ? "1px solid red" : "1px solid #444",
              backgroundColor: "#333",
              color: "#fff"
            }}
          />
          {textError && <p style={{ color: "red", margin: "5px 0 0" }}>{textError}</p>}
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "15px",
          marginBottom: "15px"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <label style={{ flex: 1, textAlign: "center", color: "#aaa" }}>Число</label>
              <label style={{ flex: 1, textAlign: "center", color: "#aaa" }}>Месяц</label>
              <label style={{ flex: 1, textAlign: "center", color: "#aaa" }}>Год</label>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <select 
                value={day} 
                onChange={(e) => setDay(e.target.value)} 
                style={{ 
                  padding: "8px", 
                  borderRadius: "5px", 
                  flex: 1,
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #444"
                }}
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)} 
                style={{ 
                  padding: "8px", 
                  borderRadius: "5px", 
                  flex: 1,
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #444"
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select 
                value={year} 
                onChange={(e) => setYear(parseInt(e.target.value))} 
                style={{ 
                  padding: "8px", 
                  borderRadius: "5px", 
                  flex: 1,
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #444"
                }}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={2023 + i}>{2023 + i}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <label style={{ flex: 1, textAlign: "center", color: "#aaa" }}>Часы</label>
              <label style={{ flex: 1, textAlign: "center", color: "#aaa" }}>Минуты</label>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                type="number"
                value={hours}
                onChange={(e) => handleTimeChange("hours", e.target.value)}
                min="0"
                max="23"
                style={{ 
                  padding: "8px", 
                  borderRadius: "5px",
                  flex: 1,
                  textAlign: "center",
                  border: "1px solid #444",
                  backgroundColor: "#333",
                  color: "#fff"
                }}
              />
              <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>:</span>
              <input
                type="number"
                value={minutes}
                onChange={(e) => handleTimeChange("minutes", e.target.value)}
                min="0"
                max="59"
                style={{ 
                  padding: "8px", 
                  borderRadius: "5px",
                  flex: 1,
                  textAlign: "center",
                  border: "1px solid #444",
                  backgroundColor: "#333",
                  color: "#fff"
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAddTodo}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "purple",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.2s",
            ":hover": {
              backgroundColor: "#ff6b9d"
            }
          }}
        >
          Добавить задачу в список
        </button>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "8px", 
        flexWrap: "wrap",
        marginBottom: "20px",
        justifyContent: "center"
      }}>
        <button 
          onClick={() => handleFilterChange("all")}
          style={{ 
            padding: "8px 12px", 
            borderRadius: "5px", 
            border: "1px solid #444",
            backgroundColor: "#333",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Все
        </button>
        <button 
          onClick={() => handleFilterChange("active")}
          style={{ 
            padding: "8px 12px", 
            borderRadius: "5px", 
            border: "1px solid #444",
            backgroundColor: "#333",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Активные
        </button>
        <button 
          onClick={() => handleFilterChange("completed")}
          style={{ 
            padding: "8px 12px", 
            borderRadius: "5px", 
            border: "1px solid #444",
            backgroundColor: "#333",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Выполненные
        </button>
        <button 
          onClick={() => handleFilterChange("red")} 
          style={{ 
            padding: "8px 12px", 
            borderRadius: "5px", 
            border: "1px solidrgb(255, 0, 0)",
            backgroundColor: "#333",
            color: "#ff6b6b",
            cursor: "pointer"
          }}
        >
          Просроченные
        </button>
        <button 
          onClick={() => handleFilterChange("yellow")} 
          style={{ 
            padding: "8px 12px", 
            borderRadius: "5px", 
            border: "1px solid #fcc419",
            backgroundColor: "#333",
            color: "#fcc419",
            cursor: "pointer"
          }}
        >
          Скоро дедлайн
        </button>
        <button 
          onClick={() => handleFilterChange("green")} 
          style={{ 
            padding: "8px 12px", 
            borderRadius: "5px", 
            border: "1px solid #51cf66",
            backgroundColor: "#333",
            color: "#51cf66",
            cursor: "pointer"
          }}
        >
          В запасе много времени
        </button>
      </div>

      <div>
        {getTodosToShow().map((todo) => (
          <div 
            key={todo.id}
            style={{ 
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: "#222",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
                style={{ 
                  transform: "scale(1.3)",
                  cursor: "pointer"
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#777" : "#fff",
                  fontSize: "16px",
                  marginBottom: "5px"
                }}>
                  {todo.text}
                </div>
                <div style={{ 
                  fontSize: "13px",
                  color: todo.completed ? "#666" : "#aaa"
                }}>
                  {formatDate(todo.deadline)}
                  {todo.completed && (
                    <span style={{ 
                      marginLeft: "10px",
                      color: "#666"
                    }}>
                      (Завершено: {new Date(todo.completedDate).toLocaleTimeString("ru-RU", {hour: '2-digit', minute:'2-digit'})})
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {!todo.completed && todo.deadline && (
                <span style={{
                  color: getDeadlineColor(todo.deadline),
                  fontWeight: "bold",
                  fontSize: "14px",
                  minWidth: "60px",
                  textAlign: "right"
                }}>
                  {new Date(todo.deadline).toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button 
                onClick={() => handleDeleteTodo(todo.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "purple",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  ":hover": {
                    backgroundColor: "#ff5252"
                  }
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;