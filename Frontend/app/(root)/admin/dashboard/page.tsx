import { UserRole } from '@/types/user';
import StudentDashboard from '@/components/shared/screens/StudentDashboard';
import TutorDashboard from '@/components/shared/screens/TutorDashboard';
import AdminDashboard from '@/components/shared/screens/AdminDashoard';

const DashboardPage = () => {
  const userRole = 'ADMIN' as UserRole; 

  switch (userRole) {
    case 'STUDENT':
      return <StudentDashboard />;
    
    case 'TUTOR':
      return <TutorDashboard />;
    
    case 'ADMIN':
      return <AdminDashboard />;
    
    default:
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center p-10 bg-card rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-bold text-foreground">You're not authorized to view this page</h2>
            <p className="text-ink-200 mt-2">Please contact the system administrator.</p>
          </div>
        </div>
      );
  }
};

export default DashboardPage;