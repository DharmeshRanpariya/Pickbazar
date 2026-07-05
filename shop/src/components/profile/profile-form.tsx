import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/cards/card';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import { useUpdateUser } from '@/framework/user';
import Uploader from '../ui/forms/uploader';
import type { UpdateUserInput, User } from '@/types';

const ProfileForm = ({ user }: { user: User }) => {
  const { t } = useTranslation('common');
  const { mutate: updateProfile, isLoading } = useUpdateUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.photoUrl && user.photoUrl.original) {
      setAvatarUrl(user.photoUrl.original);
    }
  }, [user]);

  const onSubmit = (values: UpdateUserInput) => {
    if (!user) return;
    window.gtag('event', 'profile_update', {
      event_category: 'Profile',
      event_label: 'Profile Updated',
      user_id: user.id,
      new_name: values.name,
      new_bio: values.bio,
    });
    updateProfile({
      id: user.id,
      bio: values.bio,
      name: values.name,
      photoUrl: user?.provider === "google" ? user?.photoUrl : avatarUrl,
    });
  };

  return (
    <Form<UpdateUserInput>
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: {
          name: user?.name || '',
          bio: user?.bio || '',
          profile: {
            avatar: avatarUrl || '',
          },
        },
      }}
    >
      {({ register }) => (
        <>
          <div className="mb-8 flex">
            <Card className="w-full">
              {user?.provider !== 'google' && (
                <div className="mb-8">
                  <Uploader
                    onChange={(url) => {
                      setAvatarUrl(url[0]);
                      window.gtag('event', 'avatar_update', {
                        event_category: 'Profile',
                        event_label: 'Avatar Updated',
                        user_id: user.id,
                        new_avatar_url: url[0],
                      });
                    }}
                    value={avatarUrl ? [avatarUrl] : []}
                    name="profile.avatar"
                    onBlur={register('profile.avatar').onBlur}
                    multiple={false}
                  />
                </div>
              )}

              <div className="mb-6 flex flex-row">
                <Input
                  className="flex-1"
                  label={t('text-name')}
                  {...register('name')}
                  variant="outline"
                />
              </div>

              <TextArea
                label={t('text-bio')}
                {...register('bio')}
                variant="outline"
                className="mb-6"
              />

              <div className="flex">
                <Button
                  className="ltr:ml-auto rtl:mr-auto"
                  loading={isLoading}
                  disabled={isLoading}
                  type="submit"
                >
                  {t('text-save')}
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </Form>
  );
};

export default ProfileForm;
