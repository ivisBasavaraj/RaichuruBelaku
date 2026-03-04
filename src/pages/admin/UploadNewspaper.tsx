import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function UploadNewspaper() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('publication_date', data.publication_date);
    formData.append('pdf', data.pdf[0]);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      
      const responseData = await res.json();
      if (res.status === 401) {
        logout();
        navigate('/admin/login');
        throw new Error(responseData.error || 'Session expired. Please login again');
      }
      
      if (!res.ok) {
        throw new Error(responseData.error || 'Upload failed');
      }
      
      toast.success('ಪತ್ರಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ');
      navigate(`/admin/map/${responseData.id}`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 md:py-8">
      <Link to="/admin" className="inline-flex items-center text-zinc-500 hover:text-zinc-900 mb-6 transition-colors text-sm md:text-base">
        <ArrowLeft size={16} className="mr-2" />
        ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-serif font-bold text-zinc-900 mb-6">ಹೊಸ ಆವೃತ್ತಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">ಪ್ರಕಟಣೆಯ ಶೀರ್ಷಿಕೆ</label>
            <input
              {...register('title', { required: 'ಶೀರ್ಷಿಕೆ ಅಗತ್ಯವಿದೆ' })}
              type="text"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none text-sm md:text-base"
              placeholder="ದೈನಂದಿನ ಪತ್ರಿಕೆ - ಬೆಳಗಿನ ಆವೃತ್ತಿ"
            />
            {errors.title && <span className="text-red-500 text-xs mt-1">{String(errors.title.message)}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">ಪ್ರಕಟಣೆಯ ದಿನಾಂಕ</label>
            <input
              {...register('publication_date', { required: 'ದಿನಾಂಕ ಅಗತ್ಯವಿದೆ' })}
              type="date"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none text-sm md:text-base"
            />
            {errors.publication_date && <span className="text-red-500 text-xs mt-1">{String(errors.publication_date.message)}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">PDF ಫೈಲ್</label>
            <div className="relative border-2 border-dashed border-zinc-300 rounded-lg p-4 md:p-8 text-center hover:bg-zinc-50 transition-colors">
              <input
                {...register('pdf', { required: 'PDF ಫೈಲ್ ಅಗತ್ಯವಿದೆ' })}
                type="file"
                accept="application/pdf"
                className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 md:h-12 md:w-12 text-zinc-400 mb-3" />
                <p className="text-sm text-zinc-600 font-medium">ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಎಳೆಯಿರಿ</p>
                <p className="text-xs text-zinc-400 mt-1">PDF ಫೈಲ್‌ಗಳು ಮಾತ್ರ</p>
              </label>
            </div>
            {errors.pdf && <span className="text-red-500 text-xs mt-1">{String(errors.pdf.message)}</span>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center text-sm md:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...
                </>
              ) : (
                'ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಮ್ಯಾಪಿಂಗ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
