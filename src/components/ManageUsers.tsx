
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { firebaseAuth } from '@/lib/firebase-auth';
import { firebaseConfig } from '@/lib/firebase-config';
import { getAuth } from 'firebase/auth';
import { Users, UserPlus, Trash2, Shield } from 'lucide-react';

interface ManageUsersProps {
  onLogout?: () => void;
  user?: any;
}

const ManageUsers = ({ onLogout, user }: ManageUsersProps) => {
  const [users, setUsers] = useState<Array<{ uid: string; email: string; role: string; name: string }>>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'reguser' as 'admin' | 'reguser'
  });

  // Check if current user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadUsers();
  }, []);

  const getAuthToken = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await firebaseAuth.getAllUsers();
      
      // Convert to the format expected by the component
      const usersList = allUsers.map((userData) => ({
        uid: userData.uid,
        name: userData.name || 'Unknown',
        email: 'N/A', // Email is not stored in database as per requirement
        role: userData.role || 'reguser'
      }));
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Access Denied",
        description: "Only administrators can manage users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      await firebaseAuth.createUser(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );
      toast({
        title: "User Added",
        description: "New user has been added successfully.",
      });
      
      loadUsers();
      setFormData({ email: '', password: '', name: '', role: 'reguser' });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (userId: string) => {
    const userToDelete = users.find(u => u.uid === userId);
    if (userToDelete?.role === 'admin') {
      toast({
        title: "Cannot Delete",
        description: "Admin user cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await firebaseAuth.deleteUser(userId);
        toast({
          title: "User Deleted",
          description: "User has been removed successfully.",
        });
        loadUsers();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user. Note: Firebase Auth deletion requires admin privileges.",
          variant: "destructive",
        });
      }
    }
  };


  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
                Manage Users
              </h1>
              <p className="text-gray-600">Add and manage system users</p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Regular User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Add New Regular User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: 'admin' | 'reguser') => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reguser">Regular User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                    Add User
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0" style={{ backgroundColor: 'rgb(232, 231, 197)' }}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-orange-200 bg-white/50">
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-700">Name</TableHead>
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-700">Email</TableHead>
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-700">Role</TableHead>
                      <TableHead className="text-left py-4 px-6 font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.uid} className={`border-b border-orange-200 hover:bg-white/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/30' : 'bg-white/20'}`}>
                        <TableCell className="py-4 px-6 font-medium text-gray-900">{user.name}</TableCell>
                        <TableCell className="py-4 px-6 font-medium text-gray-900">{user.email}</TableCell>
                        <TableCell className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            user.role === 'admin' 
                              ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {user.role === 'admin' && <Shield className="w-3 h-3" />}
                            {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={user.role === 'admin'}
                            className="text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDelete(user.uid)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No users found</p>
                  </div>
                )}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageUsers;
