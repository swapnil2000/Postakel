import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import { 
  Plus,
  MessageSquare,
  Pin,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Bell,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Building,
  UserCheck,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  TrendingUp,
  FileText,
  Star,
  Megaphone
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: number;
  authorAvatar: string;
  role: string;
  department: string;
  targetAudience: 'all' | string; // 'all' or department name
  priority: 'high' | 'medium' | 'low';
  isPinned: boolean;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  status: 'active' | 'draft' | 'archived';
  expiresAt?: string;
  readBy: number[];
  totalEmployees: number;
  tags: string[];
}

interface AnnouncementsProps {
  userRole: string;
  currentUser?: any;
  employees?: any[];
  appData?: any;
  onUpdateAppData?: (module: string, data: any) => void;
}

export function Announcements({ 
  userRole,
  currentUser = { id: 1, name: 'User', role: 'employee' },
  employees = [],
  appData = {},
  onUpdateAppData = () => {}
}: AnnouncementsProps) {
  // Initialize announcements from appData
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    return appData.announcements?.announcements || [];
  });

  // Sync announcements with appData
  useEffect(() => {
    const unreadCount = announcements.filter(ann => 
      !ann.readBy.includes(currentUser.id) && ann.status === 'active'
    ).length;
    
    onUpdateAppData('announcements', {
      announcements,
      unreadCount
    });
  }, [announcements]);



  // Available departments from employees or default list
  const getDepartments = () => {
    if (employees && employees.length > 0) {
      const departments = [...new Set(employees.map(emp => emp.department))];
      return departments.filter(Boolean);
    }
    return ['HR', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Finance'];
  };

  const departments = getDepartments();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    priority: 'medium' as 'high' | 'medium' | 'low',
    isPinned: false,
    expiresAt: '',
    tags: ''
  });

  // Use the current user from props
  const currentUserInfo = employees.find(emp => emp.id === currentUser.id) || currentUser;

  // Filter announcements based on user role and department
  const getVisibleAnnouncements = () => {
    return announcements.filter(announcement => {
      // Admin can see all announcements
      if (userRole === 'admin') return true;
      
      // Users can see announcements targeted to 'all' or their department
      return announcement.targetAudience === 'all' || 
             announcement.targetAudience === currentUserInfo.department ||
             announcement.authorId === currentUser.id;
    });
  };

  // Apply filters and search
  const getFilteredAnnouncements = () => {
    let filtered = getVisibleAnnouncements();

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(announcement => 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(announcement => 
        announcement.targetAudience === filterDepartment || 
        (filterDepartment === 'company-wide' && announcement.targetAudience === 'all')
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(announcement => announcement.status === filterStatus);
    }

    // Sort by pinned first, then by creation date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filteredAnnouncements = getFilteredAnnouncements();
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      targetAudience: 'all',
      priority: 'medium',
      isPinned: false,
      expiresAt: '',
      tags: ''
    });
    setEditingAnnouncement(null);
    setShowCreateForm(false);
  };

  // Populate form for editing
  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      targetAudience: announcement.targetAudience,
      priority: announcement.priority,
      isPinned: announcement.isPinned,
      expiresAt: announcement.expiresAt?.split('T')[0] || '',
      tags: announcement.tags.join(', ')
    });
    setEditingAnnouncement(announcement);
    setShowCreateForm(true);
  };

  // Create or update announcement
  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const now = new Date().toISOString();

    if (editingAnnouncement) {
      // Update existing announcement
      setAnnouncements(prev => prev.map(announcement => 
        announcement.id === editingAnnouncement.id
          ? {
              ...announcement,
              title: formData.title,
              content: formData.content,
              targetAudience: formData.targetAudience,
              priority: formData.priority,
              isPinned: formData.isPinned,
              expiresAt: formData.expiresAt ? `${formData.expiresAt}T23:59:59Z` : undefined,
              tags,
              updatedAt: now,
              isEdited: true
            }
          : announcement
      ));
      toast.success('Announcement updated successfully');
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        author: currentUser.name,
        authorId: currentUser.id,
        authorAvatar: currentUser.name.split(' ').map(n => n[0]).join(''),
        role: currentUser.role,
        department: currentUser.department,
        targetAudience: formData.targetAudience,
        priority: formData.priority,
        isPinned: formData.isPinned,
        createdAt: now,
        isEdited: false,
        status: 'active',
        expiresAt: formData.expiresAt ? `${formData.expiresAt}T23:59:59Z` : undefined,
        readBy: [currentUser.id],
        totalEmployees: formData.targetAudience === 'all' ? 8 : departments.includes(formData.targetAudience) ? 2 : 8,
        tags
      };

      setAnnouncements(prev => [newAnnouncement, ...prev]);
      toast.success('Announcement published successfully');
    }

    resetForm();
  };

  // Delete announcement
  const handleDelete = (announcementId: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    toast.success('Announcement deleted successfully');
  };

  // Toggle pin status
  const togglePin = (announcementId: string) => {
    setAnnouncements(prev => prev.map(announcement => 
      announcement.id === announcementId
        ? { ...announcement, isPinned: !announcement.isPinned }
        : announcement
    ));
  };

  // Mark as read
  const markAsRead = (announcementId: string) => {
    setAnnouncements(prev => prev.map(announcement => 
      announcement.id === announcementId && !announcement.readBy.includes(currentUser.id)
        ? { 
            ...announcement, 
            readBy: [...announcement.readBy, currentUser.id]
          }
        : announcement
    ));
  };

  // Check if user can edit/delete announcement
  const canModifyAnnouncement = (announcement: Announcement) => {
    return userRole === 'admin' || announcement.authorId === currentUser.id;
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get audience display name
  const getAudienceDisplayName = (audience: string) => {
    if (audience === 'all') return 'All Employees';
    return `${audience} Department`;
  };

  // Calculate read percentage
  const getReadPercentage = (readBy: number[], total: number) => {
    return total > 0 ? Math.round((readBy.length / total) * 100) : 0;
  };

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Megaphone className="w-8 h-8" />
            Announcements
          </h1>
          <p className="text-gray-600">Company-wide updates and important communications</p>
        </div>
        {(userRole === 'admin' || userRole === 'manager') && (
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getVisibleAnnouncements().length}</p>
                <p className="text-sm text-gray-600">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Pin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getVisibleAnnouncements().filter(a => a.isPinned).length}</p>
                <p className="text-sm text-gray-600">Pinned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getVisibleAnnouncements().filter(a => a.priority === 'high').length}</p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(getVisibleAnnouncements().reduce((sum, a) => sum + getReadPercentage(a.readBy, a.totalEmployees), 0) / getVisibleAnnouncements().length) || 0}%
                </p>
                <p className="text-sm text-gray-600">Avg Read Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="company-wide">Company-wide Only</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept} Department</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Announcement Dialog */}
      <Dialog open={showCreateForm} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </DialogTitle>
            <DialogDescription>
              {editingAnnouncement 
                ? 'Make changes to your announcement. This will be marked as edited for all viewers.'
                : 'Create a new announcement to share with employees. You can target specific departments or all employees.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your announcement content..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept} Department</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="expires">Expires On (Optional)</Label>
              <Input
                id="expires"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g. policy, remote work, benefits"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isPinned}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPinned: checked }))}
              />
              <Label>Pin this announcement</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {editingAnnouncement ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Announcements List */}
      <div className="space-y-4">
        {paginatedAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={`${announcement.isPinned ? 'border-l-4 border-l-purple-500 bg-purple-50/30' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                    {announcement.isPinned && <Pin className="w-4 h-4 text-purple-600" />}
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    {announcement.isEdited && (
                      <Badge variant="outline" className="text-xs">
                        Edited
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <Badge variant="outline" className="text-xs">
                      {getAudienceDisplayName(announcement.targetAudience)}
                    </Badge>
                    {announcement.expiresAt && (
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        Expires {new Date(announcement.expiresAt).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{announcement.content}</p>

                  {announcement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {announcement.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 bg-blue-100 text-blue-700">
                        <AvatarFallback>{announcement.authorAvatar}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{announcement.author}</p>
                        <p className="text-gray-500">
                          {announcement.role} • {formatTimeAgo(announcement.createdAt)}
                          {announcement.isEdited && announcement.updatedAt && (
                            <> • Edited {formatTimeAgo(announcement.updatedAt)}</>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{getReadPercentage(announcement.readBy, announcement.totalEmployees)}%</span>
                      </div>
                      <span>({announcement.readBy.length}/{announcement.totalEmployees})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!announcement.readBy.includes(currentUser.id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(announcement.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {userRole === 'admin' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePin(announcement.id)}
                      className={announcement.isPinned ? 'text-purple-600' : 'text-gray-400'}
                    >
                      <Pin className="w-4 h-4" />
                    </Button>
                  )}

                  {canModifyAnnouncement(announcement) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {paginatedAnnouncements.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-600">
                {searchQuery || filterDepartment !== 'all' || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No announcements have been posted yet'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAnnouncements.length)} of {filteredAnnouncements.length} announcements
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}