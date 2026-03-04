import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const responseData = await res.json();
      
      if (!res.ok) throw new Error(responseData.error || 'Login failed');

      login(responseData.token, responseData.user);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-zinc-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-2">ದೈನಂದಿನ ಪತ್ರಿಕೆ</h1>
          <p className="text-zinc-500">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
              placeholder="admin@example.com"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{String(errors.email.message)}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
            />
            {errors.password && <span className="text-red-500 text-xs mt-1">{String(errors.password.message)}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-900 text-white py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Admin Login'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-zinc-100 text-xs text-center text-zinc-400">
          <p>Admin: admin@example.com / admin123</p>
        </div>
      </div>
    </div>
  );
}