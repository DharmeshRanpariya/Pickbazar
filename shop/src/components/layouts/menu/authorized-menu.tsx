import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { siteSettings } from '@/config/site';
import Avatar from '@/components/ui/avatar';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { avatarPlaceholder } from '@/lib/placeholders';
import { UserOutlinedIcon } from '@/components/icons/user-outlined';
import { useLogout, useUser } from '@/framework/user';
const DefaultAvatarSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="38"
    height="38"
    viewBox="0 0 120 120"
  >
    <g data-name="user place holder">
      <g data-name="Group 51" fill="#dddfe1">
        <path
          data-name="Path 80"
          d="M90 81.108v-4.62a4.111 4.111 0 00-1.022-3.292c-.072-.412-.169-.558-.536-.669a13.35 13.35 0 01-.836-.292c-.887-.333-1.763-.7-2.638-1.059a431.206 431.206 0 01-7.341-3.158c-1.188-.521-2.385-1.043-3.564-1.567l-2.2-.979-.894-.4c-.448-.2-.045-.119-.126-.427-.038-.143-.467-.391-.576-.483l-.982-.824c-.287-.241-.232-.473-.261-.86a55.51 55.51 0 01-.144-2.448c-.008-.273-.012-.546-.011-.819s.219-.481.337-.7a18.745 18.745 0 00.862-1.827 26.641 26.641 0 001.231-3.915c.83.477 1.617-.6 2-1.187a12.052 12.052 0 001.286-2.85 12.475 12.475 0 00.63-2.955c.036-.471.132-1.47-.486-1.626.159.038.321.071.478.115a16.79 16.79 0 00-.985-.237c.158.034.315.076.473.113a1.83 1.83 0 00-1.629.268 32.892 32.892 0 001.115-8.417c-.048-2.49-.562-5.479-2.836-6.927a1.907 1.907 0 00.2-2.872 5.327 5.327 0 00-1.608-1.2c-.534 1.926-3.564 1.685-5.068 1.65a95.791 95.791 0 00-9.753-.118c-2.458.193-4.848.648-6.728 2.354a10.6 10.6 0 00-2.856 4.761 19.9 19.9 0 00-.82 5.086 11.486 11.486 0 001.017 5.929c-.469-.683-1.9-.984-2.292-.068a4.929 4.929 0 00.2 2.868 13.763 13.763 0 001.483 3.858c.385.657 1.17 1.943 2.108 1.493a20.519 20.519 0 002.742 6.464 7.377 7.377 0 00.81 1.056.838.838 0 01.348.709c-.008.5-.01 1.006-.014 1.508 0 .241.077.484-.137.619a.783.783 0 00-.091.067l-1.184.993-.478.4c-.169.141.283.232-.123.4-1.818.77-3.634 1.545-5.439 2.344l.044.077a494.123 494.123 0 01-8.26 3.57c-1 .417-1.995.833-3.006 1.213-.281.106-.564.211-.852.3-.466.139-.335.465-.63.776-1.327 1.381-.908 3.985-.908 5.745v2.126a39.7 39.7 0 0059.937-.071zM45.99 45.099c.027.043.055.085.085.127-.02-.021.279.584-.085-.126z"
        />
        <path data-name="Path 81" d="M88.979 73.195c.625.588-.064-.366 0 0z" />
      </g>
    </g>
  </svg>
);
const AuthorizedMenu: React.FC<{ minimal?: boolean }> = ({ minimal }) => {
  const { mutate: logout } = useLogout();
  const { me, isLoading } = useUser();
  const router = useRouter();
  const { t } = useTranslation('common');
  if (isLoading) {
    return <div>Loading...</div>;
  }
  function handleClick(path: string) {
    router.push(path);
  }

  return (
    <Menu
      as="div"
      className="relative inline-block ltr:text-left rtl:text-right"
    >
      <Menu.Button className="flex items-center focus:outline-0">
        {minimal ? (
          <UserOutlinedIcon className="h-5 w-5" />
        ) : me ? (
          me.provider === 'google' ? (
            <img
              src={me.photoUrl?.original || ''}
              alt={me?.name || 'user name'}
              referrerPolicy="no-referrer"
              className="h-[38px] w-[38px] border-border-200 rounded-full"
            />
          ) : me.photoUrl?.original ? (
            <Avatar
              src={me.photoUrl.original}
              title={me?.name || 'user name'}
              className="h-[38px] w-[38px] border-border-200"
            />
          ) : (
            <DefaultAvatarSVG />
          )
        ) : (
          <div className="h-[38px] w-[38px] rounded-full bg-gray-200 animate-pulse"></div>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className={cn(
            'absolute mt-5 w-48 rounded bg-white pb-4 shadow-700 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left',
            {
              '!mt-2': minimal,
            },
          )}
        >
          {/* <Menu.Item>
            <li className="flex w-full items-center justify-between bg-accent-500 px-6 py-4 text-xs font-semibold capitalize text-light focus:outline-none ltr:text-left rtl:text-right">
              <span>{t('text-points')}</span>
              <span>{me?.wallet?.available_points ?? 0}</span>
            </li>
          </Menu.Item> */}
          {siteSettings.authorizedLinks.map(({ href, label }) => (
            <Menu.Item key={`${href}${label}`}>
              {({ active }) => (
                <li>
                  <button
                    onClick={() => handleClick(href)}
                    className={cn(
                      'block w-full py-2.5 px-6 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-accent focus:outline-0 ltr:text-left rtl:text-right',
                      active ? 'text-accent' : 'text-heading',
                    )}
                  >
                    {t(label)}
                  </button>
                </li>
              )}
            </Menu.Item>
          ))}
          <Menu.Item>
            <li>
              <button
                onClick={() => logout()}
                className={cn(
                  'block w-full py-2.5 px-6 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-accent focus:outline-0 ltr:text-left rtl:text-right',
                )}
              >
                {t('auth-menu-logout')}
              </button>
            </li>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AuthorizedMenu;
