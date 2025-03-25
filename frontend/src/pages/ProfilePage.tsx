import { useQuery } from '@tanstack/react-query';
import { getUserProfileAPI } from '../api/authApi';
import useAuthStore from '../stores/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const { data, isPending, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfileAPI,
    enabled: !!user, // fetch only if user exists
  });

  if (isPending) {
    return <div className='mt-8 text-center'>Loading...</div>;
  }

  if (error) {
    return (
      <div className='mt-8 text-center text-red-600'>
        Error loading profile: {error?.message ?? 'Failed to load profile'}
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-lg rounded-lg bg-white p-8 shadow-md'>
        <h1 className='mb-6 text-2xl font-bold'>Your Profile</h1>

        <div className='space-y-4'>
          <ProfileField label='Name' value={data?.name} />
          <ProfileField label='Email' value={data?.email} />
          <ProfileField label='Account ID' value={data?.id} isCode />
        </div>
      </div>
    </div>
  );
}

// Reusable Component for Profile Fields
const ProfileField = ({
  label,
  value,
  isCode = false,
}: {
  label: string;
  value?: string;
  isCode?: boolean;
}) => (
  <div>
    <p className='text-gray-600'>{label}</p>
    <p
      className={`text-xl font-medium ${isCode ? 'rounded bg-gray-100 p-2 font-mono text-sm' : ''}`}
    >
      {value || 'N/A'}
    </p>
  </div>
);
