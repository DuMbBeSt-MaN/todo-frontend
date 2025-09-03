import Task from './task.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import './App.css'

function App() {

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-xl p-6">
        <div className="mb-4 flex items-center justify-end">
          <ThemeToggle />
        </div>
        <Task />
      </div>
    </div>
  )
}

export default App
