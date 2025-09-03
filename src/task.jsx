import { useEffect, useMemo, useState } from 'react'
import { createItem, deleteItem, getItems, updateItem } from './api'

export default function Task() {
  const [items, setItems] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const canCreate = useMemo(() => newTitle.trim().length > 0, [newTitle])

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const data = await getItems()
        if (isMounted) setItems(data)
      } catch (e) {
        if (isMounted) setError(e.message || 'Failed to load items')
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    if (!canCreate) return
    try {
      setError('')
      const created = await createItem(newTitle.trim())
      setItems((prev) => [...prev, created])
      setNewTitle('')
    } catch (e) {
      setError(e.message || 'Failed to add item')
    }
  }

  async function onUpdate(id, title) {
    try {
      setError('')
      const updated = await updateItem(id, title)
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)))
    } catch (e) {
      setError(e.message || 'Failed to update item')
    }
  }

  async function onDelete(id) {
    try {
      setError('')
      await deleteItem(id)
      setItems((prev) => prev.filter((it) => it.id !== id))
    } catch (e) {
      setError(e.message || 'Failed to delete item')
    }
  }

  return (
    <div>
      <form onSubmit={onCreate} className="flex gap-2 mb-6">
        <input
          className="flex-1 rounded border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Add a new task"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button
          className="rounded bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-50"
          disabled={!canCreate}
          type="submit"
        >
          Add
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-600 dark:text-slate-300">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-slate-600 dark:text-slate-300">No items yet</div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <EditableItem key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  )
}

function EditableItem({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)

  function startEdit() {
    setEditing(true)
  }

  async function save() {
    const next = title.trim()
    if (!next) return
    await onUpdate(item.id, next)
    setEditing(false)
  }

  return (
    <li className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="rounded bg-emerald-600 px-3 py-1 text-white"
            onClick={save}
            type="button"
          >
            Save
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-1 dark:border-slate-600"
            onClick={() => {
              setTitle(item.title)
              setEditing(false)
            }}
            type="button"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <span>{item.title}</span>
          <div className="flex gap-2">
            <button
              className="rounded border border-slate-300 px-3 py-1 dark:border-slate-600"
              onClick={startEdit}
              type="button"
            >
              Edit
            </button>
            <button
              className="rounded bg-rose-600 px-3 py-1 text-white"
              onClick={() => onDelete(item.id)}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  )
}