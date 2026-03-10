import { useState, useEffect } from "react";
import {
  Trash2,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  CheckCircle,
  Moon,
  Sun,
  Trash,
  GripVertical,
} from "lucide-react";

import STORAGE_KEY from "./info";

import { motion, AnimatePresence } from "framer-motion";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import initialTodoTexts from "./initialTodos";




export default function TodoList() {
  const [todoText, setTodoText] = useState("");

  const [todoTask, setTodoTask] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTodoTexts;
  });

  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoTask));
  }, [todoTask]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (todoText.trim() !== "") {
      setTodoTask([
        ...todoTask,
        { id: crypto.randomUUID(), text: todoText.trim(), completed: false },
      ]);

      showToast("Task Added");
      setTodoText("");
    }

    e.target.reset();
  }

  function handleDeleteTask(id) {
    setTodoTask(todoTask.filter((task) => task.id !== id));
    showToast("Task Deleted");
  }

  function toggleComplete(id) {
    setTodoTask(
      todoTask.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function pushTaskUp(index) {
    if (index > 0) {
      const newList = [...todoTask];
      [newList[index], newList[index - 1]] = [
        newList[index - 1],
        newList[index],
      ];
      setTodoTask(newList);
    }
  }

  function bringTaskDown(index) {
    if (index < todoTask.length - 1) {
      const newList = [...todoTask];
      [newList[index], newList[index + 1]] = [
        newList[index + 1],
        newList[index],
      ];
      setTodoTask(newList);
    }
  }

  function clearCompleted() {
    setTodoTask(todoTask.filter((task) => !task.completed));
    showToast("Completed Tasks Cleared");
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setTodoTask((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  }

  const filteredTasks = todoTask.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completed = todoTask.filter((t) => t.completed).length;

  const progress = todoTask.length
    ? Math.round((completed / todoTask.length) * 100)
    : 0;

  return (
    <div
      className={`min-h-screen flex justify-center items-start pt-16 px-4 transition-colors duration-500
      ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800"
      }`}
    >
      <div
        className={`shadow-2xl rounded-2xl p-6 w-full max-w-xl border
        ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Famous Todo List</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded
            ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm mb-1">{progress}% completed</p>

          <div
            className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} h-3 rounded`}
          >
            <div
              className="bg-green-500 h-3 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="Add a task..."
            className={`flex-1 border rounded-lg px-4 py-2
            ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-white"
                : "bg-white border-gray-300"
            }`}
          />

          <button
            type="submit"
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            <PlusCircle size={18} />
            Add
          </button>
        </form>

        <div className="flex justify-center gap-3 mb-6">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded
              ${
                filter === type
                  ? "bg-gray-800 text-white"
                  : darkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks}
            strategy={verticalListSortingStrategy}
          >
            <ol className="space-y-3">
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <SortableItem
                    key={task.id}
                    task={task}
                    index={index}
                    darkMode={darkMode}
                    toggleComplete={toggleComplete}
                    handleDeleteTask={handleDeleteTask}
                    pushTaskUp={pushTaskUp}
                    bringTaskDown={bringTaskDown}
                  />
                ))}
              </AnimatePresence>
            </ol>
          </SortableContext>
        </DndContext>
        <div className="flex justify-center mt-6">
          <button
            onClick={clearCompleted}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            <Trash size={16} />
            Clear Completed
          </button>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

function SortableItem({
  task,
  index,
  darkMode,
  toggleComplete,
  handleDeleteTask,
  pushTaskUp,
  bringTaskDown,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-between rounded-lg px-4 py-3
      ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={18} />
        </div>

        <span
          onClick={() => toggleComplete(task.id)}
          className={`flex items-center gap-2 cursor-pointer
          ${task.completed ? "line-through text-gray-400" : ""}`}
        >
          <CheckCircle
            size={18}
            className={task.completed ? "text-green-500" : ""}
          />

          {task.text}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => pushTaskUp(index)}
          className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          <ArrowUp size={16} />
        </button>

        <button
          onClick={() => bringTaskDown(index)}
          className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          <ArrowDown size={16} />
        </button>

        <button
          onClick={() => handleDeleteTask(task.id)}
          className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.li>
  );
}
