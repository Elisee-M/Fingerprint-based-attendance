
import AuthGuard from '@/components/AuthGuard';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  return (
    <AuthGuard>
      <AdminPanel />
    </AuthGuard>
  );
};

export default Index;
