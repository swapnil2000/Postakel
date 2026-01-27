import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import {
  Plus,
  Calendar as CalendarIcon,
  Filter,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Target,
  User,
  Edit,
  Trash2,
  Eye,
  Tag,
  CalendarDays,
  MessageSquare,
  X,
  ClipboardList
} from 'lucide-react';

interface TasksPlanningProps {
  userRole: string;
  currentUser?: any;
  employees?: any[];
  appData?: any;
  onUpdateAppData?: (module: string, data: any) => void;
}

export function TasksPlanning({
  userRole,
  currentUser,
  employees = [],
  appData = {},
  onUpdateAppData = () => { }
}: TasksPlanningProps) {
  const [activeTab, setActiveTab] = useState('View_name');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for creating tasks
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: '',
    dueDate: undefined as Date | undefined,
    tags: ''
  });

  // Initialize tasks from appData - start with empty state if no data exists
  const [tasks, setTasks] = useState(() => {
    if (appData.tasks?.tasks && appData.tasks.tasks.length > 0) {
      // Group tasks by status
      const groupedTasks = appData.tasks.tasks.reduce((acc: any, task: any) => {
        const status = task.status || 'todo';
        if (!acc[status]) acc[status] = [];
        acc[status].push(task);
        return acc;
      }, {});
      return {
        todo: groupedTasks.todo || [],
        inprogress: groupedTasks.inprogress || [],
        done: groupedTasks.done || []
      };
    }

    // Start with empty state - no hardcoded data
    return {
      todo: [],
      inprogress: [],
      done: []
    };
  });

  // Use real employees as team members, or fallback if none exist
  const teamMembers = employees.length > 0 ? employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    avatar: emp.avatar || emp.name.split(' ').map((n: string) => n[0]).join(''),
    role: emp.title || emp.role || 'Employee'
  })) : [
    // Fallback when no employees exist
    {
      id: currentUser?.id || 1,
      name: currentUser?.name || 'Current User',
      avatar: currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U',
      role: currentUser?.role || 'Employee'
    }
  ];

  // Sync tasks with appData
  useEffect(() => {
    const allTasks = [...tasks.todo, ...tasks.inprogress, ...tasks.done];
    onUpdateAppData('tasks', {
      tasks: allTasks,
      totalTasks: allTasks.length,
      completedTasks: tasks.done.length,
      overdueTasks: allTasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        return dueDate < today && task.status !== 'done';
      }).length,
      inProgressTasks: tasks.inprogress.length
    });
  }, [tasks]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-low';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'status-pending';
      case 'inprogress': return 'status-active';
      case 'done': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const handleCreateTask = () => {
    // Validate required fields
    if (!newTask.title?.trim() || !newTask.assignee || !newTask.priority || !newTask.dueDate) {
      alert('Please fill in all required fields (Title, Assignee, Priority, and Due Date)');
      return;
    }

    // Validate team members exist
    if (teamMembers.length === 0) {
      alert('No team members available to assign tasks to');
      return;
    }

    // Find the assigned team member
    const assignedMember = teamMembers.find(member => member.id.toString() === newTask.assignee);

    if (!assignedMember) {
      alert('Selected assignee not found');
      return;
    }

    const taskToCreate = {
      id: Date.now(),
      title: newTask.title.trim(),
      description: newTask.description.trim() || '',
      assignee: assignedMember.name,
      assigneeAvatar: assignedMember.avatar,
      priority: newTask.priority,
      dueDate: newTask.dueDate.toISOString(),
      tags: newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      createdBy: currentUser?.name || 'System',
      createdAt: new Date().toISOString(),
      status: 'todo',
      progress: 0,
      subtasks: []
    };

    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, taskToCreate]
    }));

    // Reset form
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: '',
      dueDate: undefined,
      tags: ''
    });

    setShowCreateTask(false);
  };

  const handleCloseCreateTask = () => {
    // Reset form when closing
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: '',
      dueDate: undefined,
      tags: ''
    });
    setShowCreateTask(false);
  };

  const handleTaskStatusChange = (taskId: number, newStatus: string) => {
    setTasks(prev => {
      const allTasks = [...prev.todo, ...prev.inprogress, ...prev.done];
      const taskToMove = allTasks.find(task => task.id === taskId);

      if (!taskToMove) return prev;

      // Remove task from current status
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(status => {
        newTasks[status as keyof typeof newTasks] = newTasks[status as keyof typeof newTasks].filter((task: any) => task.id !== taskId);
      });

      // Add to new status
      const updatedTask = { ...taskToMove, status: newStatus };
      if (newStatus === 'done') {
        updatedTask.completedAt = new Date().toISOString();
      }

      newTasks[newStatus as keyof typeof newTasks].push(updatedTask);

      return newTasks;
    });
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prev => ({
      todo: prev.todo.filter(task => task.id !== taskId),
      inprogress: prev.inprogress.filter(task => task.id !== taskId),
      done: prev.done.filter(task => task.id !== taskId)
    }));
  };

  // Filter tasks based on search query
  const filterTasks = (taskList: any[]) => {
    if (!searchQuery) return taskList;
    return taskList.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags && task.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  };

  const renderTaskCard = (task: any) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

    return (
      <Card
        key={task.id}
        className={`task-card ${task.priority}-priority mb-4 cursor-pointer hover:shadow-md transition-all duration-200 ${isOverdue ? 'border-red-300' : ''}`}
        onClick={() => setSelectedTask(task)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress bar for in-progress tasks */}
          {task.status === 'inprogress' && task.progress && (
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="avatar-small bg-blue-100 text-blue-700">
                <AvatarFallback>{task.assigneeAvatar}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">{task.assignee}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
            </div>
          </div>

          {/* Subtasks progress */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  {task.subtasks.filter((st: any) => st.completed).length}/{task.subtasks.length} subtasks completed
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Empty state component for task columns
  const renderEmptyState = (type: string) => {
    const emptyStates = {
      todo: {
        icon: Clock,
        title: "No tasks to do",
        description: "Tasks waiting to be started will appear here"
      },
      inprogress: {
        icon: Target,
        title: "No tasks in progress",
        description: "Active tasks will appear here"
      },
      done: {
        icon: CheckCircle2,
        title: "No completed tasks",
        description: "Finished tasks will appear here"
      }
    };

    const state = emptyStates[type as keyof typeof emptyStates];
    const Icon = state.icon;

    return (
      <div className="text-center py-8 px-4">
        <Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-gray-500 mb-1">{state.title}</h3>
        <p className="text-xs text-gray-400">{state.description}</p>
      </div>
    );
  };

  // Empty state for entire task board
  const renderTaskBoardEmptyState = () => (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <ClipboardList className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Get started by creating your first task. Tasks help you organize work, track progress, and collaborate with your team.
      </p>
      {(userRole === 'admin' || userRole === 'manager') && (
        <Button
          onClick={() => setShowCreateTask(true)}
          className="hr-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Task
        </Button>
      )}
    </div>
  );

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks & Planning</h1>
          <p className="text-gray-600">Manage tasks and track progress</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button> */}
          {(userRole === 'admin' || userRole === 'manager') && (
            <Button
              onClick={() => setShowCreateTask(true)}
              className="hr-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Task</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseCreateTask}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className="form-label">Task Title *</Label>
                  <Input
                    placeholder="Enter task title"
                    className="form-input"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="form-label">Description</Label>
                  <Textarea
                    placeholder="Describe the task requirements"
                    className="form-input min-h-24"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label className="form-label">Assign To *</Label>
                  {teamMembers.length > 0 ? (
                    <Select value={newTask.assignee} onValueChange={(value) => setNewTask(prev => ({ ...prev, assignee: value }))}>
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Avatar className="avatar-small bg-blue-100 text-blue-700">
                                <AvatarFallback>{member.avatar}</AvatarFallback>
                              </Avatar>
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">No team members available</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please add employees to your team before creating tasks.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="form-label">Priority *</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Low Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          Medium Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          High Priority
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="form-label">Due Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal form-input"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.dueDate ? format(newTask.dueDate, "PPP") : "Pick a due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newTask.dueDate}
                        onSelect={(date) => setNewTask(prev => ({ ...prev, dueDate: date }))}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="form-label">Tags</Label>
                  <Input
                    placeholder="Enter tags (comma separated)"
                    className="form-input"
                    value={newTask.tags}
                    onChange={(e) => setNewTask(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCloseCreateTask}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTask}
                  className="hr-button-primary flex-1"
                  disabled={!newTask.title || !newTask.assignee || !newTask.priority || !newTask.dueDate || teamMembers.length === 0}
                >
                  Create Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2">{selectedTask.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(selectedTask.priority)}>
                      {selectedTask.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedTask.status)}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTask(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{selectedTask.description || 'No description provided'}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Assignee</h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="avatar-medium bg-blue-100 text-blue-700">
                      <AvatarFallback>{selectedTask.assigneeAvatar}</AvatarFallback>
                    </Avatar>
                    <span>{selectedTask.assignee}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Due Date</h4>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Subtasks</h4>
                  <div className="space-y-2">
                    {selectedTask.subtasks.map((subtask: any, index: number) => (
                      <div key={subtask.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle2 className={`w-4 h-4 ${subtask.completed ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Status Change */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant={selectedTask.status === 'todo' ? 'default' : 'outline'}
                  onClick={() => handleTaskStatusChange(selectedTask.id, 'todo')}
                  className="flex-1"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  To Do
                </Button>
                <Button
                  variant={selectedTask.status === 'inprogress' ? 'default' : 'outline'}
                  onClick={() => handleTaskStatusChange(selectedTask.id, 'inprogress')}
                  className="flex-1"
                >
                  <Target className="w-4 h-4 mr-2" />
                  In Progress
                </Button>
                <Button
                  variant={selectedTask.status === 'done' ? 'default' : 'outline'}
                  onClick={() => handleTaskStatusChange(selectedTask.id, 'done')}
                  className="flex-1"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Done
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Comments
                </Button>
                {(userRole === 'admin' || userRole === 'manager') && (
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this task?')) {
                        handleDeleteTask(selectedTask.id);
                        setSelectedTask(null);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card className="hr-card">
        <CardContent className="p-4">
          <div className="relative">

            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 form-input"
            />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="View_name">View Name</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="View_name" className="space-y-6">
          {/* Show empty state if no tasks exist at all */}
          {[...tasks.todo, ...tasks.inprogress, ...tasks.done].length === 0 ? (
            renderTaskBoardEmptyState()
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    To Do ({filterTasks(tasks.todo).length})
                  </h3>
                </div>
                <div className="space-y-4 min-h-32">
                  {filterTasks(tasks.todo).length > 0 ? (
                    filterTasks(tasks.todo).map(renderTaskCard)
                  ) : (
                    renderEmptyState('todo')
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    In Progress ({filterTasks(tasks.inprogress).length})
                  </h3>
                </div>
                <div className="space-y-4 min-h-32">
                  {filterTasks(tasks.inprogress).length > 0 ? (
                    filterTasks(tasks.inprogress).map(renderTaskCard)
                  ) : (
                    renderEmptyState('inprogress')
                  )}
                </div>
              </div>

              {/* Done Column */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Done ({filterTasks(tasks.done).length})
                  </h3>
                </div>
                <div className="space-y-4 min-h-32">
                  {filterTasks(tasks.done).length > 0 ? (
                    filterTasks(tasks.done).map(renderTaskCard)
                  ) : (
                    renderEmptyState('done')
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {[...tasks.todo, ...tasks.inprogress, ...tasks.done].length === 0 ? (
            renderTaskBoardEmptyState()
          ) : (
            <div className="space-y-4">
              {[...filterTasks(tasks.todo), ...filterTasks(tasks.inprogress), ...filterTasks(tasks.done)].length > 0 ? (
                [...filterTasks(tasks.todo), ...filterTasks(tasks.inprogress), ...filterTasks(tasks.done)].map(renderTaskCard)
              ) : (
                <div className="text-center py-16 px-4">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h2>
                  <p className="text-gray-600 mb-4">
                    No tasks match your search criteria. Try adjusting your search or create a new task.
                  </p>
                  <Button
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                    className="mr-2"
                  >
                    Clear Search
                  </Button>
                  {(userRole === 'admin' || userRole === 'manager') && (
                    <Button
                      onClick={() => setShowCreateTask(true)}
                      className="hr-button-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="text-center py-12">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar View</h2>
            <p className="text-gray-600">Task calendar view coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}