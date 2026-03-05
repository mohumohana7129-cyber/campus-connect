import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAdminAuth, DEPARTMENTS } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Mail, AlertCircle, Shield, GraduationCap, Users, ArrowLeft } from 'lucide-react';
import kristuJayantiLogo from '@/assets/kristu-jayanti-logo.png';

type LoginType = 'admin' | 'organiser' | 'student';

interface LoginPageProps {
  loginType: LoginType;
}

const loginConfig: Record<LoginType, { title: string; icon: React.ReactNode; description: string }> = {
  admin: {
    title: 'Admin Login',
    icon: <Shield className="w-8 h-8 text-primary-foreground" />,
    description: 'Sign in with your admin credentials',
  },
  organiser: {
    title: 'Organiser Login',
    icon: <Users className="w-8 h-8 text-primary-foreground" />,
    description: 'Sign in to manage your events',
  },
  student: {
    title: 'Student Login',
    icon: <GraduationCap className="w-8 h-8 text-primary-foreground" />,
    description: 'Sign in with your institutional email',
  },
};

const LoginPage = ({ loginType }: LoginPageProps) => {
  const config = loginConfig[loginType];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsDepartment, setNeedsDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const { login, currentUser, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // No auto-redirect on login pages — user intentionally navigated here.
  // They will be redirected after a successful login submission.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const usersRaw = localStorage.getItem('campus_users');
        const normalizedEmail = email.toLowerCase().trim();
        let resolvedUser = null;
        if (usersRaw) {
          const users = JSON.parse(usersRaw);
          resolvedUser = users.find((u: any) => u.email === normalizedEmail);
        }

        const role = resolvedUser?.role || 'student';

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'organizer') {
          navigate('/organizer');
        } else {
          if (!resolvedUser?.department) {
            setNeedsDepartment(true);
          } else {
            navigate('/home');
          }
        }
      } else {
        setError(result.message);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepartmentSubmit = () => {
    if (!selectedDepartment) {
      setError('Please select your department');
      return;
    }

    const usersRaw = localStorage.getItem('campus_users');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      const idx = users.findIndex((u: any) => u.email === email.toLowerCase().trim());
      if (idx >= 0) {
        users[idx].department = selectedDepartment;
        localStorage.setItem('campus_users', JSON.stringify(users));
        const session = JSON.parse(localStorage.getItem('campus_session') || '{}');
        session.department = selectedDepartment;
        localStorage.setItem('campus_session', JSON.stringify(session));
      }
    }

    navigate('/home');
  };

  // Department selection step
  if (needsDepartment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <Card className="w-full max-w-md relative z-10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Select Your Department</CardTitle>
            <CardDescription>Please select your department to personalize your event feed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleDepartmentSubmit} className="w-full">Continue</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 gradient-hero opacity-5" />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 mx-auto transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-4">
            {config.icon}
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Institutional Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo credentials:</strong><br />
              Admin: admin@college.edu<br />
              Organizer: organizer@college.edu<br />
              Student: student@college.edu<br />
              (any password works)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
