import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const ENDPOINT = 'http://localhost:4000';
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState({ title: '', body: '' });

  const fetchData = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/api/todos`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTodos(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todo) => {
    try {
      const response = await fetch(`${ENDPOINT}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTodos(result);
    } catch (error) {
      setError(error.message);
    }
  };

  const markTodoAsDone = async (id) => {
    try {
      const response = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTodos(result);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.title && newTodo.body) {
      createTodo({
        title: newTodo.title,
        body: newTodo.body,
        done: false,
      });
      setNewTodo({ title: '', body: '' });
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Body"
          value={newTodo.body}
          onChange={(e) => setNewTodo({ ...newTodo, body: e.target.value })}
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h2>{todo.title}</h2>
            <p>{todo.body}</p>
            <p>{todo.done ? 'Done' : 'Not Done'}</p>
            {!todo.done && (
              <button onClick={() => markTodoAsDone(todo.id)}>Mark as Done</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
