import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSocialLogin } from '@/framework/user';

const SocialLogin = () => {
  const { data: session, status } = useSession();
  const { mutate: socialLogin, error } = useSocialLogin();

  useEffect(() => {
    // Trigger social login mutation if session is available
    if (session?.access_token && session?.provider) {
      const { access_token, provider, user } = session;

      socialLogin({
        provider,
        access_token,
        email: user.email,
        name: user.name,
        image: user.image,
      });
    }
  }, [session, socialLogin]);

  if (status === 'loading') return null;

  if (error) {
    return <div className="error-message">{error.message}</div>;
  }

  return null;
};


export default SocialLogin;
