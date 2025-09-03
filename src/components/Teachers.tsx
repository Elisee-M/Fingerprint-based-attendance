import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { firebaseDb, firebaseAuth, TRADE_OPTIONS } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import TradeDropdown from './TradeDropdown';

interface TeachersProps {
  onLogout?: () => void;
  user?: any;
}

const Teachers = ({ onLogout, user }: TeachersProps) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    trade: ''
  });

  const currentUser = firebaseAuth.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const teacherData = await firebaseDb.getTeachers();
      const teachersArray = Object.values(teacherData);
      setTeachers(teachersArray);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load teachers from Firebase.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can add teachers.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingTeacher) {
        await firebaseDb.updateTeacher(editingTeacher.id, formData);
        toast({
          title: "Teacher Updated",
          description: "Teacher information has been updated successfully.",
        });
      } else {
        await firebaseDb.addTeacher(formData);
        toast({
          title: "Teacher Added",
          description: "New teacher has been added successfully.",
        });
      }

      loadTeachers();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save teacher information.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      trade: ''
    });
    setEditingTeacher(null);
  };

  const handleEdit = (teacher: any) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can edit teachers.",
        variant: "destructive",
      });
      return;
    }

    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      trade: teacher.trade || teacher.subject || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (teacherId: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can delete teachers.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await firebaseDb.deleteTeacher(teacherId);
        loadTeachers();
        toast({
          title: "Teacher Deleted",
          description: "Teacher has been removed successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete teacher.",
          variant: "destructive",
        });
      }
    }
  };

  const getFullTradeName = (abbreviation: string) => {
    const trade = TRADE_OPTIONS.find(option => option.value === abbreviation);
    return trade ? trade.label : abbreviation;
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.trade || teacher.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Teachers</h1>
            <p className="text-gray-600">Manage teacher records</p>
          </div>
          
          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto" onClick={resetForm}>
                  Add New Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>
                    {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Trade</label>
                    <div className="mt-1">
                      <TradeDropdown
                        value={formData.trade}
                        onChange={(value) => setFormData({ ...formData, trade: value })}
                        placeholder="Select or type trade"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      {editingTeacher ? 'Update' : 'Add'} Teacher
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <CardTitle>All Teachers</CardTitle>
              <div className="w-full md:w-64">
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/70"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Trade</th>
                    {isAdmin && <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher, index) => (
                    <tr key={teacher.id} className={`border-b hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-3 px-2 md:px-4 font-medium">{teacher.name}</td>
                      <td className="py-3 px-2 md:px-4">{getFullTradeName(teacher.trade || teacher.subject)}</td>
                      {isAdmin && (
                        <td className="py-3 px-2 md:px-4">
                          <div className="flex flex-col md:flex-row gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(teacher)}
                              className="text-xs md:text-sm hover:bg-blue-50 border-blue-200"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50 text-xs md:text-sm"
                              onClick={() => handleDelete(teacher.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTeachers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">No teachers found</div>
                  <div className="text-gray-400 text-sm mt-2">Try adjusting your search terms</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ELONDA Company Info */}
        <Card className="bg-white/90 backdrop-blur-sm border border-blue-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-gray-700 font-medium">System developed by</span>
              <span className="font-bold text-blue-600">ELONDA</span>
              <span className="text-red-500">❤️</span>
            </div>
            <p className="text-sm text-gray-600">
              For technical support, contact: 
              <a href="mailto:mugiranezaelisee0@gmail.com" className="text-blue-600 hover:underline ml-1">
                mugiranezaelisee0@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Teachers;
