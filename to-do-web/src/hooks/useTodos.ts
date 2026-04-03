// src/hooks/useTodos.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { Todo, FilterOption, SortByOption, SortOrderOption } from '../types';

const normalizeTodo = (todo: {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date | string;
}): Todo => ({
  id: todo.id,
  title: todo.title,
  completed: todo.completed,
  createdAt: typeof todo.createdAt === 'string'
    ? todo.createdAt
    : todo.createdAt.toISOString(),
});

const isTodoLike = (value: unknown): value is {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date | string;
} => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'completed' in value &&
    'createdAt' in value
  );
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortByOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrderOption>('desc');

  useEffect(() => {
    let isActive = true;

    const fetchTodos = async () => {
      setLoading(true);

      try {
        const { data } = await api.todos.get({
          query: { filter, sortBy, sortOrder },
        });

        if (isActive && data) {
          setTodos(data.map(normalizeTodo));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchTodos();

    return () => {
      isActive = false;
    };
  }, [filter, sortBy, sortOrder]);

  const addTodo = useCallback(async (title: string) => {
    const { data } = await api.todos.post({ title });

    if (isTodoLike(data)) {
      setTodos((prev: Todo[]) => [normalizeTodo(data), ...prev]);
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    await api.todos({ id }).delete();
    setTodos((prev: Todo[]) => prev.filter((todo: Todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback(async (id: number, completed: boolean) => {
    const { data } = await api.todos({ id }).patch({ completed });

    if (isTodoLike(data)) {
      setTodos((prev: Todo[]) =>
        prev.map((todo: Todo) => (todo.id === id ? normalizeTodo(data) : todo))
      );
    }
  }, []);

  return {
    todos,
    loading,
    addTodo,
    deleteTodo,
    toggleTodo,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};
