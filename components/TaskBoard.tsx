'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, User, Calendar, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import type { Task, TaskStatus } from '@/types'

const columns = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-green-100' },
]

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const result = await response.json()
        setTasks(result.data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId === destination.droppableId) return

    const newStatus = destination.droppableId as TaskStatus
    
    try {
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setTasks(tasks.map(task => 
          task.id === draggableId 
            ? { ...task, status: newStatus }
            : task
        ))
        toast.success('Task status updated')
      } else {
        toast.error('Error updating task')
      }
    } catch (error) {
      toast.error('Network error occurred')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-100'
      case 'HIGH':
        return 'text-orange-600 bg-orange-100'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100'
      case 'LOW':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.id)
          
          return (
            <div key={column.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <span className="badge-info">{columnTasks.length}</span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-64 p-2 rounded-lg ${
                      snapshot.isDraggingOver ? column.color : ''
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-lg border shadow-sm ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                              <span className={`badge ${getPriorityColor(task.priority)}`}>
                                {task.priority.toLowerCase()}
                              </span>
                            </div>
                            
                            {task.description && (
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              {task.assignee && (
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {task.assignee.firstName} {task.assignee.lastName}
                                </div>
                              )}
                              
                              {task.dueDate && (
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(task.dueDate), 'MMM d')}
                                  {new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' && (
                                    <AlertTriangle className="h-3 w-3 ml-1 text-red-500" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add task
                    </button>
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}