import Link from '@/components/ui/link';
import { siteSettings } from '@/config/site';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useLogout, useUser } from '@/framework/user';
import { useSettings } from '@/framework/settings';
import { PaymentGateway } from '@/types';
import { Routes } from '@/config/routes';
import { isStripeAvailable } from '@/lib/is-stripe-available';

type DashboardSidebarProps = {
  className?: string;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {
  const { mutate: logout } = useLogout();
  const { me } = useUser();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <aside className={className}>

      <div className="overflow-hidden rounded border border-border-200 bg-light">
        <ul className="py-7">
        {siteSettings.dashboardSidebarMenu
            ?.filter((item: any) => {
              if (
                item.href === Routes.changePassword &&
                (me?.provider === "phone_number" || me?.provider === "google")
              ) {
                return false;
              }
              return true;
            })
            .map((item: any, idx) => {
              const enableMyCardRoute = isStripeAvailable(settings);
              if (item?.href === Routes.cards && enableMyCardRoute === false) {
                return null;
              }


              return (
                <li className="py-1" key={idx}>
                  <Link
                    href={item.href}
                    className={classNames(
                      'block border-l-4 border-transparent py-2 px-10 font-semibold text-heading transition-colors hover:text-accent focus:text-accent',
                      {
                        '!border-accent text-accent': pathname === item.href,
                      }
                    )}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              );
            })}
        </ul>
        {/* End of top part menu */}

        <ul className="border-t border-border-200 bg-light py-4">
          <li className="block py-2 px-11 ">
            <button
              onClick={() => logout()}
              className={classNames(
                'font-semibold text-heading transition-colors hover:text-accent focus:text-accent'
              )}
            >
              {t('profile-sidebar-logout')}
            </button>
          </li>
        </ul>
        {/* End of bottom part menu */}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
